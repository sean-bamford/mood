import "./MakeEntry.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";
import { useState } from "react";
import Moods from "../Config/Moods";
import Factors from "../Config/Factors";
import Ratings from "../Config/Ratings";
import queryDatabase from "../Services/HttpService";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

const MakeEntry = () => {
  const [entry, setEntry] = useState<Entry>();
  const [showFactors, setShowFactors] = useState<boolean>(false);
  const [showMoods, setShowMoods] = useState<boolean>(false);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleRate = (rating: number) => {
    const newEntry = { Rating: rating, Date: new Date() };
    setEntry(newEntry);
    setShowMoods(true);
  };

  const handleMood = (subMood: string) => {
    const newEntry: Entry = {
      ...entry!,
      Mood: subMood,
    };
    setEntry(newEntry);
    setShowMoods(false);
    setShowFactors(true);
    //setShowContinue(true);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    factor: string
  ) => {
    if (isDragging) {
      const newValue = Math.max(
        0,
        value + Math.round(e.movementX / 4) - Math.round(e.movementY / 4)
      );
      setValue(newValue);
      const newFactor: Factor = {
        Name: factor,
        Rating: Math.round(Math.min(value / 8, 5)),
      };
      const newFactors = [
        ...factors.filter((f) => f.Name !== factor),
        newFactor,
      ];
      setFactors(newFactors);
      const newEntry: Entry = {
        ...entry!,
        Factors: factors,
      };
      setEntry(newEntry);
      console.log(entry);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setValue(0);
  };

  const handleSubmit = () => {
    function convertFactors(inputArray: Factor[]): { [key: string]: number } {
      const keyValuePairs: { [key: string]: number } = {};

      inputArray.forEach((item) => {
        if (item.Rating) {
          keyValuePairs[item.Name] = item.Rating;
        }
      });

      return keyValuePairs;
    }

    const f = Object.entries((convertFactors(entry.Factors)));
    console.log(Object.entries((entry.Factors)));
    const query = `MATCH (latestFactor:Factors)
    WITH latestFactor
    ORDER BY latestFactor.Date DESC
    LIMIT 1

    CREATE (newEntry:Entry {
      Mood: "${entry?.Mood}",
      Rating: ${entry?.Rating},
      Date: "${entry?.Date}"
    })

    CREATE (latestFactor)-[:Preceded]->(newEntry)
    
   
    CREATE (newFactor:Factors 
      ${f}
    )
    
  
    CREATE (latestFactor)-[:Coincided_With]->(newFactor)
    
    RETURN latestFactor, newEntry, newFactor
    `;
    console.log(f);
   console.log(query);
   // console.log(queryDatabase(query));}
   // navigate("/home");
  };

  return (
    <>
      <div className="header">
        <h1 className="title">Entry</h1>
        {!showFactors && !showMoods && (
          <p className="welcome">How are you feeling?</p>
        )}
      </div>
      <div className="content" onMouseUp={handleMouseUp}>
        {!showFactors && !showMoods && (
          <div className="selection">
            <button className="bubble" id="1" onClick={() => handleRate(1)}>
              Awful
            </button>
            <button className="bubble" id="2" onClick={() => handleRate(2)}>
              Iffy
            </button>
            <button className="bubble" id="3" onClick={() => handleRate(3)}>
              Neutral
            </button>
            <button className="bubble" id="4" onClick={() => handleRate(4)}>
              Good
            </button>
            <button className="bubble" id="5" onClick={() => handleRate(5)}>
              Excellent
            </button>{" "}
          </div>
        )}
        {!showFactors && showMoods && (
          <div className="selection">
            {Object.keys(Moods).map((mood) => {
              return (
                <div className="bubble factor">
                  <h2>{mood}</h2>
                  {Moods[mood].map((submood: string) => {
                    return (
                      <div className="submood">
                        <h3 onClick={() => handleMood(submood)}>{submood}</h3>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
        {showFactors && !showMoods && (
          <div className="selection">
            {Object.keys(Factors).map((factor) => {
              return (
                <div
                  className={
                    "bubble factor --" +
                    factors.find((f) => f.Name === factor)?.Rating
                  }
                  onMouseDown={handleMouseDown}
                  onMouseMove={(e) => handleMouseMove(e, factor)}
                  onMouseUp={handleMouseUp}
                >
                  <h2>{factor}</h2>
                  {
                    <h3 className="subfactor">
                      {factors.find((f) => f.Name === factor)?.Rating || " "}
                    </h3>
                  }
                </div>
              );
            })}
          </div>
        )}
      </div>
      {(showFactors || showMoods) && (
        <button className="submit" onClick={handleSubmit}>
          ✓
        </button>
      )}
      <button className="help">?</button>
    </>
  );
};
export default MakeEntry;

import "./MakeEntry.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";
import { useState } from "react";
import Moods from "../Config/Moods";
import Factors from "../Config/Factors";
import queryDatabase from "../Services/HttpService";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const MakeEntry = () => {
  const [entry, setEntry] = useState<Entry>();
  const [showFactors, setShowFactors] = useState<boolean>(false);
  const [showMoods, setShowMoods] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
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

  const handleMouseDown = (factor: string) => {
    const prevValue = factors.find((f) => f.Name === factor)?.Rating || 0;
    setValue(prevValue);
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
        Rating: Math.round(Math.min(value / 6, 5)),
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
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setValue(0);
  };

  const handleSubmit = () => {
    // function convertFactors(inputArray: Factor[]): { [key: string]: number } {
    //   const keyValuePairs: { [key: string]: number } = {};

    //   inputArray.forEach((item) => {
    //     if (item.Rating) {
    //       keyValuePairs[item.Name] = item.Rating;
    //     }
    //   });

    //   return keyValuePairs;
    // }

    // const parameters = { Factors: convertFactors(entry.Factors) };

    const query = `
    MATCH (previousEntry:Entry)
    WITH previousEntry
    ORDER BY previousEntry.Date DESC
    LIMIT 1

    CREATE (newEntry:Entry {Mood: $mood, Rating: $rating, Date: $date }),
    (sleep:Factor { Name: 'Sleep', Rating: $sleepRating }),
    (diet:Factor { Name: 'Diet', Rating: $dietRating }),
    (connection:Factor { Name: 'Social Connection', Rating: $socialConnectionRating }),
    (exercise:Factor { Name: 'Exercise', Rating: $exerciseRating }),
    (energy:Factor { Name: 'Energy', Rating: $energyRating }),
    (stress:Factor { Name: 'Stress', Rating: $stressRating }),
    (media:Factor { Name: 'Social Media Use', Rating: $socialMediaUseRating }),
    (sleep)-[:BEFORE]->(newEntry), 
    (sleep)-[:AFTER]->(previousEntry),
    (diet)-[:ON]->(newEntry),
    (diet)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(diet),
    (connection)-[:ON]->(newEntry),
    (connection)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(connection),
    (exercise)-[:ON]->(newEntry),
    (exercise)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(exercise),
    (energy)-[:ON]->(newEntry),
    (energy)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(energy),
    (stress)-[:ON]->(newEntry),
    (stress)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(stress),
    (media)-[:ON]->(newEntry),
    (media)-[:AFTER]->(previousEntry),
    (previousEntry)-[:BEFORE]->(media),
    (diet)-[:WITH]->(connection),
    (connection)-[:WITH]->(exercise),
    (exercise)-[:WITH]->(energy),
    (energy)-[:WITH]->(stress),
    (stress)-[:WITH]->(media),
    (previousEntry)-[:BEFORE]->(newEntry),
    (newEntry)-[:AFTER]->(previousEntry)
      `;

    const params = {
      mood: entry?.Mood,
      rating: entry?.Rating,
      date: entry?.Date.toLocaleDateString(),
      sleepRating: factors.find((f) => f.Name === "Sleep")?.Rating,
      dietRating: factors.find((f) => f.Name === "Diet")?.Rating,
      socialConnectionRating: factors.find((f) => f.Name === "Social Connection")?.Rating,
      exerciseRating: factors.find((f) => f.Name === "Exercise")?.Rating,
      energyRating: factors.find((f) => f.Name === "Energy")?.Rating,
      stressRating: factors.find((f) => f.Name === "Stress")?.Rating,
      socialMediaUseRating: factors.find((f) => f.Name === "Social Media Use")?.Rating
    };

    // console.log(query, params);
    queryDatabase(query, params).then((result) =>
      console.log(result?.summary?.counters.updates())
    );

    //   `
    //   MATCH (previousEntry:Entry)
    //   WITH previousEntry
    //   ORDER BY previousEntry.Date DESC
    //   LIMIT 1

    //   CREATE (newEntry:Entry {
    //     Mood: $mood,
    //     Rating: $rating,
    //     Date: $date,
    //     Factors: $factors
    //   })

    //   CREATE (previousEntry)-[:Preceded]->(newEntry)

    //   CREATE (newFactor:Factors { Factors: $factors })

    //   CREATE (latestFactor)-[:Coincided_With]->(newFactor)

    //   RETURN newEntry
    // `

    navigate("/");
  };
  const handleOpen = () => {
    setShowAbout(true);
  };
  const onClose = () => {
    setShowAbout(false);
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
        {showAbout &&
          createPortal(
            <div className="about">
              <h2>About</h2>
              <div>
                Click on one of the boxes to rate how you feel today. You can
                optionally click on a mood to record a specific emotion, then
                click and drag on any lifestyle factors to rate them for the day
                and determine any patterns over time.{" "}
              </div>
              <br />
              <button className="close" onClick={onClose}>
                Close
              </button>
            </div>,
            document.body
          )}

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
                <div className="bubble factor" key={mood}>
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
                  onMouseDown={() => handleMouseDown(factor)}
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
      <button className="help" onClick={handleOpen}>
        ?
      </button>
    </>
  );
};
export default MakeEntry;

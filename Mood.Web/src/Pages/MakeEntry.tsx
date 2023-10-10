import "./MakeEntry.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";
import { useState, useEffect } from "react";
import Moods from "../Config/Moods";
import Factors from "../Config/Factors";
import Ratings from "../Config/Ratings";

const MakeEntry = () => {
  const [entry, setEntry] = useState<Entry>();
  const [showFactors, setShowFactors] = useState<boolean>(false);
  const [showMoods, setShowMoods] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [factors, setFactors] = useState<Factor[]>([]);

  const handleMood = (rating: number) => {
    const newEntry = { Rating: rating, Date: new Date() };
    setEntry(newEntry);
    setShowFactors(!showFactors);
  };

  return (
    <>
      <div className="header">
        <h1 className="title">Entry</h1>
        {!showFactors && !showMoods && !showNote && <p className="welcome">How are you feeling?</p>}
      </div>
      <div className="content">
        {!showFactors && !showMoods && !showNote && (
          <div className="selection">
            <button className="bubble" id="1" onClick={() => handleMood(1)}>
              Awful
            </button>
            <button className="bubble" id="2" onClick={() => handleMood(2)}>
              Iffy
            </button>
            <button className="bubble" id="3" onClick={() => handleMood(3)}>
              Neutral
            </button>
            <button className="bubble" id="4" onClick={() => handleMood(4)}>
              Good
            </button>
            <button className="bubble" id="5" onClick={() => handleMood(5)}>
              Excellent
            </button>{" "}
          </div>
        )}
        {showFactors && !showMoods && !showNote && (
          <div className="selection">
            {Object.keys(Factors).map((factor) => {
              return (
                <button
                  className="bubble factor"
                  id={factor}
                >
                  {factor}
                  {Factors[factor].map((subfactor) => {
                    return (
                      <p
                        className="subfactor"
                        id={subfactor}
                      >
                        {subfactor}
                      </p>
                    );
                  })}
                </button>
              );
            })}
          </div>
        )}
        {!showFactors && showMoods && !showNote && (
          <div className="selection">
            <button className="bubble" id="1" onClick={() => handleMood(1)}>
              Awful
            </button>
            <button className="bubble" id="2" onClick={() => handleMood(2)}>
              Iffy
            </button>
            <button className="bubble" id="3" onClick={() => handleMood(3)}>
              Neutral
            </button>
            <button className="bubble" id="4" onClick={() => handleMood(4)}>
              Good
            </button>
            <button className="bubble" id="5" onClick={() => handleMood(5)}>
              Excellent
            </button>{" "}
          </div>
        )}
        {!showFactors && !showMoods && showNote && (
          <div className="selection">
            <button className="bubble" id="1" onClick={() => handleMood(1)}>
              Awful
            </button>
            <button className="bubble" id="2" onClick={() => handleMood(2)}>
              Iffy
            </button>
            <button className="bubble" id="3" onClick={() => handleMood(3)}>
              Neutral
            </button>
            <button className="bubble" id="4" onClick={() => handleMood(4)}>
              Good
            </button>
            <button className="bubble" id="5" onClick={() => handleMood(5)}>
              Excellent
            </button>{" "}
          </div>
        )}
      </div>
    </>
  );
};
export default MakeEntry;

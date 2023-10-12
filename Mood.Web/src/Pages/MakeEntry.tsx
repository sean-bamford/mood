import "./MakeEntry.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";
import { useState, useEffect } from "react";
import Moods from "../Config/Moods";
import Factors from "../Config/Factors";
import Ratings from "../Config/Ratings";
import DragInput from "../Components/DragInput";


const MakeEntry = () => {
  const [entry, setEntry] = useState<Entry>();
  const [showFactors, setShowFactors] = useState<boolean>(false);
  const [showMoods, setShowMoods] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showContinue, setShowContinue] = useState<boolean>(false);
  const [factors, setFactors] = useState<Factor[]>([]);

  const handleMood = (rating: number) => {
    const newEntry = { Rating: rating, Date: new Date() };
    setEntry(newEntry);
    setShowContinue(true);
  };

  const handleContinue = (response: boolean) => {
    if (response) {
      setShowMoods(false);
      setShowFactors(true);
      setShowContinue(false);
    } else {
      setShowMoods(false);
      setShowFactors(false);
      setShowNote(false);
      setShowContinue(false);
      if (entry) {
        handleSubmit(entry);
      }
    }
  };

  const handleFactor = (factor: Factor) => {
    const newFactors = [...factors, factor];
    setFactors(newFactors);
    setShowContinue(true);
    setShowFactors(!showFactors);
    setShowMoods(!showMoods);
  };

  const handleSubmit = (entry: Entry) => {};

  return (
    <>
      <div className="header">
        <h1 className="title">Entry</h1>
        {!showFactors && !showMoods && !showNote && !showContinue && (
          <p className="welcome">How are you feeling?</p>
        )}
      </div>
      <DragInput />
      <div className="content">
        {!showFactors && !showMoods && !showNote && !showContinue && (
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
        {!showFactors && !showMoods && !showNote && showContinue && (
          <>
            <div className="selection">
            <p className="question">Track lifestyle factors?<br /><button className="continue" onClick={() => handleContinue(true)}>
                ✓
              </button>
              <button
                className="continue x"
                onClick={() => handleContinue(false)}
              >
                ×
              </button></p>
            
            </div>
          </>
        )}
        {showFactors && !showMoods && !showNote && (
          <div className="selection">
            {Object.keys(Factors).map((factor) => {
              return (
                <button className="bubble factor" id={factor}>
                  {factor}
                  {Factors[factor].map((subfactor) => {
                    return (
                      <p className="subfactor" id={subfactor}>
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
      {/* <button className="submit">Submit</button> */}
      <button className="help">?</button>
    </>
  );
};
export default MakeEntry;

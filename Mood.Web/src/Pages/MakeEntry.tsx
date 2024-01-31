import "./MakeEntry.css";
import { Entry } from "../Types/Entry";
import Factor from "../Types/Factor";
import { useEffect, useState } from "react";
import Moods from "../Config/Moods";
import Factors from "../Config/Factors";
import queryDatabase from "../Services/HttpService";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const MakeEntry = () => {
  const [entry, setEntry] = useState<Entry>();
  const [showFactors, setShowFactors] = useState<boolean>(false);
  const [showMoods, setShowMoods] = useState<boolean>(false);
  const [isFirstEntry, setIsFirstEntry] = useState<boolean>(false);
  const [isSameDayPost, setIsSameDayPost] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [value, setValue] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { //check if this is the first entry
    const loadData = async () => {
      await queryDatabase(`MATCH (e:Entry) RETURN COUNT(e) AS entryCount;`).then(async (res): Promise<void> => {
        if (res?.records[0].get(0).toNumber() == 0) { setIsFirstEntry(true); setShowAbout(true) }
        else {
          const today = new Date();
          await queryDatabase(`MATCH (n:Entry) WHERE n.Date = $date RETURN n;`, { date: today.toLocaleDateString() })
            .then(async (res): Promise<void> => { if (res?.records?.length ?? 0 > 0) { setIsSameDayPost(true) } })
        }
      })
    };
    loadData();
  }, []);

  useEffect(() => {
    if(isSameDayPost && entry?.Mood !== undefined && entry?.Rating !== undefined) {
    handleSubmit();
    navigate("/");}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, isSameDayPost]);

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
    if(!isSameDayPost) {
      setShowFactors(true);
      }
    }

  const handleMouseDown = (factor: string) => {
    let prevValue = factors.find((f) => f.Name === factor)?.Rating;
    if (prevValue === undefined) { prevValue = 24 } else { prevValue = prevValue * 24 } // We set the rating by dividing the number of pixels traversed by 24, so when reading the rating we need to multiply by 24 to ensure the rating isn't reset to 0 when rounded down.
    setValue(prevValue);
    setIsDragging(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    factor: string
  ) => {
    if (isDragging) {
      const newValue = value + Math.round(e.movementX) - Math.round(e.movementY)
      if (newValue > 0) {
        setValue(newValue)
        const newFactor: Factor = {
          Name: factor,
          Rating: Math.round(Math.min(value / 24, 5)),
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
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {

    //create query parameters for Entry and Factors
    const params: { [key: string]: unknown } = {
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
    //Remove any Factors that haven't been rated (and are thus undefined)
    Object.entries(params).forEach(([property, value]) => {
      if (value === undefined) delete params[property];
    });

    let query = `CREATE (newEntry:Entry {Mood: $mood, Rating: $rating, Date: $date })`

    if (!isFirstEntry) {
      query = 
        `MATCH (previousEntry:Entry)
        WITH previousEntry
        ORDER BY previousEntry.Date DESC
        LIMIT 1 \n` + query +
        `, (previousEntry)-[:BEFORE]->(newEntry),
        (newEntry)-[:AFTER]->(previousEntry)`
    }

    if (entry?.Factors?.length === 7 && !isSameDayPost ) {
      query += `, (sleep:Factor { Name: 'Sleep', Rating: $sleepRating }),
      (diet:Factor { Name: 'Diet', Rating: $dietRating }),
      (connection:Factor { Name: 'Social Connection', Rating: $socialConnectionRating }),
      (exercise:Factor { Name: 'Exercise', Rating: $exerciseRating }),
      (energy:Factor { Name: 'Energy', Rating: $energyRating }),
      (stress:Factor { Name: 'Stress', Rating: $stressRating }),
      (media:Factor { Name: 'Social Media Use', Rating: $socialMediaUseRating }),
      (sleep)-[:BEFORE]->(newEntry), 
      (diet)-[:ON]->(newEntry),
      (connection)-[:ON]->(newEntry),
      (exercise)-[:ON]->(newEntry),
      (energy)-[:ON]->(newEntry),
      (stress)-[:ON]->(newEntry),
      (media)-[:ON]->(newEntry),
      (diet)-[:WITH]->(connection),
      (connection)-[:WITH]->(exercise),
      (exercise)-[:WITH]->(energy),
      (energy)-[:WITH]->(stress),
      (stress)-[:WITH]->(media)`

      if (!isFirstEntry && !isSameDayPost) {
        query += `, (sleep)<-[:AFTER]-(previousEntry),
      (diet)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(diet),
      (connection)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(connection),
      (exercise)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(exercise),
      (energy)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(energy),
      (stress)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(stress),
      (media)-[:AFTER]->(previousEntry),
      (previousEntry)-[:BEFORE]->(media)`
      }
    }

    queryDatabase(query, params)
    .catch(() => {return})
    navigate("/");
  };

  const handleBack = () => {
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
                Click on the boxes to rate how you feel today. You can
                optionally click a mood to record a specific emotion, then
                click and drag on any lifestyle factors to rate them for the day
                and determine any patterns over time.{" "}{entry?.Mood}
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
        {showFactors && !showMoods && !isSameDayPost &&(
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
      {showFactors && (entry?.Factors?.length === 7 || entry?.Factors?.length === undefined) && (
        <><button className="submit" onClick={handleSubmit}>
          ✓
        </button></>
      )} <button className="back" onClick={handleBack} title="Back to Home">
        ←
      </button>
      <button className="help" onClick={handleOpen} title="About">
        ?
      </button>
    </>
  );
};
export default MakeEntry;

//copy of working query in case of grave mistakes
// `
//     MATCH (previousEntry:Entry)
//     WITH previousEntry
//     ORDER BY previousEntry.Date DESC
//     LIMIT 1

//     CREATE (newEntry:Entry {Mood: $mood, Rating: $rating, Date: $date }),
//     (sleep:Factor { Name: 'Sleep', Rating: $sleepRating }),
//     (diet:Factor { Name: 'Diet', Rating: $dietRating }),
//     (connection:Factor { Name: 'Social Connection', Rating: $socialConnectionRating }),
//     (exercise:Factor { Name: 'Exercise', Rating: $exerciseRating }),
//     (energy:Factor { Name: 'Energy', Rating: $energyRating }),
//     (stress:Factor { Name: 'Stress', Rating: $stressRating }),
//     (media:Factor { Name: 'Social Media Use', Rating: $socialMediaUseRating }),
//     (sleep)-[:BEFORE]->(newEntry),
//     (sleep)-[:AFTER]->(previousEntry),
//     (diet)-[:ON]->(newEntry),
//     (diet)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(diet),
//     (connection)-[:ON]->(newEntry),
//     (connection)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(connection),
//     (exercise)-[:ON]->(newEntry),
//     (exercise)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(exercise),
//     (energy)-[:ON]->(newEntry),
//     (energy)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(energy),
//     (stress)-[:ON]->(newEntry),
//     (stress)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(stress),
//     (media)-[:ON]->(newEntry),
//     (media)-[:AFTER]->(previousEntry),
//     (previousEntry)-[:BEFORE]->(media),
//     (diet)-[:WITH]->(connection),
//     (connection)-[:WITH]->(exercise),
//     (exercise)-[:WITH]->(energy),
//     (energy)-[:WITH]->(stress),
//     (stress)-[:WITH]->(media),
//     (previousEntry)-[:BEFORE]->(newEntry),
//     (newEntry)-[:AFTER]->(previousEntry)
//       `
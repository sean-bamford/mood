import queryDatabase from "../Services/HttpService";
import { useEffect, useState } from "react";
import { EagerResult, Record, RecordShape } from "neo4j-driver";
import "./History.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";

const History = () => {
  const [records, setRecords] = useState<RecordShape[]>();
  const [entries, setEntries] = useState<Entry[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshResults = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const loadData = async () => {
      const result: EagerResult | null = await queryDatabase(
        `MATCH (mood:Mood) RETURN mood`
      );
      if (result) {
        setRecords(result.records.map((record: Record) => record.toObject()));
      } else {
        console.log("no result");
      }
    };
    loadData();
  }, [refresh]);

  function convertToEntry(record: RecordShape, factors: Factor[] = []): Entry {
    const properties = Object(record.mood.properties);
    const entry: Entry = {
      Date: properties.Date,
      Rating: properties.Rating.toInt(),
      Mood: properties.Mood || properties.Quality,
      Factors: factors,
      Note: properties.Note,
    };
    return entry;
  }

  useEffect(() => {
    if (records) {
      const list: Array<Entry> = records.map((record: RecordShape) => {
        return convertToEntry(record);
      });
      setEntries(list);
    }
  }, [records]);

  return (
    <>
      <div className="header">
        <h1>History</h1>
        <p>View your past entries.</p>
      </div>
      <div className="content">
        <div className="history">
          { entries ?
          entries.map((entry) => (
            <div
              className={"--" + entry.Rating + " entry"}
                key={entry.Date.toString()}
            >
              <span className="date">
                <span>{entry.Date.toString()}</span>
              </span>
              <h2 className="mood">{entry.Mood}</h2>
              <span className="rating">{entry.Rating}</span>
              {entry.Factors && entry.Factors.map((factor) => <span>{factor.Name}</span>)}
            </div>
          )) : null }
        </div>

        <br />
      </div>
      <button className="refresh" onClick={refreshResults}>
        ↻
      </button>
    </>
  );
};
export default History;

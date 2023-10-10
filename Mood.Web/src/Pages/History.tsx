import queryDatabase from "../Services/HttpService";
import { useEffect, useState } from "react";
import { EagerResult, Record, RecordShape } from "neo4j-driver";
import "./History.css";

const History = () => {
  const [records, setRecords] = useState<RecordShape[]>();
  const [entries, setEntries] = useState<object[]>();
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

  useEffect(() => {
    if (records) {
      setEntries(records.flatMap((entry) => Object(entry.mood.properties)));
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
          {entries?.map((entry) => (
            <div
              className={"--" + entry.Rating.toInt() + " entry"}
              key={entry.Date}
            >
              <span className="date">{entry.Date}</span>
              <h2 className="quality">{entry.Quality}</h2>
              <span className="rating">{entry.Rating.toInt()}</span>
            </div>
          ))}
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

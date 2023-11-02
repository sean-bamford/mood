import queryDatabase from "../Services/HttpService";
import { useEffect, useState } from "react";
import { EagerResult, Record, RecordShape } from "neo4j-driver";
import { useNavigate } from "react-router-dom";
import "./History.css";
import Entry from "../Types/Entry";
import Factor from "../Types/Factor";

const History = () => {
  const [records, setRecords] = useState<RecordShape[]>();
  const [entries, setEntries] = useState<Entry[]>();
  const [factors, setFactors] = useState<Factor[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();

  const refreshResults = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const loadData = async () => {
      const result: EagerResult | null = await queryDatabase(
        `MATCH (entry:Entry) WITH entry ORDER BY entry.Date DESC RETURN entry`
      );
      if (result) {
        setRecords(result.records.map((record: Record) => record.toObject()));
      } else {
        console.log("no result");
      }
    };
    loadData();
  }, [refresh]);

  function convertToEntry(record: RecordShape): Entry {
    const properties = Object(record.entry.properties);
    const entry: Entry = {
      Date: properties.Date,
      Rating: properties.Rating,
      Mood: properties.Mood,
    };
    return entry;
  }

  function convertToFactors(result: EagerResult) {
    const factors: Factor[] = result.records.map((record) => {
      return record.get(0).properties;
    });
    return factors;
  }

  useEffect(() => {
    if (records) {
      const list: Array<Entry> = records.map((record: RecordShape) => {
        return convertToEntry(record);
      });
      setEntries(list);
    }
  }, [records]);

  // useEffect(() => {
  //   entries?.find((entry) => {
  //  const newEntries = ...entries

  // }, [factors]);

  const handleBack = () => {
    navigate("/");
  };

  const handleReset = () => {
    const query = `
    MATCH (n)
    DETACH DELETE n
    `;
    queryDatabase(query).then((result) =>
      console.log(result?.summary?.counters.updates())
    );
  };

  const handleViewFactors = async (entry: Entry) => {
    const query = `
      MATCH (selectedEntry:Entry)
      WHERE selectedEntry.Date = $date
      WITH selectedEntry
      MATCH (f:Factor)-[:ON]-(selectedEntry)
      RETURN f
      UNION
      MATCH (selectedEntry:Entry)
      WHERE selectedEntry.Date = $date
      WITH selectedEntry
      MATCH(selectedEntry)<-[:BEFORE]-(f:Factor{Name: "Sleep"})
      RETURN f`;
    const params = {
      date: entry.Date.toString(),
    };
    try {
      const result = await queryDatabase(query, params);
      console.log(result?.records);
      if (result?.records) {
        setFactors(convertToFactors(result));
        const newEntries: Entry[] = entries ? [...entries] : [];
        const index = newEntries.findIndex((e) => e === entry);
        if (index !== -1) {
          newEntries[index] = { ...entry, Factors: factors };
          setEntries(newEntries);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetFactors = () => 
    {
      setFactors(undefined);
    }

  return (
    <>
      <div className="header">
        <h1 className="title">History</h1>
        <p>View your past entries.</p>
      </div>
      <div className="content">
        <div className="history selection">
          {entries
            ? entries.map((entry, index) => (
                <div
                  className={"--" + entry.Rating + " entry"}
                  key={index}
                  onClick={() => handleViewFactors(entry)}
                >
                  {entry.Factors ? (
                    <div className="factorList">
                      {factors?.map((factor) => (
                        <div className={"--" + factor.Rating} onClick={handleResetFactors}>
                          {factor.Name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <span className="date">
                        <span>{entry.Date.toString()}</span>
                      </span>
                      <h2 className="mood">{entry.Mood}</h2>
                      <span className="rating">{entry.Rating.valueOf()}</span>
                    </>
                  )}
                </div>
              ))
            : null}
        </div>

        <br />
      </div>
      <button className="back" onClick={handleBack}>
        ←
      </button>
      <button className="refresh" onClick={handleReset}>
        ↻
      </button>
    </>
  );
};
export default History;

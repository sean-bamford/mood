import queryDatabase from "../Services/HttpService";
import { useEffect, useState } from "react";
import { EagerResult, Record, RecordShape } from "neo4j-driver";
import { useNavigate } from "react-router-dom";
import "./History.css";
import { ViewEntry } from "../Types/Entry";
import Factor from "../Types/Factor";

const History = () => {
  const [records, setRecords] = useState<RecordShape[]>();
  const [entries, setEntries] = useState<ViewEntry[]>();
  const navigate = useNavigate();

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
  }, []);

  function convertToEntry(record: RecordShape): ViewEntry {
    const properties = Object(record.entry.properties);
    const entry: ViewEntry = {
      Date: properties.Date,
      Rating: properties.Rating,
      Mood: properties.Mood,
      Viewing: false,
    };
    return entry;
  }

  function convertToFactors(result: EagerResult) {
    const factors: Factor[] = result.records.map((record) => {
      return record.get(0).properties;
    });
    return factors.sort((a, b) => {
      if (a.Name < b.Name) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  useEffect(() => {
    if (records) {
      const list: Array<ViewEntry> = records.map((record: RecordShape) => {
        return convertToEntry(record);
      });
      setEntries(list);
    }
  }, [records]);

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

  const toggleView = (entry: ViewEntry) => {
    const newEntries: ViewEntry[] = entries ? [...entries] : [];
    const index = newEntries.findIndex((e) => e === entry);
    if (index !== -1) {
      newEntries[index] = { ...entry, Viewing: !entry.Viewing };
      setEntries(newEntries);
    }
  };

  useEffect(() => {
    const handleViewFactors = async (entry: ViewEntry) => {
      if (entry.Viewing && !entry.Factors) {
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

        const params = { date: entry.Date.toString() };

        try {
          const result = await queryDatabase(query, params);
          if (result?.records) {
            const newEntries: ViewEntry[] = entries ? [...entries] : [];
            const index = newEntries.findIndex((e) => e === entry);
            if (index !== -1) {
              newEntries[index] = {
                ...entry,
                Factors: convertToFactors(result),
              };
              setEntries(newEntries);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (entries) {
      entries.forEach((entry) => {
        if (entry.Viewing && !entry.Factors) {
          handleViewFactors(entry);
        }
      });
    }
  }, [entries]);

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
                  className={
                    "--" +
                    entry.Rating +
                    " entry" +
                    (entry.Viewing ? " viewing" : "")
                  }
                  key={index}
                  onClick={() => toggleView(entry)}
                >
                  {entry.Viewing ? (
                    <span className="factorList">
                      {entry.Factors?.map((factor, index) => (
                        <span className={"--" + factor.Rating + " factor"} key={index}>
                          {factor.Name + " "}
                        </span>
                      ))}
                    </span>
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

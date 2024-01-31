import queryDatabase from "../Services/HttpService";
import { useEffect, useState } from "react";
import { EagerResult, Record, RecordShape } from "neo4j-driver";
import { useNavigate } from "react-router-dom";
import "./History.css";
import { ViewEntry } from "../Types/Entry";
import Factor from "../Types/Factor";
import { createPortal } from "react-dom";

const History = () => {
  const [records, setRecords] = useState<RecordShape[]>();
  const [entries, setEntries] = useState<ViewEntry[]>();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const result: EagerResult | null = await queryDatabase(
        `MATCH (entry:Entry) WITH entry ORDER BY entry.Date DESC RETURN entry`
      );
      if (result) {
        setRecords(result.records.map((record: Record) => record.toObject()));
        if (records?.length === 0) {
          setLoadingMessage("No entries found.");
        }
      } else {
        console.log("no result");
      }
    };
    loadData();
  }, []);

  function convertToEntry(record: RecordShape): ViewEntry {
    const properties = Object(record.entry.properties);
    const entry: ViewEntry = {
      Date: new Date(properties.Date),
      Rating: properties.Rating,
      Mood: properties.Mood,
      Viewing: false,
      Loaded: false
    };
    return entry;
  }

  function convertToFactors(result: EagerResult) {
    const factors: Factor[] = result.records.map((record) => {
      return record.get(0).properties;
    });
    return factors.sort((a, b) => {
      if (a.Name.length < b.Name.length) {
        return -1;
      } else {
        return 0;
      }
    }).reverse();
  }

  useEffect(() => {
    if (records) {
      const list: Array<ViewEntry> = records.map((record: RecordShape) => {
        return convertToEntry(record);
      }).sort((a, b) => a.Date.getTime() - b.Date.getTime()).reverse();
      setEntries(list);
    }
  }, [records]);

  const handleBack = () => {
    navigate("/");
  };

  const handleReset = () => {
    setShowWarning(true);
  };

  const onConfirm = () => {
    setShowWarning(false);
    const query = `
    MATCH (n)
    DETACH DELETE n
    `;
    queryDatabase(query).then((result) =>
      console.log(result?.summary?.counters.updates())
    );
    navigate("/history");
  }; 
  const onClose = () => {
    setShowWarning(false);
  }



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
      if (entry.Viewing && !entry.Factors && !entry.Loaded) {
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

        const params = { date: entry.Date.toLocaleDateString() };

        try {
          const result = await queryDatabase(query, params);
          if (result?.records) {
            const newEntries: ViewEntry[] = entries ? [...entries] : [];
            const index = newEntries.findIndex((e) => e === entry);
            if (index !== -1) {
              newEntries[index] = {
                ...entry,
                Factors: convertToFactors(result),
                Loaded: true
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
        {showWarning &&
          createPortal(
            <div className="about">
              <h2>Reset History?</h2>
              <div>
                Click Confirm to erase your entry history. This cannot be undone.
              </div>
              <br />
              <div className="clearButtons">
              <button className="clear" onClick={onConfirm}>
                Confirm
              </button>
              <button className="clear" onClick={onClose}>
                Close
              </button>
              </div>
            </div>,
            document.body
          )}
        <div className="history selection">
          {entries
            ? entries.map((entry, index) => (
              <div
                className={
                  "--" +
                  entry.Rating +
                  " entry" +
                  (entry.Viewing ? " viewing" : "") + (entry.Factors && !entry.Viewing ? " reverse" : "")
                }
                key={index}
                onClick={() => toggleView(entry)}
              >
                <>
                  <span className="date">
                    <span>{entry.Date.toLocaleDateString()}</span>
                  </span>
                  <h2 className="mood">{entry.Mood}</h2>
                  <span className="rating">{entry.Rating.valueOf()}</span>
                </>
                <span className="factorList">
                  {entry.Factors?.length ? (entry.Factors?.map((factor, index) => (
                    <span className={"--" + factor.Rating + " factor"} key={index}>
                      {factor.Name+ " "}
                    </span>
                  ))) : <span className={entry.Loaded ? "emptyFactors none" : "emptyFactors"}>{entry.Loaded ? "No factors recorded." : "Loading Factors..."}</span>}
                </span>
              </div>
            ))
            : <div className="loading">{loadingMessage}</div>}
        </div>

        <br />
      </div>
      <button className="back" onClick={handleBack} title="Back to Home">
        ←
      </button>
      <button className="refresh" onClick={handleReset} title="Reset History">
        ↻
      </button>
    </>
  );
};

export default History;

import "./Entry.css";
const Entry = () => (
  <>
    <div className="header">
      <h1 className="title">Entry</h1>
      <p className="welcome">How are you feeling?</p>
    </div>
    <div className="content">
      <div className="selection">
        <button className="bubble" id="happy">
          Awful
        </button>
        <button className="bubble" id="neutral">
          Iffy
        </button>
        <button className="bubble" id="sad">
          Neutral
        </button>
        <button className="bubble" id="sad">
          Good
        </button>
        <button className="bubble" id="sad">
          Excellent
        </button>
      </div>
    </div>
  </>
);
export default Entry;

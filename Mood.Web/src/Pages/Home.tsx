import { NavLink } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <>
    <div className="header">
      <h1 className="title">Mood.</h1>
      <p className="welcome">Welcome, user.</p>
    </div>
    <div className="content">
      <div className="nav">
        <NavLink to="/make-entry" className="bubble nav">
          Make an Entry
        </NavLink>
        <NavLink to="/history" className="bubble nav">
          View History
        </NavLink>
        <NavLink to="/pattern" className="bubble nav">
          Patterns
        </NavLink>
      </div>
    </div>
    {/* <button className="help">?</button> */}
  </>
);
export default Home;

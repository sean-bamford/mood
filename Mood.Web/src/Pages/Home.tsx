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
        <NavLink to="/entry" className="bubble entry-nav">
          Make an Entry
        </NavLink>
        <NavLink to="/history" className="bubble history-nav">
          View History
        </NavLink>
        <NavLink to="/pattern" className="bubble pattern-nav">
          Patterns
        </NavLink>
      </div>
    </div>
    <button className="help">?</button>
  </>
);
export default Home;

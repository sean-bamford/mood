import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useState, useEffect } from "react";

const Home = () => {
  const [fadeNav, setFadeNav] = useState(false);
  const [destination, setDestination] = useState<string>();
  const navigate = useNavigate();
  useEffect(() => {
    if (fadeNav) {
  
      // Wait for the animation to complete before removing the element from the DOM
      const timeoutId = setTimeout(() => {
        // Set fadeOut back to false after the animation duration
        if (destination) {
          navigate(destination);
        }
        setFadeNav(false);
      }, 600); // Adjust the timeout based on your CSS animation duration
  
      // Clear the timeout when the component unmounts or when showAbout is set to true
      return () => clearTimeout(timeoutId);
    }
  }, [destination, fadeNav, navigate]);

  const handleNav = (link: string) => {
    setFadeNav(true);
    setDestination(link);
  }

  return(
  <>
    <div className="header">
      <h1 className="title">Mood.</h1>
      <p className="subtitle">Welcome, user.</p>
    </div>
    <div className="content">
      <div className={`nav ${fadeNav ? 'fadeNav' : ''}`}>
        <div onClick={() =>handleNav("/make-entry")} className="bubble nav">
          Make an Entry
        </div>
        <div onClick={() =>handleNav("/history")} className="bubble nav">
          View History
        </div>
        <div onClick={() =>handleNav("/pattern")} className="bubble nav">
          Patterns
        </div>
      </div>
    </div>
    {/* <button className="help">?</button> */}
  </>
  )
};
export default Home;

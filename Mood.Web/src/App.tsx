import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <div className="fader" />
      <Outlet />
    </div>
  );
}

export default App;

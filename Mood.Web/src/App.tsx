import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <Outlet />
    </div>
  );
}

export default App;

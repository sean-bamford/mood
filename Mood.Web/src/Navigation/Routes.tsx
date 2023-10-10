import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Entry from "../Pages/MakeEntry";
import History from "../Pages/History";
import Pattern from "../Pages/Pattern";
import Login from "../Pages/Login";
import App from "../App";
import MakeEntry from "../Pages/MakeEntry";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/make-entry", element: <MakeEntry /> },
      { path: "/history", element: <History /> },
      { path: "/pattern", element: <Pattern /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

export default Routes;

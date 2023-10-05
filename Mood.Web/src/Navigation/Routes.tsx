import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Entry from "../Pages/Entry";
import History from "../Pages/History";
import Pattern from "../Pages/Pattern";
import Login from "../Pages/Login";

const Routes = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/entry", element: <Entry /> },
  { path: "/history", element: <History /> },
  { path: "/pattern", element: <Pattern /> },
  { path: "/login", element: <Login /> },
]);

export default Routes;

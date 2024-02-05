import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import History from "../Pages/History";
import Pattern from "../Pages/Pattern";
import Login from "../Pages/Login";
import App from "../App";
import MakeEntry from "../Pages/MakeEntry";
import Test from "../Pages/Test";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/make-entry", element: <MakeEntry /> },
      { path: "/history", element: <History /> },
      { path: "/pattern", element: <Pattern /> },
      { path: "/login", element: <Login /> },
      { path: "/test", element: <Test /> },
    ],
  },
]);

export default Routes;

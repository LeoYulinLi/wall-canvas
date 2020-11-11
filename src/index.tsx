import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/app/App";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Credits from "./components/credits/Credits";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={ App } />
        <Route exact path="/credits" component={ Credits } />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);


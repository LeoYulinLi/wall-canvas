import React, { FC, useEffect } from "react";
import styles from "./App.module.scss";
import { Container } from "react-bootstrap";
import Panel from "../panel/Panel";
import { Link } from "react-router-dom";

const App: FC = () => {


  return (
    <Container className={styles.appContainer}>
      <div className={styles.appHeader}>
        <h1>Wall Canvas</h1>
        <p>A Graffiti Wall Canvas where Paint Looks Like Actual Paint</p>
        <ul className={styles.nav}>
          <li><a href="https://github.com/LeoYulinLi/wall-canvas" target="_blank" rel="noopener noreferrer">Source Code and Behind the Scene</a></li>
          <li><Link to="/credits">Credits</Link></li>
        </ul>
      </div>
      <Panel
        canvasWidth={screen.width > 800 ? 800 : screen.width}
        canvasHeight={screen.height - 100 > 600 ? 600 : screen.height - 100 } />
    </Container>
  );
};

export default App;

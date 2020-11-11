import React, { FC } from "react";
import styles from "./App.module.scss";
import { Container } from "react-bootstrap";
import Panel from "../panel/Panel";

const App: FC = () => {
  return (
    <Container className={styles.appContainer}>
      <div className={styles.appHeader}>
        <h1>Wall Canvas</h1>
        <p>A Graffiti Wall Canvas where Paint Looks Like Actual Paint</p>
        <a href="https://github.com/LeoYulinLi/wall-canvas">Source Code and Behind the Scene</a>
      </div>
      <Panel
        canvasWidth={screen.width > 800 ? 800 : screen.width}
        canvasHeight={screen.height - 100 > 600 ? 600 : screen.height - 100 } />
    </Container>
  );
};

export default App;

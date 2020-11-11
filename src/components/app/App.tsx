import React, { FC } from "react";
import styles from "./App.module.scss";
import { Container } from "react-bootstrap";
import Panel from "../panel/Panel";

const App: FC = () => {
  return (
    <Container className={styles.appContainer}>
      <h1 className={styles.appHeader}>Wall Canvas</h1>
      <Panel
        canvasWidth={screen.width > 800 ? 800 : screen.width}
        canvasHeight={screen.height - 100 > 600 ? 600 : screen.height - 100 } />
    </Container>
  );
};

export default App;

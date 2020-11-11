import { Container } from "react-bootstrap";
import React, { FC } from "react";
import styles from "./Credits.module.scss";
import { Link } from "react-router-dom";

const Credits: FC = () => {
  return (
    <Container className={styles.creditContainer}>
      <div className={styles.creditHeader}>
        <h1>Credits / Resources Used</h1>
        <Link to="/">Go back to Home Page</Link>
      </div>
      <ul>
        <li>
          Favicon: Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
        </li>
        <li>
          Bootstrap Theme: <a href="https://bootswatch.com/sketchy">Bootswatch Sketchy</a>
        </li>
        <li>
          Brush Style: <a href="http://perfectionkills.com/exploring-canvas-drawing-techniques/">Exploring canvas drawing techniques</a>
        </li>
        <li>
          Reflection Model: <a href="https://en.wikipedia.org/wiki/Phong_reflection_model">Phong reflection model</a>
        </li>
      </ul>
    </Container>
  );
};

export default Credits;

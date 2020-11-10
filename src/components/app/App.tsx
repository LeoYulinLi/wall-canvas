import React, { FC } from "react";
import logo from "../../assets/logo.svg";
import styles from "./App.scss";
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Panel from "../panel/Panel";

const App: FC = () => {
  return (
    <>
      <Navbar expand="lg" fixed="top" variant="dark" bg="primary">
        <Navbar.Brand href="#home">Wall Canvas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Panel />
      </Container>
    </>
  );
};

export default App;

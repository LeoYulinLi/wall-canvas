import React, { Dispatch, FC, SetStateAction, useState } from "react";
import styles from "./Palette.module.scss";
import { CompactPicker } from "react-color";
import { Button, Form, Modal } from "react-bootstrap";

interface PaletteTypes {
  strokeColor: string,
  setStrokeColor: Dispatch<SetStateAction<string>>
  strokeWidth: number,
  setStrokeWidth: Dispatch<SetStateAction<number>>
  clearDrawing: () => void,
  saveDrawing: () => void
}

const Palette: FC<PaletteTypes> = props => {

  // eslint-disable-next-line react/prop-types
  const { strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, clearDrawing, saveDrawing } = props;

  const colors = [
    "#000000",
    "#ffffff",
    "#d00000",
    "#ea8c00",
    "#eac300",
    "#00a000",
    "#b7ea00",
    "#0000c0",
    "#00c7ea",
    "#7500ea",
    "#bf00ea",
    "#ea00b0",
    "#555555",
    "#d2d2d2",
    "#ffc6c6",
    "#ffd999",
    "#fff0ab",
    "#adffad",
    "#ecffb2",
    "#9ad7ff",
    "#9affe8",
    "#9d9aff",
    "#e4a8f3",
    "#ff9ae6"
  ];

  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.palette}>
      <CompactPicker onChange={color => setStrokeColor(color.hex)} color={strokeColor} colors={colors} className={styles.colorPicker}/>
      <Form>
        <Form.Group controlId="strokeWidth" className={styles.strokePicker}>
          <Form.Label>Stroke Width: {strokeWidth}</Form.Label>
          <Form.Control type="range" min={5} max={60} custom value={strokeWidth} onChange={event => setStrokeWidth(+event.target.value)}/>
        </Form.Group>
      </Form>
      <div className={styles.control}>
        <Button type="button" variant="danger" onClick={() => setShowModal(true)}>Clear Drawing</Button>
        <Button type="button" onClick={saveDrawing}>Save Drawing</Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Drawing</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to clear the current drawing? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => {
            clearDrawing();
            setShowModal(false);
          }}>
            Clear Drawing
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Palette;

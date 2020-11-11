import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import normal from "../../assets/Tileable_Red_Brick_Texturise_NORMAL.jpg";
import wall from "../../assets/Tileable_Red_Brick_Texturise.jpg";
import throttle from "lodash.throttle";
import alpha from "color-alpha";
import { CompactPicker } from "react-color";
import { Form } from "react-bootstrap";
import styles from "./Panel.module.scss";

interface PaletteTypes {
  strokeColor: string,
  setStrokeColor: Dispatch<SetStateAction<string>>
  strokeWidth: number,
  setStrokeWidth: Dispatch<SetStateAction<number>>
}

const Palette: FC<PaletteTypes> = props => {

  // eslint-disable-next-line react/prop-types
  const { strokeColor, setStrokeColor, strokeWidth, setStrokeWidth } = props;

  const [colors, setColors] = useState([
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
  ]);

  return (
    <div className={styles.palette}>
      <CompactPicker onChange={color => setStrokeColor(color.hex)} color={strokeColor} colors={colors} className={styles.colorPicker}/>
      <Form>
        <Form.Group controlId="strokeWidth" className={styles.strokePicker}>
          <Form.Label>Stroke Width: {strokeWidth}</Form.Label>
          <Form.Control type="range" min={5} max={60} custom value={strokeWidth} onChange={event => setStrokeWidth(+event.target.value)}/>
        </Form.Group>
      </Form>
    </div>
  );
};

interface Point2D {
  x: number,
  y: number
}

function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((acc, v) => acc + (v * v), 0));
  return vector.map(it => it / magnitude);
}

function dot(v1: number[], v2: number[]): number {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function angle(p1: Point2D, p2: Point2D): number {
  return Math.atan2(p2.x - p1.x, p2.y - p1.y);
}

function interpolation(p1: Point2D, p2: Point2D, step: number): Point2D[] {
  const points: Point2D[] = [];
  const dist = distance(p1, p2);
  const theta = angle(p1, p2);
  const { x, y } = p1;
  for (let i = 0; i < dist; i += step) {
    points.push({ x: x + Math.sin(theta) * i, y: y + Math.cos(theta) * i });
  }
  return points;
}

interface PanelProps {
  canvasWidth: number
  canvasHeight: number
}

const Panel: FC<PanelProps> = props => {

  const dpr = window.devicePixelRatio;

  // eslint-disable-next-line react/prop-types
  const { canvasWidth, canvasHeight } = props;

  const divRef = useRef<HTMLDivElement>(null);

  const canvas = useRef(document.createElement("canvas"));

  const drawingLayer = useRef(document.createElement("canvas"));

  const normalImage = useRef(document.createElement("img"));

  const wallImage = useRef(document.createElement("img"));

  const [diffuse, setDiffuse] = useState<Uint8ClampedArray | null>(null);

  const [shading, setShading] = useState<number[]>([]);

  const [specular, setSpecular] = useState<number[]>([]);

  const [mouseDown, setMouseDown] = useState(false);

  const [canvasSize, setCanvasSize] = useState({ width: canvasWidth * dpr, height: canvasHeight * dpr });

  const [strokeColor, setStrokeColor] = useState("#9AFFE8");

  const [strokeWidth, setStrokeWidth] = useState(40);

  const [mousePosition, _setMousePosition] = useState<{ prev: Point2D | null, current: Point2D | null }>({
    prev: null,
    current: null
  });

  const setMousePosition = useCallback(throttle(_setMousePosition, 20), []);

  console.log(canvas.current.getBoundingClientRect());


  // initialize canvas
  useEffect(() => {
    if (divRef.current) {
      divRef.current?.appendChild(canvas.current);
      const { width, height } = canvasSize;
      canvas.current.height = height;
      canvas.current.width = width;
      canvas.current.setAttribute("style", `width: ${width / window.devicePixelRatio }px; max-width: 100%`);
    }
  }, [divRef.current]);


  // compute shading
  useEffect(() => {
    normalImage.current.src = normal;
    normalImage.current.onload = () => {
      const memCanvas = document.createElement("canvas")!;
      const context = memCanvas.getContext("2d")!;
      const { width, height } = canvasSize;
      memCanvas.width = width;
      memCanvas.height = height;

      const pattern = context.createPattern(normalImage.current, "repeat")!;
      context.fillStyle = pattern;
      context.fillRect(0, 0, width, height);


      const imageData = context.getImageData(0, 0, width, height);
      const { data } = imageData;

      // See: https://en.wikipedia.org/wiki/Phong_reflection_model
      const dotProducts: number[] = [];
      const dotReflection: number[] = [];
      const l = [1, 3, 6];
      const unitL = normalize(l);
      const unitV = [0, 0, 1];
      for (let i = 0; i < data.length; i += 4) {
        const n = [data[i] - 128, data[i + 1] - 128, data[i + 2] - 128];
        const unitN = normalize(n);
        const dotLN = dot(unitN, unitL);

        dotProducts.push(dotLN);

        const r: number[] = [];
        for (let a = 0; a < 3; a++) {
          r[a] = 2 * dotLN * (unitN[a] - unitL[a]);
        }
        const unitR = normalize(r);
        const dotRV = dot(unitR, unitV);

        dotReflection.push(Math.pow(dotRV, 3));

        data[i] = Math.floor(dotLN * 255);
        data[i + 1] = Math.floor(dotLN * 255);
        data[i + 2] = Math.floor(dotLN * 255);
      }

      setShading(dotProducts);
      setSpecular(dotReflection);

      drawingLayer.current.width = width;
      drawingLayer.current.height = height;

      const drawingContext = drawingLayer.current.getContext("2d")!;
      drawingContext.putImageData(imageData, 0, 0);
      drawingContext.lineCap = "round";
      const drawingImageData = drawingContext.getImageData(0, 0, width, height);
      const { data: drawingData } = drawingImageData;

      for (let i = 0; i < drawingData.length; i += 4) {
        drawingData[i + 3] = 0;
      }

      drawingContext.putImageData(drawingImageData, 0, 0, 0, 0, width, height);
    };

  }, [canvasSize]);

  // compute diffuse (texture)
  useEffect(() => {
    wallImage.current.src = wall;
    wallImage.current.onload = () => {
      const memCanvas = document.createElement("canvas")!;
      const context = memCanvas.getContext("2d")!;
      const { width, height } = canvasSize;
      memCanvas.width = width;
      memCanvas.height = height;

      const pattern = context.createPattern(wallImage.current, "repeat")!;
      context.fillStyle = pattern;
      context.fillRect(0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      setDiffuse(imageData.data);
    };
  }, [canvasSize]);

  // update mouse location
  useEffect(() => {
    canvas.current.onmousemove = ev => {
      if (mouseDown) {
        const rect = canvas.current.getBoundingClientRect();
        const scaleX = canvas.current.width / rect.width;
        const scaleY = canvas.current.height / rect.height;

        setMousePosition(({ current }) => {
          return {
            prev: current,
            current: {
              x: (ev.clientX - rect.left) * scaleX,
              y: (ev.clientY - rect.top) * scaleY
            }
          };
        });
      }
    };

    canvas.current.ontouchmove = ev => {
      ev.preventDefault();
      if (mouseDown) {
        const rect = canvas.current.getBoundingClientRect();
        const scaleX = canvas.current.width / rect.width;
        const scaleY = canvas.current.height / rect.height;
        const x = ev.touches[0].clientX;
        const y = ev.touches[0].clientY;

        setMousePosition(({ current }) => {
          return {
            prev: current,
            current: {
              x: (x - rect.left) * scaleX,
              y: (y - rect.top) * scaleY
            }
          };
        });
      }
    };


  }, [canvas.current, mouseDown]);

  useEffect(() => {
    const onMouseDown = (ev: MouseEvent | TouchEvent) => {
      ev.preventDefault();
      setMouseDown(true);
    };

    canvas.current.onmousedown = onMouseDown;
    canvas.current.ontouchstart = onMouseDown;

    const onMouseExit = (ev: MouseEvent | TouchEvent) => {
      ev.preventDefault();
      setMouseDown(false);
      setMousePosition(({ current }) => {
        return {
          prev: current,
          current: null
        };
      });
    };

    canvas.current.onmouseup = onMouseExit;
    canvas.current.ontouchend = onMouseExit;
  }, []);

  // put shaded texture onto canvas
  useEffect(() => {

    if (shading.length === 0 || !diffuse) return;

    const canvasContext = canvas.current.getContext("2d")!;
    const { width, height } = canvasSize;
    const canvasImageData = canvasContext.getImageData(0, 0, width, height);
    const { data: canvasData } = canvasImageData;

    for (let i = 0; i < diffuse.length / 4; i++) {
      diffuse[i * 4] = diffuse[i * 4] * shading[i];
      diffuse[i * 4 + 1] = diffuse[i * 4 + 1] * shading[i];
      diffuse[i * 4 + 2] = diffuse[i * 4 + 2] * shading[i];
    }

    for (let i = 0; i < diffuse.length; i++) {
      canvasData[i] = diffuse[i];
    }

    canvasContext.putImageData(canvasImageData, 0, 0, 0, 0, width, height);

    console.log(diffuse[1200]);

  }, [shading, diffuse]);

  // draw and shade
  useEffect(() => {
    const drawingContext = drawingLayer.current.getContext("2d")!;
    const canvasContext = canvas.current.getContext("2d")!;
    if (mousePosition.prev && mousePosition.current && diffuse) {
      const { prev, current } = mousePosition;
      // See: http://perfectionkills.com/exploring-canvas-drawing-techniques/
      interpolation(prev, current, strokeWidth / 4).forEach(({x, y}) => {
        const blob = drawingContext.createRadialGradient(x, y, 0, x, y, strokeWidth);

        blob.addColorStop(0, strokeColor);
        blob.addColorStop(0.5, alpha(strokeColor, 0.3));
        blob.addColorStop(1, alpha(strokeColor, 0.0));
        drawingContext.fillStyle = blob;
        drawingContext.fillRect(x - strokeWidth, y - strokeWidth, strokeWidth * 2, strokeWidth * 2);
      });
      const { x: xp, y: yp } = prev;
      const { x: xc, y: yc } = current;

      const x1 = xp < xc ? xp : xc;
      const y1 = yp < yc ? yp : yc;

      const x2 = xp < xc ? xc : xp;
      const y2 = yp < yc ? yc : yp;

      const x = x1 - strokeWidth;
      const y = y1 - strokeWidth;
      const dx = x2 - x + strokeWidth;
      const dy = y2 - y + strokeWidth;

      const { width, height } = canvasSize;

      const drawingImageData = drawingContext.getImageData(0, 0, width, height);
      const { data: drawingData } = drawingImageData;
      const canvasImageData = canvasContext.getImageData(0, 0, width, height);
      const { data: canvasData } = canvasImageData;

      for (let t = 0; t < dx * dy; t++) {
        const u = t % dx;
        const v = Math.floor(t / dx);

        const a = x + u;
        const b = y + v;

        const i = a + b * width;

        const alpha = drawingData[i * 4 + 3] / 255;

        const i_s = alpha * specular[i] * 2000;

        const i_d = {
          r: alpha * (8 + drawingData[i * 4]) * shading[i],
          g: alpha * (8 + drawingData[i * 4 + 1]) * shading[i],
          b: alpha * (8 + drawingData[i * 4 + 2]) * shading[i]
        };

        canvasData[i * 4] = i_d.r + i_s + (1 - alpha) * diffuse[i * 4];
        canvasData[i * 4 + 1] = i_d.g + i_s + (1 - alpha) * diffuse[i * 4 + 1];
        canvasData[i * 4 + 2] = i_d.b + i_s + (1 - alpha) * diffuse[i * 4 + 2];
      }
      canvasContext.putImageData(canvasImageData, 0, 0, 0, 0, width, height);
    }
  }, [drawingLayer.current, diffuse, canvas.current, mousePosition]);

  return (
    <div className={styles.panel}>
      <div className={styles.canvasContainer} ref={divRef}>
      </div>
      <Palette strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
    </div>
  );
};

export default Panel;

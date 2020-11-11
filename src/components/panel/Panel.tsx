import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import normal from "../../assets/Tileable_Red_Brick_Texturise_NORMAL.jpg";
import wall from "../../assets/Tileable_Red_Brick_Texturise.jpg";
import throttle from "lodash.throttle";
import alpha from "color-alpha";
import styles from "./Panel.module.scss";
import Palette from "../palette/Palette";
import { Prompt } from "react-router-dom";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canvasSize, setCanvasSize] = useState({
    width: Math.floor(canvasWidth * dpr),
    height: Math.floor(canvasHeight * dpr)
  });

  const [strokeColor, setStrokeColor] = useState("#9AFFE8");

  const [strokeWidth, setStrokeWidth] = useState(40);

  const [mousePosition, _setMousePosition] = useState<{ prev: Point2D | null, current: Point2D | null }>({
    prev: null,
    current: null
  });

  const setMousePosition = useCallback(throttle(_setMousePosition, 20), []);

  function clearDrawing() {

    if (!diffuse) return;

    const { width, height } = canvasSize;

    const drawingContext = drawingLayer.current.getContext("2d");
    const canvasContext = canvas.current.getContext("2d");
    if (!drawingContext || !canvasContext) return;

    const drawingImageData = drawingContext.getImageData(0, 0, width, height);
    const { data: drawingData } = drawingImageData;
    const canvasImageData = canvasContext.getImageData(0, 0, width, height);
    const { data: canvasData } = canvasImageData;

    for (let i = 0; i < drawingData.length; i++) {
      drawingData[i] = 0;
    }

    drawingContext.putImageData(drawingImageData, 0, 0, 0, 0, width, height);

    for (let i = 0; i < diffuse.length; i++) {
      canvasData[i] = diffuse[i];
    }

    canvasContext.putImageData(canvasImageData, 0, 0, 0, 0, width, height);
  }

  function saveDrawing() {
    const link = document.createElement("a");
    link.href = canvas.current.toDataURL("image/png")
      .replace("data:image/png", "data:application/octet-stream");
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // initialize canvas
  useEffect(() => {
    if (divRef.current) {
      divRef.current?.appendChild(canvas.current);
      const { width, height } = canvasSize;
      canvas.current.height = height;
      canvas.current.width = width;
      canvas.current.setAttribute("style", `width: ${width / dpr }px; max-width: 100%`);
    }
  }, [divRef.current]);


  // compute shading
  useEffect(() => {
    normalImage.current.src = normal;
    normalImage.current.onload = () => {
      const memCanvas = document.createElement("canvas");

      const context = memCanvas.getContext("2d");
      const drawingContext = drawingLayer.current.getContext("2d");

      if (!context || !drawingContext) return;

      const { width, height } = canvasSize;
      memCanvas.width = width;
      memCanvas.height = height;

      const pattern = context.createPattern(normalImage.current, "repeat");

      if (!pattern) return;

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
      const memCanvas = document.createElement("canvas");
      const context = memCanvas.getContext("2d");

      if (!context) return;

      const { width, height } = canvasSize;
      memCanvas.width = width;
      memCanvas.height = height;

      const pattern = context.createPattern(wallImage.current, "repeat");

      if (!pattern) return;

      context.fillStyle = pattern;
      context.fillRect(0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      setDiffuse(imageData.data);
    };
  }, [canvasSize]);

  // update mouse location
  useEffect(() => {
    canvas.current.onpointermove = ev => {
      ev.preventDefault();
      if (mouseDown) {
        const rect = canvas.current.getBoundingClientRect();
        const scaleX = canvas.current.width / rect.width;
        const scaleY = canvas.current.height / rect.height;

        setMousePosition(({ current }) => {
          return {
            prev: current,
            current: {
              x: Math.floor((ev.clientX - rect.left) * scaleX),
              y: Math.floor((ev.clientY - rect.top) * scaleY)
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
              x: Math.floor((x - rect.left) * scaleX),
              y: Math.floor((y - rect.top) * scaleY)
            }
          };
        });
      }
    };


  }, [canvas.current, mouseDown]);

  useEffect(() => {
    const onMouseDown = (ev: PointerEvent) => {
      ev.preventDefault();
      setMouseDown(true);
    };

    canvas.current.onpointerdown = onMouseDown;

    const onMouseExit = (ev: PointerEvent | TouchEvent) => {
      ev.preventDefault();
      setMouseDown(false);
      setMousePosition(({ current }) => {
        return {
          prev: current,
          current: null
        };
      });
    };

    canvas.current.ontouchend = onMouseExit;
    canvas.current.onpointerup = onMouseExit;
  }, []);

  // put shaded texture onto canvas
  useEffect(() => {
    const canvasContext = canvas.current.getContext("2d");

    if (shading.length === 0 || !diffuse || !canvasContext) return;

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

  }, [shading, diffuse]);

  // draw and shade
  useEffect(() => {
    const drawingContext = drawingLayer.current.getContext("2d");
    const canvasContext = canvas.current.getContext("2d");

    if (!drawingContext || !canvasContext) return;

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
      <Palette
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        clearDrawing={clearDrawing}
        saveDrawing={saveDrawing}
      />
      <Prompt message={"Your changes will not be saved. Are you sure you want to navigate away?"} />
    </div>
  );
};

export default Panel;

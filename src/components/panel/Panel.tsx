import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import normal from "../../assets/Tileable_Red_Brick_Texturise_NORMAL.jpg";
import wall from "../../assets/Tileable_Red_Brick_Texturise.jpg";
import throttle from "lodash.throttle";

const Palette: FC = () => {

  const [colors, setColors] = useState(["#d00000", "#00a000", "#0000c0", "#eac300"]);

  return (
    <div>
      {colors.map(color => (
        <span key={color}>{color}</span>
      ))}
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

const Panel: FC = () => {

  const divRef = useRef<HTMLDivElement>(null);

  const canvas = useRef(document.createElement("canvas"));

  const drawingLayer = useRef(document.createElement("canvas"));

  const [diffuse, setDiffuse] = useState<Uint8ClampedArray | null>(null);

  const [shading, setShading] = useState<number[]>([]);

  const [specular, setSpecular] = useState<number[]>([]);

  const normalImage = useRef(document.createElement("img"));

  const wallImage = useRef(document.createElement("img"));

  const [mouseDown, setMouseDown] = useState(false);

  const [mousePosition, _setMousePosition] = useState<{ prev: Point2D | null, current: Point2D | null }>({
    prev: null,
    current: null
  });

  const setMousePosition = useCallback(throttle(_setMousePosition, 20), []);

  useEffect(() => {
    if (divRef.current) {
      normalImage.current.src = normal;
      normalImage.current.onload = () => {
        const memCanvas = document.createElement("canvas")!;
        divRef.current?.appendChild(canvas.current);
        const context = memCanvas.getContext("2d")!;
        const { width, height } = normalImage.current;
        memCanvas.width = width;
        memCanvas.height = height;
        context.drawImage(normalImage.current, 0, 0);
        const imageData = context.getImageData(0, 0, width, height);
        const { data } = imageData;

        // See: https://en.wikipedia.org/wiki/Phong_reflection_model
        const dotProducts: number[] = [];
        const dotReflection: number[] = [];
        const l = [1, 3, 5];
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

          dotReflection.push(Math.pow(dotRV, 10));

          data[i] = Math.floor(dotLN * 255);
          data[i + 1] = Math.floor(dotLN * 255);
          data[i + 2] = Math.floor(dotLN * 255);
        }

        setShading(dotProducts);
        setSpecular(dotReflection);

        canvas.current.height = height;
        canvas.current.width = width;

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

      wallImage.current.src = wall;
      wallImage.current.onload = () => {
        const memCanvas = document.createElement("canvas")!;
        const context = memCanvas.getContext("2d")!;
        const { width, height } = wallImage.current;
        memCanvas.width = width;
        memCanvas.height = height;
        context.drawImage(wallImage.current, 0, 0);
        const imageData = context.getImageData(0, 0, width, height);
        setDiffuse(imageData.data);
      };

    }
  }, [divRef.current]);

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
  }, [canvas.current, mouseDown]);

  useEffect(() => {
    canvas.current.onmousedown = () => {
      setMouseDown(true);
    };

    const onMouseExit = () => {
      setMouseDown(false);
      setMousePosition(({ current }) => {
        return {
          prev: current,
          current: null
        };
      });
    };

    canvas.current.onmouseup = onMouseExit;
    canvas.current.onmouseleave = onMouseExit;
  }, []);

  useEffect(() => {

    if (shading.length === 0 || !diffuse) return;

    const canvasContext = canvas.current.getContext("2d")!;
    const width = canvas.current.width;
    const height = canvas.current.height;
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

  useEffect(() => {
    const drawingContext = drawingLayer.current.getContext("2d")!;
    const canvasContext = canvas.current.getContext("2d")!;
    if (mousePosition.prev && mousePosition.current && diffuse) {
      const { prev, current } = mousePosition;
      interpolation(prev, current, 10).forEach(({x, y}) => {
        const blob = drawingContext.createRadialGradient(x, y, 0, x, y, 40);
        blob.addColorStop(0, "rgba(0,191,0,1.0)");
        blob.addColorStop(0.5, "rgba(0,191,0,0.3)");
        blob.addColorStop(1, "rgba(0, 191, 0, 0)");
        drawingContext.fillStyle = blob;
        drawingContext.fillRect(x - 40, y - 40, 80, 80);
      });
      const { x: xp, y: yp } = prev;
      const { x: xc, y: yc } = current;

      const x1 = xp < xc ? xp : xc;
      const y1 = yp < yc ? yp : yc;

      const x2 = xp < xc ? xc : xp;
      const y2 = yp < yc ? yc : yp;

      const x = x1 - 40;
      const y = y1 - 40;
      const dx = x2 - x + 40;
      const dy = y2 - y + 40;

      const width = drawingLayer.current.width;
      const height = drawingLayer.current.height;

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

        const i_s = alpha * specular[i] * 500000;

        const i_d = {
          r: alpha * drawingData[i * 4] * shading[i],
          g: alpha * drawingData[i * 4 + 1] * shading[i],
          b: alpha * drawingData[i * 4 + 2] * shading[i]
        };

        canvasData[i * 4] = i_d.r + i_s + (1 - alpha) * diffuse[i * 4];
        canvasData[i * 4 + 1] = i_d.g + i_s + (1 - alpha) * diffuse[i * 4 + 1];
        canvasData[i * 4 + 2] = i_d.b + i_s + (1 - alpha) * diffuse[i * 4 + 2];
      }
      canvasContext.putImageData(canvasImageData, 0, 0, 0, 0, width, height);
    }
  }, [drawingLayer.current, diffuse, canvas.current, mousePosition]);

  return (
    <div ref={divRef}>
    </div>
  );
};

export default Panel;

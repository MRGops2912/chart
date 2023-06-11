export interface GridLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ProgressPoint {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface ClickedPoint {
  intensity: number;
  hour: number;
  minute: number;
  second: number;
  clickedPointObj: MouseEvent;
}

export interface LabelData {
  y?: number;
  x?: number;
  labelY?: number;
  labelX?: number;
  label: string;
}

export interface TimePosition {
  time: string;
  position: number;
}

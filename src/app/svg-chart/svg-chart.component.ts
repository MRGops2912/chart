import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NumberConvertService } from '../core/services/number-convert.service';
import { ClickedPoint, GridLine, LabelData, ProgressPoint, TimePosition } from '../interface/interface';
import { GridSize, MouseButton, StepSize } from '../enum/enum';

@Component({
  selector: 'app-svg-chart',
  templateUrl: './svg-chart.component.html',
  styleUrls: ['./svg-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgchartComponent {
  @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;

  yLableData: LabelData[] = [];
  xLableData: LabelData[] = [];
  gridLines: GridLine[] = [];
  gridLinesX: GridLine[] = [];
  gridLinesY: GridLine[] = [];
  // Width of the grid
  width = GridSize.Width;
  // Height of the grid
  height = GridSize.Height;
  anchorPoints: ClickedPoint[] = [];
  progressPoints: ProgressPoint[] = [];
  isMoving: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private numberConvertService: NumberConvertService
  ) {
    // Calculate the tick values and positions
    this.generateXLabel();
    this.generateYLabel();
    this.generateGridLines();
  }

  generateYLabel(): void {
    for (let i = 10; i <= 100; i += 10) {
      const y = 400 - i * 4;
      const labelY = y + 7;
      this.yLableData.push({ y, labelY, label: i.toString() });
    }
  }

  generateXLabel(): void {
    const yLabelValues: TimePosition[] = [
      { time: '03:00:00', position: 180 },
      { time: '06:00:00', position: 360 },
      { time: '09:00:00', position: 540 },
      { time: '12:00:00', position: 720 },
      { time: '15:00:00', position: 900 },
      { time: '18:00:00', position: 1080 },
      { time: '21:00:00', position: 1260 },
      { time: '23:59:59', position: 1440 },
    ];

    for (let tick of yLabelValues) {
      const labelX = tick.position;
      this.xLableData.push({
        x: tick.position,
        labelX: labelX,
        label: tick.time,
      });
    }
  }

  generateGridLines(): void {
    // X-axis step size
    const xStep = StepSize.X;
    // Y-axis step size
    const yStep = StepSize.Y;

    for (let x = StepSize.X; x <= this.width; x += xStep) {
      this.gridLinesX.push({ x1: x, y1: 0, x2: x, y2: this.height });
    }

    for (let y = 0; y < this.height - 10; y += yStep) {
      this.gridLinesY.push({ x1: -5, y1: y, x2: this.width, y2: y });
    }
  }

  doubleClickedSvg(clickEvent: MouseEvent): void {
    const clickedPoint = this.calculateClickedPoint(clickEvent);
    this.anchorPoints.push(clickedPoint);
    this.drawPoints();
  }

  drawPoints(): void {
    const pointDimensons = this.anchorPoints
      .sort(
        (a, b) =>
          this.numberConvertService.getSeconds(a.hour, a.minute, a.second) -
          this.numberConvertService.getSeconds(b.hour, b.minute, b.second)
      )
      .map((point) => ({
        x: this.getTimePosition(point),
        y: this.height - (point.intensity / 100) * this.height,
      }));
    this.progressPoints = this.getLinearProgress(pointDimensons);
  }

  getLinearProgress(
    pointDimensons: Array<{ x: number; y: number }>
  ): ProgressPoint[] {
    const result: ProgressPoint[] = [];
    pointDimensons.forEach((pointDimenson) => {
      const pointDimensonIndex = pointDimensons.indexOf(pointDimenson);
      if (pointDimensonIndex === 0) {
        const lastPoint = pointDimensons[pointDimensons.length - 1];
        result.push({
          start: {
            x: lastPoint.x - this.width,
            y: pointDimenson.y,
          },
          end: pointDimenson,
        });
      }
      if (pointDimensonIndex === pointDimensons.length - 1) {
        const firstPoint = pointDimensons[0];
        result.push({
          start: pointDimenson,
          end: {
            x: this.width,
            y: firstPoint.y,
          },
        });
      }

      pointDimensonIndex !== pointDimensons.length - 1 &&
        result.push({
          start: pointDimenson,
          end: pointDimensons[pointDimensonIndex + 1],
        });
    });

    return result;
  }

  getTimePosition(date: { hour: number; minute: number }): number {
    return 60 * date.hour + date.minute;
  }

  mousedown(downevent: MouseEvent): void {
    if (downevent.button === MouseButton.Left) {
      this.isMoving = true;
      // Left mouse button
    }
  }

  mouseup(upevent: MouseEvent): void {
    if (upevent.button === MouseButton.Left) {
      this.isMoving = false;
      // Left mouse button
    }
  }

  onPointMove(moveEvent: MouseEvent, index: number): void {
    if (this.isMoving) {
      const clickedPoint = this.calculateClickedPoint(moveEvent);
      this.anchorPoints[index] = {
        ...clickedPoint,
      };
      this.drawPoints();
    }
  }

  getSvgScreenCTM(): DOMMatrix | undefined {
    const screenCTM = this.svg.nativeElement.getScreenCTM();
    return screenCTM?.inverse();
  }

  getSvgPoint(): DOMPoint {
    return this.svg.nativeElement.createSVGPoint();
  }

  calculateClickedPoint(clickEvent: MouseEvent): ClickedPoint {
    const svgPoint = this.getSvgPoint();
    svgPoint.x = clickEvent.clientX;
    svgPoint.y = clickEvent.clientY;

    const transformedSVGMatrix = svgPoint.matrixTransform(
      this.getSvgScreenCTM()
    );
    const clickedPointIntensity = this.numberConvertService.clamp(
      100 * (1 - transformedSVGMatrix.y / this.height),
      0,
      100
    );
    const clickedPointTime = this.numberConvertService.clamp(
      60 * transformedSVGMatrix.x,
      0,
      60 * (this.width - 4)
    );
    const clickedPoint = {
      intensity: Math.round(clickedPointIntensity),
      hour: this.numberConvertService.getRoundedHours(clickedPointTime),
      minute: this.numberConvertService.getRoundedMinutes(clickedPointTime),
      second: 0,
      clickedPointObj: clickEvent,
    };
    return clickedPoint;
  }

  trackByProgressPoint(index: number, progressPoint: ProgressPoint): number {
    // Return a unique identifier for the progressPoint item
    return index;
  }

  trackByLabelData(index: number, labelData: LabelData): string {
    // Return a unique identifier for the labelData item
    return labelData.label;
  }
  
  trackByGridLineId(index: number, gridLine: GridLine): string {
    // Return a unique identifier for the gridLine item
    return `${gridLine.x1}-${gridLine.y1}-${gridLine.x2}-${gridLine.y2}`;
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { NumberConvertService } from '../number-convert.service';

interface SelectedLightType {
  description: string;
  hexColor: string;
  id: number;
  isDangerous: boolean;
  isSpecial: boolean;
  isVisable: boolean;
  name: string;
  sortOrder: number;
}

interface GridLine {
  x1: number; y1: number; x2: number; y2: number
}

interface ProgressPoint {
  start: {
    x: number,
    y: number
  },
  end: {
    x: number,
    y: number
  }
}

@Component({
  selector: 'app-svgchart',
  templateUrl: './svgchart.component.html',
  styleUrls: ['./svgchart.component.scss'],
})
export class SvgchartComponent {
  @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;

  yLableData: { y: number; labelY: number; label: string }[] = [];
  xLableData: { x: number; labelX: number; label: string }[] = [];
  gridLines: GridLine[] = [];
  gridLinesX: GridLine[] = [];
  gridLinesY: GridLine[] = [];
  width = 1440; // Width of the grid
  height = 405; // Height of the grid
  padding = 100;
  anchorPoints: any[] = [];
  progressPoints: ProgressPoint[] = [];

  constructor(
    private elementRef: ElementRef,
    private numberConvertService: NumberConvertService
  ) {
    // Calculate the tick values and positions
    this.generateXLabel();
    this.generateYLabel();
    this.generateGridLines();
  }

  generateYLabel() {
    for (let i = 10; i <= 100; i += 10) {
      const y = 400 - i * 4;
      const labelY = y + 7;
      this.yLableData.push({ y, labelY, label: i.toString() });
    }
  }

  generateXLabel() {
    const yLabelValues = [
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

  generateGridLines() {
    const xStep = 180; // X-axis step size
    const yStep = 40; // Y-axis step size

    for (let x = 180; x <= this.width; x += xStep) {
      this.gridLinesX.push({ x1: x, y1: 0, x2: x, y2: this.height });
    }

    for (let y = 0; y < this.height - 10; y += yStep) {
      this.gridLinesY.push({ x1: 0, y1: y, x2: this.width, y2: y });
    }
  }

  doubleClickedSvg(clickEvent: MouseEvent) {
    const svgPoint = this.getSvgPoint();
    svgPoint.x = clickEvent.clientX;
    svgPoint.y = clickEvent.clientY;

    const transformedSVGMatrix = svgPoint.matrixTransform(this.getSvgScreenCTM());
    const clickedPointIntensity = this.numberConvertService.clamp(
      100 * (1 - transformedSVGMatrix.y / this.height),
      0,
      100
    );
    const clickedPointTime = this.numberConvertService.clamp(60 * transformedSVGMatrix.x, 0, 60 * (this.width - 4));
    const clickedPoint = {
      intensity: Math.round(clickedPointIntensity),
      hour: this.numberConvertService.getRoundedHours(clickedPointTime),
      minute: this.numberConvertService.getRoundedMinutes(clickedPointTime),
      second: 0,
      clickedPointObj: clickEvent,
    };
    this.anchorPoints.push(clickedPoint);
    // console.log('this.anchorPoints', this.anchorPoints);
    this.drawPoints();
  }

  drawPoints() {
    const pointDimensons = this.anchorPoints.sort((a, b) => this.numberConvertService.getSeconds(a.hour, a.minute, a.second) - this.numberConvertService.getSeconds(b.hour, b.minute, b.second)).map(point => ({
      x: this.getTimePosition(point),
      y: this.height - point.intensity / 100 * this.height
    }));
    this.progressPoints = this.getLinearProgress(pointDimensons);
    console.log('this.progressPoints', this.progressPoints);
  }

  getLinearProgress(pointDimensons: Array<{ x: number, y: number }>) {
    const result: ProgressPoint[] = [];
    console.log('pointDimensons', pointDimensons);
    pointDimensons.forEach(pointDimenson => {
      const pointDimensonIndex = pointDimensons.indexOf(pointDimenson);
      if (pointDimensonIndex === 0) {
        const lastPoint = pointDimensons[pointDimensons.length - 1];
        result.push({
          start: {
            x: lastPoint.x - this.width,
            // y: lastPoint.y,
            y: pointDimenson.y
          },
          end: pointDimenson
        })
      }
      if (pointDimensonIndex === pointDimensons.length - 1) {
        const firstPoint = pointDimensons[0];
        result.push({
          start: pointDimenson,
          end: {
            x: this.width,
            y: firstPoint.y
          }
        })
      }

      pointDimensonIndex !== pointDimensons.length - 1 && result.push({
        start: pointDimenson,
        end: pointDimensons[pointDimensonIndex + 1]
      });
    }
    );
    return result;

  }


  getTimePosition(date: { hour: number, minute: number }) {
    return 60 * date.hour + date.minute;
  }


  getSvgScreenCTM() {
    const screenCTM = this.svg.nativeElement.getScreenCTM();
    return screenCTM?.inverse();
  }
  getSvgPoint() {
    return this.svg.nativeElement.createSVGPoint();
  }
}

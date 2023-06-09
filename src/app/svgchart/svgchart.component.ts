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

@Component({
  selector: 'app-svgchart',
  templateUrl: './svgchart.component.html',
  styleUrls: ['./svgchart.component.scss'],
})
export class SvgchartComponent {
  @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;

  yLableData: { y: number; labelY: number; label: string }[] = [];
  xLableData: { x: number; labelX: number; label: string }[] = [];
  gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  gridLinesX: any[] = [];
  gridLinesY: any[] = [];
  lineVisible = false;
  movablePointX = 0;
  movablePointY = 0;
  showValues: boolean = false;
  xValue: number = 0;
  yValue: number = 0;
  selectedLightType: SelectedLightType[] = [];
  width = 1440; // Width of the grid
  height = 405; // Height of the grid
  selectedDetail: any;
  anchorPointContext: any;
  updateToLast: any;
  createAnchorPoint: any[] = [];

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

  doubleClickedSvg(t: any) {
    const e = this.getSvgPoint();
    (e.x = t.clientX), (e.y = t.clientY);
    const n = e.matrixTransform(this.getSvgScreenCTM()),
      r = this.numberConvertService.clamp(
        100 * (1 - n.y / this.height),
        0,
        100
      ),
      s = this.numberConvertService.clamp(60 * n.x, 0, 60 * (this.width - 4));
    this.createAnchorPoint.push({
      intensity: Math.round(r),
      hour: this.numberConvertService.getRoundedHours(s),
      minute: this.numberConvertService.getRoundedMinutes(s),
      t: t,
    }),
      (this.selectedDetail = e);
  }

  onUpdateToLast() {
    (this.anchorPointContext = {
      position: {
        xMax: 0,
        yMax: 0,
      },
      detail: this.selectedDetail,
      anchorPoint:
        this.selectedDetail.anchorPoints[
          this.selectedDetail.anchorPoints.length - 1
        ],
    }),
      this.updateAnchorPointIsActive(this.anchorPointContext.anchorPoint);
  }

  updateAnchorPointIsActive(t: any) {
    this.selectedDetail.anchorPoints.forEach((t: any) => (t.isActive = !1)),
      (this.selectedDetail.anchorPoints.find((e: any) => e === t).isActive =
        !0);
  }
  getSvgScreenCTM() {
    const screenCTM = this.svg.nativeElement.getScreenCTM();
    return screenCTM?.inverse();
  }
  getSvgPoint() {
    return this.svg.nativeElement.createSVGPoint();
  }
}

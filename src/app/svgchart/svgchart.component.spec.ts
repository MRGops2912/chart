import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgchartComponent } from './svgchart.component';

describe('SvgchartComponent', () => {
  let component: SvgchartComponent;
  let fixture: ComponentFixture<SvgchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgchartComponent]
    });
    fixture = TestBed.createComponent(SvgchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

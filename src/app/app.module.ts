import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgchartComponent } from './svgchart/svgchart.component';
import { SliderDirective } from './slider.directive';

@NgModule({
  declarations: [AppComponent, SvgchartComponent, SliderDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [SvgchartComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgchartComponent } from './svgchart/svgchart.component';

@NgModule({
  declarations: [AppComponent, SvgchartComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [SvgchartComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

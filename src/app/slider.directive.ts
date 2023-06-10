import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, Output, ViewChild, inject } from '@angular/core';
import { Subject, Subscription, debounceTime, filter, fromEvent, map, merge, switchMap, take, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appSlider]',
})
export class SliderDirective implements AfterViewInit, OnDestroy {

  @Output() move = new EventEmitter<MouseEvent>();

  destroyed$ = new Subject<boolean>();
  dragging = false;
  private readonly document = inject(DOCUMENT);

  constructor(
    private el: ElementRef
  ) { }

  ngAfterViewInit(): void {
    const { nativeElement } = this.el;
    (nativeElement as HTMLElement).ondragstart = function () {
      return false;
    }
    // const mouseDown$ = fromEvent(nativeElement, 'mousedown').pipe(
    //   takeUntil(this.destroyed$)
    // );
    // const mouseMove$ = fromEvent(nativeElement, 'mousemove').pipe(
    //   takeUntil(this.destroyed$)
    // );
    // const mouseUp$ = fromEvent(document, 'mouseup').pipe(
    //   takeUntil(this.destroyed$)
    // );


    // const dragMove$ = mouseDown$.pipe(
    //   switchMap<any, any>((startEvent: MouseEvent) =>
    //     mouseMove$.pipe(
    //       map<any, any>((moveEvent: MouseEvent) => {
    //         // return both events
    //         return {
    //           startEvent,
    //           moveEvent,
    //         };
    //       }),
    //       takeUntil(mouseUp$)
    //     )
    //   ),
    //   takeUntil(this.destroyed$)
    // );

    // dragMove$.subscribe((response) => {
    //   const { startEvent, moveEvent } = response as { startEvent: MouseEvent, moveEvent: MouseEvent }
    //   console.log('dragging...', startEvent, moveEvent);
    //   this.move.emit(moveEvent);
    // });

    // mouseUp$.subscribe(() => {
    //   this.dragging = false;
    // });

    // mouseDown$.subscribe(() => {
    //   this.dragging = true;
    // });
  }

  
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    console.log('mouse down');
    // event.preventDefault();
    this.dragging = true;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log('mouse up');
    // event.preventDefault();
    // event.stopImmediatePropagation();
    this.dragging = false;
  }

  @HostListener('mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    // if (this.dragging) {
      // console.log('dragging...');
      this.move.emit(event);
    // }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

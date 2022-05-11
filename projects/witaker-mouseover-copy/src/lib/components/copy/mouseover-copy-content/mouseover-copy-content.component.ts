import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'witaker-mouseover-copy-content',
  templateUrl: './mouseover-copy-content.component.html'
})
export class MouseoverCopyContentComponent {
  @Input() dwellTime = 333;
  @Input() scrubTime = 1000;

  @Input() copyContents = true;
  @Input() asHtml = false;
  @Input() newline = false;

  @ViewChild('content') content?: ElementRef<HTMLDivElement>;

  constructor() {}
}

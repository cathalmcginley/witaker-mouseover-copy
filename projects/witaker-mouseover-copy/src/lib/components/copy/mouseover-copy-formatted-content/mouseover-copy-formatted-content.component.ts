import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'witaker-mouseover-copy-formatted-content',
  templateUrl: './mouseover-copy-formatted-content.component.html',
  styleUrls: ['./mouseover-copy-formatted-content.component.scss']
})
export class MouseoverCopyFormattedContentComponent {
  @Input() dwellTime = 333;
  @Input() scrubTime = 1000;

  @Input() copyContents = true;
  @Input() asHtml = false;
  @Input() newline = false;

  @ViewChild('content') content?: ElementRef<HTMLDivElement>;

  constructor() {}
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'witaker-mouseover-copy-value',
  templateUrl: './mouseover-copy-value.component.html'
})
export class MouseoverCopyValueComponent {
  @Input() dwellTime = 333;
  @Input() scrubTime = 1000;

  @Input() value = '';
  @Input() newline = false;

  constructor() {}
}

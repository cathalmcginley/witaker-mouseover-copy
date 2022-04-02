import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseoverCopyService } from '../mouseover-copy/mouseover-copy.service';

@Component({
  selector: 'witaker-value-copier',
  template: `<div class="copy-value">
    <ng-content></ng-content>
  </div>`,

})
export class ValueCopierComponent implements OnInit, OnDestroy {
  private triggerSub?: Subscription;

  @Input() value = '';
  @Input() newline = false;

  constructor(private mouseoverCopy: MouseoverCopyService) {}

  ngOnInit(): void {
    this.triggerSub = this.mouseoverCopy.copyTrigger$.subscribe((id) => {
      const formattedContents = this.value + (this.newline ? '\n' : '');
      this.mouseoverCopy.copyTextToClipboard(formattedContents);
    });
  }

  ngOnDestroy(): void {
    this.triggerSub?.unsubscribe();
  }
}

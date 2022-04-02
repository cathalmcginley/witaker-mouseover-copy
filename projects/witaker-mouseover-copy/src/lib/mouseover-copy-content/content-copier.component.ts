import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { MouseoverCopyService } from '../mouseover-copy/mouseover-copy.service';

@Component({
  selector: 'witaker-content-copier',
  template: `<div class="copy-content" #content>
    <ng-content></ng-content>
  </div>`,
})
export class ContentCopierComponent implements OnInit, OnDestroy {
  @Input() copyContents = true;
  @Input() asHtml = false;
  @Input() newline = false;

  @ViewChild('content') content?: ElementRef<HTMLDivElement>;
  private triggerSub?: Subscription;

  constructor(private mouseoverCopy: MouseoverCopyService) {}

  ngOnInit(): void {
    this.triggerSub = this.mouseoverCopy.copyTrigger$.subscribe((id) => {
      console.log('!!copying triggered content:', id);
      this.mouseoverCopy.copyTextToClipboard(this.elementContentsAsText());
    });
  }

  ngOnDestroy(): void {
    this.triggerSub?.unsubscribe();
  }

  private elementContentsAsText(): string {
    if (this.content) {
      const elem = this.content.nativeElement;
      const contents = this.asHtml ? elem.innerHTML : elem.innerText;
      const formattedContents = contents + (this.newline ? '\n' : '');
      return formattedContents;
    } else {
      return '';
    }
  }
}

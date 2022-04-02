import {
  Component,
  ElementRef,
  Host,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  style,
  animate,
  AnimationBuilder,
  AnimationPlayer,
  AnimationAnimateMetadata,
  AnimationStyleMetadata,
} from '@angular/animations';

import { timer, Subscription } from 'rxjs';

import { ClipboardService } from '../clipboard/clipboard.service';
import { MouseoverCopyService } from './mouseover-copy.service';

@Component({
  selector: 'witaker-mouseover-copy',
  templateUrl: './mouseover-copy.component.html',
  styleUrls: ['./mouseover-copy.component.scss'],
  providers: [MouseoverCopyService],

})
export class MouseoverCopyComponent implements OnInit, OnDestroy {
  @Input() dwellTime = 333;
  @Input() scrubTime = 1000;
  @Input() copyContents = true;
  @Input() newline = false;

  private player: AnimationPlayer | null = null;
  private clearSub?: Subscription;
  private successSub?: Subscription;
  private failureSub?: Subscription;

  isHovering = false;
  isCopied = false;

  mouseOutTimestamp = 0;
  dwellCopyContent$: Subscription | null = null;

  //@ViewChild('toCopy') toCopy: ElementRef<HTMLDivElement>;
  @ViewChild('progressBar') progressBar?: ElementRef<HTMLDivElement>;


  constructor(
    private clipboard: ClipboardService,
    private builder: AnimationBuilder,
    @Host() private mouseoverCopyService: MouseoverCopyService
  ) {
  }

  ngOnInit(): void {
    console.log("COPY component got service", this.mouseoverCopyService.id)
    this.clearSub = this.mouseoverCopyService.clearStatus$?.subscribe((s) => {
      console.log("clear status", this.mouseoverCopyService.id, s);
      this.isCopied = false;
      this.playAnim('reset');
    });
    this.successSub = this.mouseoverCopyService.success$?.subscribe((text) => {
      console.log("copy succeeded", this.mouseoverCopyService.id, text);
      this.isCopied = true;
      this.playAnim('copied');
    });
    this.failureSub = this.mouseoverCopyService.failure$?.subscribe((text) => {
      console.log("copy failed", this.mouseoverCopyService.id, text); // TODO: add style for failure
      this.isCopied = false;
      this.playAnim('reset');
    });
  }

  ngOnDestroy(): void {
    this.clearSub?.unsubscribe();
    this.successSub?.unsubscribe();
    this.failureSub?.unsubscribe();
  }

  playAnim(state: string) {
    console.log(`play anim [${this.mouseoverCopyService.id}]`, state);

    const timing =
      this.dwellTime < 150
        ? `${this.dwellTime}ms 0ms ease-in`
        : `${this.dwellTime - 100}ms 100ms ease-in`;

    let anim: Array<AnimationAnimateMetadata> | Array<AnimationStyleMetadata> =
      [];
    if (state === 'hover') {
      anim = [animate(timing, style({ width: '100%' }))];
    } else if (state == 'copied') {
      anim = [animate(`50ms`, style({ width: '100%' }))];
    } else if (state == 'leave') {
      anim = [animate(`0ms`, style({ width: '0%' }))];
    } else if (state == 'reset') {
      anim = [style({ width: '0%' })];
    }
    const myAnimation = this.builder.build(anim);
    this.player = myAnimation.create(this.progressBar?.nativeElement);

    this.player.play();
  }

  async authorize() {
    const text = await navigator.clipboard.readText();
    console.log(text);
    const m = text.match(
      /witaker:clipboard-server\[port=(\d{4,5});auth-key='([^']+)'\]/
    );
    if (m) {
      const port = parseInt(m[1]);
      const authKey = m[2];
      this.clipboard.setPort(port);
      this.clipboard.setAuthKey(authKey);
      console.log('got auth', port, authKey);
    } else {
      console.log('no match');
    }
  }

  copyComponentEnter(): void {
    this.playAnim('hover');
    this.isHovering = true;
    this.dwellCopyContent$ = timer(this.dwellTime).subscribe((x) =>
      this.triggerCopy()
    );
    console.log('mouseOver - starting subscription');
  }

  copyComponentLeave(): void {
    this.isHovering = false;
    if (this.dwellCopyContent$) {
      if (!this.dwellCopyContent$.closed) {
        this.dwellCopyContent$.unsubscribe();
        console.log('unsubscribing');
      }
    }
    const now = new Date().getTime();
    const timeDiff = now - this.mouseOutTimestamp;
    if (timeDiff < this.scrubTime) {
      this.triggerCopy();
    } else {
      if (!this.isCopied) {
        this.playAnim('leave');
      }
    }
    this.mouseOutTimestamp = now;
  }


  triggerCopy(): void {
      this.mouseoverCopyService.triggerCopy();
  }
}

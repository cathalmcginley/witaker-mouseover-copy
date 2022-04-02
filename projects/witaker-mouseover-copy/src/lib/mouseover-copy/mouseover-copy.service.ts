import { OnInit, OnDestroy, Injectable } from '@angular/core';

import { Subject, Observable, of, interval, filter, map, scan } from 'rxjs';

import { v4 as uuid_v4 } from 'uuid';

import { ClipboardService } from '../clipboard/clipboard.service';
import { CopySuccess, CopyFailure } from '../clipboard/clipboard.model';

@Injectable({
  providedIn: 'root',
})
export class MouseoverCopyService  {
  private copyTriggerSource = new Subject<string>();
  copyTrigger$ = this.copyTriggerSource.asObservable();
  clearStatus$?: Observable<boolean>;
  success$?: Observable<CopySuccess>;
  failure$?: Observable<CopyFailure>;

  readonly id = uuid_v4();

  constructor(private clipboard: ClipboardService) {
    console.log('creating a new MouseoverCopy Service', new Date(), this.id);

    const id = this.id;
    this.clearStatus$ = this.clipboard.copyRequest$.pipe(
      filter((x) => x.id !== id),
      map((x) => true)
    );
    this.success$ = this.clipboard.copySuccess$.pipe(
      filter((x) => x.id === id)
    );
    this.failure$ = this.clipboard.copyFailure$.pipe(
      filter((x) => x.id === id)
    );
    console.log("CONTENT COPY component got c");
    console.log("$ finished initializing $ ", this.id);
  }

  triggerCopy() {
    this.copyTriggerSource.next(this.id);
  }

  copyTextToClipboard(text: string) {
    this.clipboard.copyTextToClipboard(this.id, text);
  }
}

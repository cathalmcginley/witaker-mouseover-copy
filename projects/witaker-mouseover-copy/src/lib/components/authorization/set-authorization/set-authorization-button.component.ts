import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ClipboardService } from '../../../services/clipboard/clipboard.service';

@Component({
  selector: 'witaker-set-authorization-button',
  templateUrl: './set-authorization-button.component.html',
  styleUrls: ['./set-authorization-button.component.scss'],
})
export class SetAuthorizationButtonComponent {
  @Input() minimal = false;

  isHover = false;
  isCheckingAuthorization = false;
  authorizationSucceeded = false;
  authorizationFailed = false;
  error = '';

  constructor(private clipboard: ClipboardService) {}

  beginHover() {
    this.isHover = true;
  }
  endHover() {
    this.isHover = false;
  }

  async authorizeFromClipboard() {
    const text = await navigator.clipboard.readText();
    console.log(text);
    const m = text.match(
      /witaker:clipboard-server\[port=(\d{4,5});auth-key='([^']+)'\]/
    );
    if (m) {
      this.isCheckingAuthorization = true;
      const port = parseInt(m[1]);
      const authKey = m[2];
      this.clipboard.setPort(port);
      this.clipboard.setAuthKey(authKey);
      console.log('got auth', port, authKey);
      const f = this.clipboard.ping('SetAuthorizationButtonComponent');
      f.subscribe((pong) => {
        console.log('ping... pong', pong);
        if (pong.error) {
          this.isCheckingAuthorization = false;
          this.authorizationSucceeded = false;
          this.authorizationFailed = true;
          this.error = pong.error;
        } else {
          this.isCheckingAuthorization = false;
          this.authorizationSucceeded = true;
          this.authorizationFailed = false;
          this.error = '';
        }
      });
    } else {
      console.log('no match');
    }
  }
}

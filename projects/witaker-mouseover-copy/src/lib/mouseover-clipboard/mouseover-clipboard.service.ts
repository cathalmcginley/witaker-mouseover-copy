import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import {
  CopyRequest,
  CopySuccess,
  CopyFailure,
  PingResponseBody,
  clipboardCopyRequest,
  ClipboardResponseBody,
} from './mouseover-clipboard.model';

export const DEFAULT_WITAKER_CLIPBOARD_SERVER_PORT = 42157;

@Injectable({
  providedIn: 'root',
})
export class MouseoverClipboardService {
  private clipboardServerPort = DEFAULT_WITAKER_CLIPBOARD_SERVER_PORT;
  private clipboardServerAuthKey = '';

  private copyRequestSource = new Subject<CopyRequest>();
  private copySuccessSource = new Subject<CopySuccess>();
  private copyFailureSource = new Subject<CopyFailure>();

  /**
   * Emits a CopyRequest when any component triggers a copy request. If the id does not match
   * your component, you should trigger a state change to show you are no longer the
   * currently copied component.
   */
  copyRequest$ = this.copyRequestSource.asObservable();
  copySuccess$ = this.copySuccessSource.asObservable();
  copyFailure$ = this.copyFailureSource.asObservable();

  constructor(private http: HttpClient) {}

  setPort(port: number) {
    this.clipboardServerPort = port;
  }

  setAuthKey(authKey: string) {
    this.clipboardServerAuthKey = authKey;
  }

  ping(id: string): Observable<PingResponseBody> {
    const pingUrl = `http://localhost:${this.clipboardServerPort}/ping`;
    const response = this.http.get<PingResponseBody>(
      pingUrl,
      { headers: this.buildHeaders() }
    );
    const pingSource = new Subject<PingResponseBody>();
    response.subscribe({
      next: (r) => {
        pingSource.next(r);
        pingSource.complete();
      },
    // });
    // response.subscribe({
      error: (e) => {
        let version: string | null = null;
        let error = e.message || `failed to reach Witaker Clipboard Service ${pingUrl}`;
        if (e.error && e.error.version) {
          version = e.error.version;
          error = e.error.error;
        }
        pingSource.next(new PingResponseBody(version, error));
        pingSource.complete();
      },
    });
    return pingSource.asObservable();
  }

  copyTextToClipboard(id: string, text: string): void {
    this.copyRequestSource.next({ id, text });
    const data = clipboardCopyRequest(text);
    const response = this.http.post<ClipboardResponseBody>(
      `http://localhost:${this.clipboardServerPort}/clipboard`,
      data,
      { headers: this.buildHeaders() }
    );

    response.subscribe({
      next: (responseBody) => {
        console.log("FOO", responseBody)
        if (text === responseBody.clipboard?.content?.text) {
          this.copySuccessSource.next({ id, text });
        }
      },
      error: (errResp) => {
        let errorMessage = errResp.message;
        if (errResp.error?.clipboard?.error) {
          errorMessage = errResp.error.clipboard.error;
        }
        this.copyFailureSource.next({ id, text, errorMessage });
      },
    });
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Basic ${this.clipboardServerAuthKey}`
    );
  }
}

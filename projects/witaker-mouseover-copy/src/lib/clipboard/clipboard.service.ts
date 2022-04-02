import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import {
  CopyRequest,
  CopySuccess,
  CopyFailure,
} from './clipboard.model';

import {
  DEFAULT_WITAKER_CLIPBOARD_SERVER_PORT,
  PingResponseBody,
  clipboardCopyRequest,
  ClipboardResponseBody,
} from './clipboard.http.model';


@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

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

  constructor(private http: HttpClient) {
    console.log("creating a new Clipboard service")
  }

  setPort(port: number) {
    this.clipboardServerPort = port;
  }

  setAuthKey(authKey: string) {
    this.clipboardServerAuthKey = authKey;
  }

  private getBaseUrl(): string {
    return `http://localhost:${this.clipboardServerPort}`;
  }

  getPingUrl(): string {
    return `${this.getBaseUrl()}/ping`;
  }

  getClipboardUrl(): string {
    return `${this.getBaseUrl()}/clipboard`;
  }

  ping(id: string): Observable<PingResponseBody> {

    const response = this.http.get<PingResponseBody>(
      this.getPingUrl(),
      { headers: this.buildHeaders() }
    );
    const pingSource = new Subject<PingResponseBody>();
    response.subscribe({
      next: (r) => {
        pingSource.next(r);
        pingSource.complete();
      },
      error: (e) => {
        let version: string | null = null;
        let error = e.message || `failed to reach Witaker Clipboard Service ${this.getPingUrl()}`;
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
      this.getClipboardUrl(),
      data,
      { headers: this.buildHeaders() }
    );

    response.subscribe({
      next: (responseBody) => {
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

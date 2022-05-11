import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ClipboardService } from './clipboard.service';

let httpTestingController: HttpTestingController;
let service: ClipboardService;

describe('Mouseover Clipboard service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClipboardService],
    });
    const httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ClipboardService)
  });

  it('should ping when authorized', () => {
    service.setAuthKey("TestingPingDefault");
    service.ping('test-002').subscribe((pr) => {
      expect(pr.version).toBe('0.3.2');
    });
    const req = httpTestingController.expectOne('http://localhost:42157/ping')
    expect(req.request.method).toEqual("GET");
    expect(req.request.headers.get('Authorization')).toEqual("Basic TestingPingDefault");
    req.flush({'version': '0.3.2'});
  });

  it('should ping on different server port when authorized', () => {
    service.setPort(58109);
    service.setAuthKey("TestingPingOtherPort");
    service.ping('test-002').subscribe((pr) => {
      expect(pr.version).toBe('0.3.2');
    });
    const req = httpTestingController.expectOne('http://localhost:58109/ping')
    expect(req.request.method).toEqual("GET");
    expect(req.request.headers.get('Authorization')).toEqual("Basic TestingPingOtherPort");
    req.flush({'version': '0.3.2'});
  });

  it('should fail a ping when not authorized', () => {
    service = TestBed.inject(ClipboardService);
    service.ping('test-003').subscribe((pr) => {
      expect(pr.version).toBe('0.3.2');
    });
    const req = httpTestingController.expectOne('http://localhost:42157/ping')
    expect(req.request.method).toEqual("GET");
    req.flush({'version': '0.3.2', 'error':'Not authorized'}, { status: 401, statusText: 'Not authorized'});
  });

  it('should cleanly fail a ping when the http call itself fails', () => {
    service = TestBed.inject(ClipboardService);
    service.ping('test-004').subscribe((pr) => {
      expect(pr.error).toMatch(/Http failure/);
    });
    const req = httpTestingController.expectOne('http://localhost:42157/ping');
    req.error(new ProgressEvent('error'));
    expect(req.request.method).toEqual("GET");
    // req.flush("<html><head><title>timed out</title><head><body></body></html>", { status: 503, statusText: 'Network timeout'});
  });


  it('should copy text when authorized', () => {
    service.setAuthKey("TestingCopyDefault");
    service.copyTextToClipboard('test-101', "Some text to copy");
    service.copyRequest$.subscribe((req)=> {
      expect(req.id).toEqual('test-101');
      expect(req.text).toEqual("Some text to copy");
    });
    service.copySuccess$.subscribe((success)=> {
      expect(success.id).toEqual('test-101');
      expect(success.text).toEqual("Some text to copy");
    });
    const req = httpTestingController.expectOne('http://localhost:42157/clipboard')
    expect(req.request.method).toEqual("POST");
    expect(req.request.headers.get('Authorization')).toEqual("Basic TestingCopyDefault");
    req.flush({'clipboard': {"copy": {"text": "Some text to copy"}}});
  });

  it('should fail to copy text when not authorized', () => {
    service.copyTextToClipboard('test-102', "Some more text to copy");
    service.copyRequest$.subscribe((req)=> {
      expect(req.id).toEqual('test-101');
      expect(req.text).toEqual("Some more text to copy");
    });
    service.copyFailure$.subscribe((fail)=> {
      expect(fail.id).toEqual('test-102');
      expect(fail.text).toEqual("Some more text to copy");
      expect(fail.errorMessage).toEqual("Not Authorized");
    });
    const req = httpTestingController.expectOne('http://localhost:42157/clipboard')
    expect(req.request.method).toEqual("POST");
    expect(req.request.headers.get('Authorization')).not.toMatch("Basic \w+");
    req.flush({'clipboard': {"error": "Not Authorized", "content": {}}}, { status: 401, statusText: "Not authorized"});
  });

  it('should cleanly fail a copy when the http call itself fails', () => {
    service = TestBed.inject(ClipboardService);
    service.copyTextToClipboard('test-103', "Try to copy, but server is not running");
    service.copyFailure$.subscribe((fail) => {
      expect(fail.errorMessage).toMatch(/Http failure/);
    });
    const req = httpTestingController.expectOne('http://localhost:42157/clipboard');
    req.error(new ProgressEvent('error'));
    expect(req.request.method).toEqual("POST");
    // req.flush("<html><head><title>timed out</title><head><body></body></html>", { status: 503, statusText: 'Network timeout'});
  });


  afterEach(() => {
    httpTestingController.verify();
  })
});

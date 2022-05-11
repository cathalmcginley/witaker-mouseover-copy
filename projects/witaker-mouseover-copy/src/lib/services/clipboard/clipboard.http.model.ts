export const DEFAULT_WITAKER_CLIPBOARD_SERVER_PORT = 42157;

export class PingResponseBody {
  readonly version: string | null;
  readonly error: string | null;
  constructor(version: string | null = null, error: string | null = null) {
    this.version = version;
    this.error = error;
  }
}

class ClipboardText {
  readonly text: string | null;
  constructor(text: string | null) {
    this.text = text && text.trim() ? text : null;
  }
}

class ClipboardCopyRequest {
  readonly copy: ClipboardText;
  constructor(copy: ClipboardText) {
    this.copy = copy;
  }
}

export class ClipboardRequestBody {
  readonly clipboardRequest: ClipboardCopyRequest;
  constructor(cr: ClipboardCopyRequest) {
    this.clipboardRequest = cr;
  }
  toJSON() {
    return { 'clipboard-request': this.clipboardRequest };
  }
}

class ClipboardContent {
  content: ClipboardText;
  error: string | null;
  constructor(content: ClipboardText, error: string | null) {
    this.content = content;
    this.error = error;
  }
}

export class ClipboardResponseBody {
  readonly clipboard: ClipboardContent;
  constructor(clipboard: ClipboardContent) {
    this.clipboard = clipboard;
  }
}

export function clipboardCopyRequest(text: string): ClipboardRequestBody {
  return new ClipboardRequestBody(
    new ClipboardCopyRequest(new ClipboardText(text))
  );
}

export function clipboardContentResponse(text: string): ClipboardResponseBody {
  return new ClipboardResponseBody(
    new ClipboardContent(new ClipboardText(text), null)
  );
}

export function clipboardErrorResponse(
  errorMessage: string
): ClipboardResponseBody {
  return new ClipboardResponseBody(
    new ClipboardContent(new ClipboardText(''), errorMessage)
  );
}

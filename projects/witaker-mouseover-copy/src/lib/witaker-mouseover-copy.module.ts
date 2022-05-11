import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CopyIconComponent } from './components/icons/copy-icon/copy-icon.component';
import { AuthorizedIconComponent } from './components/icons/authorized-icon/authorized-icon.component';

import { SetAuthorizationButtonComponent } from './components/authorization/set-authorization/set-authorization-button.component';

import { MouseoverCopyComponent } from './components/copy/mouseover-copy/mouseover-copy.component';
import { MouseoverCopyContentComponent } from './components/copy/mouseover-copy-content/mouseover-copy-content.component';
import { ContentCopierComponent } from './components/copy/mouseover-copy-content/content-copier.component';
import { MouseoverCopyValueComponent } from './components/copy/mouseover-copy-value/mouseover-copy-value.component';
import { ValueCopierComponent } from './components/copy/value-copier/value-copier.component';
import { MouseoverCopyFormattedContentComponent } from './components/copy/mouseover-copy-formatted-content/mouseover-copy-formatted-content.component';

import { ClipboardService } from './services/clipboard/clipboard.service';


@NgModule({
  declarations: [
    AuthorizedIconComponent,
    CopyIconComponent,
    SetAuthorizationButtonComponent,
    MouseoverCopyComponent,
    MouseoverCopyContentComponent,
    ContentCopierComponent,
    MouseoverCopyValueComponent,
    ValueCopierComponent,
    MouseoverCopyFormattedContentComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    ClipboardService,
  ],
  exports: [
    AuthorizedIconComponent,
    CopyIconComponent,
    SetAuthorizationButtonComponent,
    MouseoverCopyComponent,
    MouseoverCopyContentComponent,
    ContentCopierComponent,
    MouseoverCopyValueComponent,
    ValueCopierComponent,
    MouseoverCopyFormattedContentComponent,
  ]
})
export class WitakerMouseoverCopyModule { }

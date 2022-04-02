import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CopyIconComponent } from './copy-icon/copy-icon.component';
import { MouseoverCopyComponent } from './mouseover-copy/mouseover-copy.component';
import { MouseoverCopyContentComponent } from './mouseover-copy-content/mouseover-copy-content.component';
import { ContentCopierComponent } from './mouseover-copy-content/content-copier.component';
import { MouseoverCopyValueComponent } from './mouseover-copy-value/mouseover-copy-value.component';
import { ValueCopierComponent } from './mouseover-copy-value/value-copier.component copy';
import { MouseoverCopyFormattedContentComponent } from './mouseover-copy-formatted-content/mouseover-copy-formatted-content.component';

import { ClipboardService } from './clipboard/clipboard.service';



@NgModule({
  declarations: [
    CopyIconComponent,
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
    CopyIconComponent,
    MouseoverCopyComponent,
    MouseoverCopyContentComponent,
    ContentCopierComponent,
    MouseoverCopyValueComponent,
    ValueCopierComponent,
    MouseoverCopyFormattedContentComponent,
  ]
})
export class WitakerMouseoverCopyModule { }

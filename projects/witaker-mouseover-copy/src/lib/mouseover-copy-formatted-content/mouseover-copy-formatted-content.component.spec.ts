import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseoverCopyFormattedContentComponent } from './mouseover-copy-formatted-content.component';

describe('MouseoverCopyFormattedContentComponent', () => {
  let component: MouseoverCopyFormattedContentComponent;
  let fixture: ComponentFixture<MouseoverCopyFormattedContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouseoverCopyFormattedContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouseoverCopyFormattedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

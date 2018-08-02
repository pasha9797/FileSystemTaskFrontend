import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserPageComponent } from './browser-page.component';

describe('BrowserPageComponent', () => {
  let component: BrowserPageComponent;
  let fixture: ComponentFixture<BrowserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

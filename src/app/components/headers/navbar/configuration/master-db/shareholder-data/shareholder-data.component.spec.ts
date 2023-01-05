import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareholderDataComponent } from './shareholder-data.component';

describe('ShareholderDataComponent', () => {
  let component: ShareholderDataComponent;
  let fixture: ComponentFixture<ShareholderDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareholderDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareholderDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

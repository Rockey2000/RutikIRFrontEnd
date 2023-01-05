import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShContactDetailsComponent } from './sh-contact-details.component';

describe('ShContactDetailsComponent', () => {
  let component: ShContactDetailsComponent;
  let fixture: ComponentFixture<ShContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShContactDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

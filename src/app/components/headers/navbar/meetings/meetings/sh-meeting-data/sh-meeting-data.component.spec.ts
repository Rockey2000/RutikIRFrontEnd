import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShMeetingDataComponent } from './sh-meeting-data.component';

describe('ShMeetingDataComponent', () => {
  let component: ShMeetingDataComponent;
  let fixture: ComponentFixture<ShMeetingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShMeetingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShMeetingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRecordingComponent } from './meeting-recording.component';

describe('MeetingRecordingComponent', () => {
  let component: MeetingRecordingComponent;
  let fixture: ComponentFixture<MeetingRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingRecordingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDataComponent } from './meeting-data.component';

describe('MeetingDataComponent', () => {
  let component: MeetingDataComponent;
  let fixture: ComponentFixture<MeetingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

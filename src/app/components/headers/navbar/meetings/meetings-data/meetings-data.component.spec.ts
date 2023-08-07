import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsDataComponent } from './meetings-data.component';

describe('MeetingsDataComponent', () => {
  let component: MeetingsDataComponent;
  let fixture: ComponentFixture<MeetingsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

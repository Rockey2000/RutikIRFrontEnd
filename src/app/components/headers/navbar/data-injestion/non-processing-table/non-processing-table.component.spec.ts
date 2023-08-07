import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonProcessingTableComponent } from './non-processing-table.component';

describe('NonProcessingTableComponent', () => {
  let component: NonProcessingTableComponent;
  let fixture: ComponentFixture<NonProcessingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonProcessingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonProcessingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

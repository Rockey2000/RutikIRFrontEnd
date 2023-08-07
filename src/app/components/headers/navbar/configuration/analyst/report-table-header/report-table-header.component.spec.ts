import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTableHeaderComponent } from './report-table-header.component';

describe('ReportTableHeaderComponent', () => {
  let component: ReportTableHeaderComponent;
  let fixture: ComponentFixture<ReportTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTableHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

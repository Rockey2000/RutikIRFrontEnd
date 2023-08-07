import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIngestionMenuComponent } from './data-ingestion-menu.component';

describe('DataIngestionMenuComponent', () => {
  let component: DataIngestionMenuComponent;
  let fixture: ComponentFixture<DataIngestionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataIngestionMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataIngestionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

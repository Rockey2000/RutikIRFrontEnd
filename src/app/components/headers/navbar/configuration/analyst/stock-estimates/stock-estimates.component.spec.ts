import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEstimatesComponent } from './stock-estimates.component';

describe('StockEstimatesComponent', () => {
  let component: StockEstimatesComponent;
  let fixture: ComponentFixture<StockEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockEstimatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

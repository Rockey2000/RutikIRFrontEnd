import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketIntelComponent } from './market-intel.component';

describe('MarketIntelComponent', () => {
  let component: MarketIntelComponent;
  let fixture: ComponentFixture<MarketIntelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketIntelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketIntelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

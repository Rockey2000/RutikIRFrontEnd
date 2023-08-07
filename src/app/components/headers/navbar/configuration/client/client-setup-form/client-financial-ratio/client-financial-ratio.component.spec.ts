import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFinancialRatioComponent } from './client-financial-ratio.component';

describe('ClientFinancialRatioComponent', () => {
  let component: ClientFinancialRatioComponent;
  let fixture: ComponentFixture<ClientFinancialRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFinancialRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFinancialRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

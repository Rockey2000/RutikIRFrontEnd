import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystDetailsComponent } from './analyst-details.component';

describe('AnalystDetailsComponent', () => {
  let component: AnalystDetailsComponent;
  let fixture: ComponentFixture<AnalystDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

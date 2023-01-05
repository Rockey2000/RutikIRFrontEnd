import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemNomenclatureComponent } from './line-item-nomenclature.component';

describe('LineItemNomenclatureComponent', () => {
  let component: LineItemNomenclatureComponent;
  let fixture: ComponentFixture<LineItemNomenclatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineItemNomenclatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineItemNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

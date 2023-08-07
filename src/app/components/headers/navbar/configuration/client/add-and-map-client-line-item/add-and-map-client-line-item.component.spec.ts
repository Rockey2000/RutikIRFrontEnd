import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndMapClientLineItemComponent } from './add-and-map-client-line-item.component';

describe('AddAndMapClientLineItemComponent', () => {
  let component: AddAndMapClientLineItemComponent;
  let fixture: ComponentFixture<AddAndMapClientLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAndMapClientLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAndMapClientLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

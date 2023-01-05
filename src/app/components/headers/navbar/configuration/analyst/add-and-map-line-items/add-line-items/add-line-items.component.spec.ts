import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLineItemsComponent } from './add-line-items.component';

describe('AddLineItemsComponent', () => {
  let component: AddLineItemsComponent;
  let fixture: ComponentFixture<AddLineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLineItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

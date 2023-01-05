import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndMapLineItemsComponent } from './add-and-map-line-items.component';

describe('AddAndMapLineItemsComponent', () => {
  let component: AddAndMapLineItemsComponent;
  let fixture: ComponentFixture<AddAndMapLineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAndMapLineItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAndMapLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

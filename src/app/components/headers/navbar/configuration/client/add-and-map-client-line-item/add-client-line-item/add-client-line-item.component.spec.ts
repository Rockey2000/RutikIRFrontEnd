import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientLineItemComponent } from './add-client-line-item.component';

describe('AddClientLineItemComponent', () => {
  let component: AddClientLineItemComponent;
  let fixture: ComponentFixture<AddClientLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClientLineItemComponent } from './map-client-line-item.component';

describe('MapClientLineItemComponent', () => {
  let component: MapClientLineItemComponent;
  let fixture: ComponentFixture<MapClientLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapClientLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapClientLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

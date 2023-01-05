import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLineItemsComponent } from './map-line-items.component';

describe('MapLineItemsComponent', () => {
  let component: MapLineItemsComponent;
  let fixture: ComponentFixture<MapLineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapLineItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

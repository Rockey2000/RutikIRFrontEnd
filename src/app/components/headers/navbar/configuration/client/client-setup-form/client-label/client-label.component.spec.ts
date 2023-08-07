import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLabelComponent } from './client-label.component';

describe('ClientLabelComponent', () => {
  let component: ClientLabelComponent;
  let fixture: ComponentFixture<ClientLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

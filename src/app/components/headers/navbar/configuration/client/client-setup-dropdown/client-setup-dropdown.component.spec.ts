import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSetupDropdownComponent } from './client-setup-dropdown.component';

describe('ClientSetupDropdownComponent', () => {
  let component: ClientSetupDropdownComponent;
  let fixture: ComponentFixture<ClientSetupDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSetupDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSetupDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSetupFormComponent } from './client-setup-form.component';

describe('ClientSetupFormComponent', () => {
  let component: ClientSetupFormComponent;
  let fixture: ComponentFixture<ClientSetupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSetupFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSetupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

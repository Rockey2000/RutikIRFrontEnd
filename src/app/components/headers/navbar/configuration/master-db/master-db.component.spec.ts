import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDbComponent } from './master-db.component';

describe('MasterDbComponent', () => {
  let component: MasterDbComponent;
  let fixture: ComponentFixture<MasterDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

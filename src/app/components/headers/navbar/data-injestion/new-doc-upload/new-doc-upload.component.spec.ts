import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocUploadComponent } from './new-doc-upload.component';

describe('NewDocUploadComponent', () => {
  let component: NewDocUploadComponent;
  let fixture: ComponentFixture<NewDocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDocUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

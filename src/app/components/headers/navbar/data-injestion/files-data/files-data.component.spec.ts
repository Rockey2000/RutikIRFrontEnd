import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesDataComponent } from './files-data.component';

describe('FilesDataComponent', () => {
  let component: FilesDataComponent;
  let fixture: ComponentFixture<FilesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

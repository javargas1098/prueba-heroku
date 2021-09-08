import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancionListComponent } from './cancion-list.component';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestingModule } from '@testing/testing.module';

describe('CancionListComponent', () => {
  let component: CancionListComponent;
  let fixture: ComponentFixture<CancionListComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('CancionListComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CancionListComponent],
        imports: [TestingModule],
        providers: [
          {
            provide: ToastrService,
            useValue: toastrServiceSpy
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancionShareComponent } from './cancion-share.component';
import { TestingModule } from '@testing/testing.module';
import { ToastrService } from 'ngx-toastr';
import { CancionUserFilterPipe } from '@app/cancion/cancion-share/pipes/cancion-user-filter.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CancionShareComponent', () => {
  let component: CancionShareComponent;
  let fixture: ComponentFixture<CancionShareComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('CancionShareComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [CancionShareComponent, CancionUserFilterPipe],
        imports: [TestingModule, ReactiveFormsModule, FormsModule],
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
    fixture = TestBed.createComponent(CancionShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

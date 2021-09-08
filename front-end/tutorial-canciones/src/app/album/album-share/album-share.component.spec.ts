import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlbumShareComponent } from './album-share.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlbumUserFilterPipe } from './pipes/album-user-filter.pipe';
import { TestingModule } from '@testing/testing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AlbumShareComponent', () => {
  let component: AlbumShareComponent;
  let fixture: ComponentFixture<AlbumShareComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('AlbumShareComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [AlbumShareComponent, AlbumUserFilterPipe],
        imports: [TestingModule, FormsModule, ReactiveFormsModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                url: 'artists/1',
                params: { id: 100 }
              }
            }
          },
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
    fixture = TestBed.createComponent(AlbumShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

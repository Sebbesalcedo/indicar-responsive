import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegradorComponent } from './integrador.component';

describe('IntegradorComponent', () => {
  let component: IntegradorComponent;
  let fixture: ComponentFixture<IntegradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

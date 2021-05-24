import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasDetalleComponent } from './noticias-detalle.component';

describe('NoticiasDetalleComponent', () => {
  let component: NoticiasDetalleComponent;
  let fixture: ComponentFixture<NoticiasDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiasDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

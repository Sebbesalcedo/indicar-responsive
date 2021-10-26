import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaPrecioComponent } from './guia-precio.component';

describe('GuiaPrecioComponent', () => {
  let component: GuiaPrecioComponent;
  let fixture: ComponentFixture<GuiaPrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiaPrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

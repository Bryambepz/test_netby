import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTransaccionComponent } from './ver-transaccion.component';

describe('VerTransaccionComponent', () => {
  let component: VerTransaccionComponent;
  let fixture: ComponentFixture<VerTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerTransaccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

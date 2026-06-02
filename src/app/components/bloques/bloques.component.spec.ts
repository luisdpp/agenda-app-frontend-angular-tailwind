import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquesComponent } from './bloques.component';

describe('BloquesComponent', () => {
  let component: BloquesComponent;
  let fixture: ComponentFixture<BloquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

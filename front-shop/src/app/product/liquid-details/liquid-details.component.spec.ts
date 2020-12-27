import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidDetailsComponent } from './liquid-details.component';

describe('LiquidDetailsComponent', () => {
  let component: LiquidDetailsComponent;
  let fixture: ComponentFixture<LiquidDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

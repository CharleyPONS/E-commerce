import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashDetailsComponent } from './hash-details.component';

describe('HashDetailsComponent', () => {
  let component: HashDetailsComponent;
  let fixture: ComponentFixture<HashDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HashDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

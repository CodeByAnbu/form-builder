import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioBtnComponent } from './radio-btn.component';

describe('RadioBtnComponent', () => {
  let component: RadioBtnComponent;
  let fixture: ComponentFixture<RadioBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadioBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

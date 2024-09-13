import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiModalComponent } from './ui-modal.component';

describe('UiModalComponent', () => {
  let component: UiModalComponent;
  let fixture: ComponentFixture<UiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UiToggleComponent } from "./ui-toggle.component";

describe("UiToggleComponent", () => {
  let component: UiToggleComponent;
  let fixture: ComponentFixture<UiToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should toggle state when clicked', () => {
    const initialState = component.isChecked; // assuming this property exists
    component.toggle();
    expect(component.isChecked).toBe(!initialState);
  });

  it('should emit state change event', () => {
    spyOn(component.stateChange, 'emit');
    component.toggle();
    expect(component.stateChange.emit).toHaveBeenCalled();
  });

  it('should properly bind toggle text configuration', () => {
    const config = {
      enabledText: 'Dark',
      disabledText: 'Light'
    };
    component.toggleConfig = config;
    fixture.detectChanges();

    const toggleElement = fixture.nativeElement.querySelector('.toggle-text');
    expect(toggleElement.textContent).toContain(config.disabledText);

    component.toggle();
    fixture.detectChanges();
    expect(toggleElement.textContent).toContain(config.enabledText);
  });

  it('should handle undefined toggle configuration gracefully', () => {
    component.toggleConfig = undefined;
    fixture.detectChanges();
    expect(() => component.toggle()).not.toThrow();
  });
});

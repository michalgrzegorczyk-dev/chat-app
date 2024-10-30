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
});

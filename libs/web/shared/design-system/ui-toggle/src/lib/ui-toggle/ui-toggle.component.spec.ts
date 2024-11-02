import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToggleComponent } from "./ui-toggle.component";
import { ControlContainer, FormGroup, FormGroupDirective } from "@angular/forms";

describe("UiToggleComponent", () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;
  let formGroupDirective: FormGroupDirective;

  beforeEach(async () => {
    formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = new FormGroup({});

    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
      providers: [
        { provide: ControlContainer, useValue: formGroupDirective },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'testId');
    fixture.componentRef.setInput('value', true);
    fixture.componentRef.setInput('controlName', 'testControlName');
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it("should inject control in form", ()=> {
  //   expect(component.has)
  // })



});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureConversationPanelComponent } from './feature-conversation-panel.component';

describe('FeatureConversationPanelComponent', () => {
  let component: FeatureConversationPanelComponent;
  let fixture: ComponentFixture<FeatureConversationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureConversationPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureConversationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

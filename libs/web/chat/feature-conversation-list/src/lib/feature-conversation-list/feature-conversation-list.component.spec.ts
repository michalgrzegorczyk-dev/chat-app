import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureConversationListComponent } from './feature-conversation-list.component';

describe('FeatureConversationListComponent', () => {
  let component: FeatureConversationListComponent;
  let fixture: ComponentFixture<FeatureConversationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureConversationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureConversationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

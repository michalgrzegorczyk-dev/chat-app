import { inject,Pipe, PipeTransform } from "@angular/core";
import { ChatFacade, Conversation } from "@chat-app/domain";

@Pipe({
    standalone: true,
    name: 'isActive'
  })
  export class IsActivePipe implements PipeTransform {
  
    private readonly selectedConversation = inject(ChatFacade).selectedConversation;
  
    transform(conversation: Conversation): boolean {
      return conversation.conversationId === this.selectedConversation()?.conversationId;
    }
  }
  
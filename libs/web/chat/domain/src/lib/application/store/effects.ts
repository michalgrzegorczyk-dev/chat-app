import { rxEffects } from '@rx-angular/state/effects';
import { take } from 'rxjs/operators';
import { ConversationDetails } from '../../models/conversation-content.type';
import { ChatStoreService } from './chat.service';
import { ROUTES, routing } from '../../../../../../../../apps/web/src/app/app.routes';


export function setupChatEffects(store: ChatStoreService) {
  return rxEffects(({ register }) => {
    register(store.selectConversation$, (selectedConversation) => {
      if (!selectedConversation) {
        return;
      }

      store.setMessageListLoading$.next(true);
      return store.chatService.getConversationContent(selectedConversation).subscribe((conversationDetails: ConversationDetails) => {
        store.setMessageList(conversationDetails.messageList);
        store.setMemberMap(new Map(conversationDetails.memberList.map(member => [member.id, member])));
        store.setMessageListLoading$.next(false);
      });
    });

    register(store.selectConversation$, async (conversation) => {
      if (!conversation) {
        return;
      }
      await store.router.navigate([`${routing.chat.url()}`, conversation.conversationId]);
    });

    register(store.loadConversationList$, () => {
      store.setConversationListLoading$.next(true);
      store.setConversationList$.next([]);
      store.chatService.fetchConversations().pipe(take(1)).subscribe((conversationList) => {
        console.log('received conversation list', conversationList);
        store.setConversationList$.next(conversationList);
        if (conversationList[0]) {
          store.selectConversation(conversationList[0]);
        }
        store.setConversationListLoading$.next(false);
      });
    });
  });
}

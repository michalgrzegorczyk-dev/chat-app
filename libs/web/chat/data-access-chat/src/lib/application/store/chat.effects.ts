import { rxEffects } from '@rx-angular/state/effects';
import { take } from 'rxjs/operators';
import { ConversationDetails } from '../../models/conversation-content.type';
import { ChatStore } from '../chat.store';
import { routing } from '@chat-app/util-routing';

export function setupChatEffects(store: ChatStore) {
  return rxEffects(({ register }) => {
    register(store.selectConversation$, (selectedConversation) => {
      if (!selectedConversation) {
        return;
      }

      store.setMessageListLoading$.next(true);
      return store.chatInfrastructureService
        .getConversationContent(selectedConversation)
        .subscribe((conversationDetails: ConversationDetails) => {
          store.setMessageList(conversationDetails.messageList);
          store.setMemberMap(
            new Map(
              conversationDetails.memberList.map((member) => [
                member.id,
                member
              ])
            )
          );
          store.setMessageListLoading$.next(false);
        });
    });

    register(store.selectConversation$, async (conversation) => {
      if (!conversation) {
        return;
      }
      await store.router.navigate([`${routing.chat.url()}`, conversation.conversationId]);
    });

    register(store.chatInfrastructureService.loadConversationListPing$, () => {
      store.setConversationList$.next([]);
      store.chatInfrastructureService
        .fetchConversations()
        .pipe(take(1))
        .subscribe((conversationList) => {
          store.setConversationList$.next(conversationList);
        });
    });

    register(store.loadConversationList$, () => {
      store.setConversationListLoading$.next(true);
      store.setConversationList$.next([]);
      store.chatInfrastructureService
        .fetchConversations()
        .pipe(take(1))
        .subscribe((conversationList) => {
          store.setConversationList$.next(conversationList);
          if (conversationList[0]) {
            store.selectConversation(conversationList[0]);
          }
          store.setConversationListLoading$.next(false);
        });
    });
  });
}

import { rxEffects } from '@rx-angular/state/effects';
import { take } from 'rxjs/operators';
import { ConversationDetails } from '../../models/conversation-details.type';
import { ChatStore } from './chat.store';
import { routing } from '@chat-app/util-routing';

export function setupChatEffects(store: ChatStore) {
  return rxEffects(({ register }) => {

    register(store.messageTrigger$, (messageSend) => {
      store.sendMessage$.next(messageSend);
      store.addMessage$.next({
        messageId: '',
        senderId: messageSend.userId,
        content: messageSend.content,
        createdAt: new Date().toISOString(),
        status: 'sending'
      });
    });

    register(store.sendMessage$, (messageSend) => {
      store.messageSync.scheduleMessage(messageSend);
    });

    register(store.selectConversation$, (selectedConversation) => {
      if (!selectedConversation) {
        return;
      }

      store.setMessageListLoading$.next(true);
      return store.chatInfrastructureService
        .getConversationContent(selectedConversation)
        .subscribe((conversationDetails: ConversationDetails) => {
          store.setMessageList$.next(conversationDetails.messageList);
          store.setMemberIdMap$.next(
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
            store.selectConversation$.next(conversationList[0]);
          }
          store.setConversationListLoading$.next(false);
        });
    });
  });
}

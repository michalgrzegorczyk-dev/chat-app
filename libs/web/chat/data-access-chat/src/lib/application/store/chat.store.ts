import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MessageSendDto, MessageStatus } from "@chat-app/dtos";
import { NetworkService } from "@chat-app/network";
import { routes } from "@chat-app/util-routing";
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { EMPTY, from, pipe, switchMap, tap } from "rxjs";

import { ChatInfrastructureRest } from "../../infrastructure/chat.infrastructure-rest";
import { ChatInfrastructureWebSockets } from "../../infrastructure/chat.infrastructure-ws";
import { Conversation, ConversationDetails, Message, ReceivedMessage } from "../../models";
import { ChatState } from "../../models/chat.state";

export const initialState: ChatState = {
  messageList: [] as Message[],
  messageListLoading: false,
  conversationList: [],
  conversationListLoading: false,
  selectedConversation: null,
  selectedConversationLoading: false,
  memberIdMap: new Map(),
};

export const ChatStore = signalStore(
  withState<ChatState>(initialState),
  withMethods(
    (
      store,
      serviceRest = inject(ChatInfrastructureRest),
      router = inject(Router),
      serviceWS = inject(ChatInfrastructureWebSockets),
      network = inject(NetworkService),
    ) => ({
      loadConversationList: async () => {
        patchState(store, { conversationListLoading: true });

        try {
          const conversations = await serviceRest.fetchConversations();
          patchState(store, { conversationList: conversations });
        } catch (e) {
          console.error("Failed to load conversation list:", e);
        } finally {
          patchState(store, { conversationListLoading: false });
        }
      },

      selectConversation: rxMethod<Conversation | null>(
        pipe(
          switchMap((conversation) => {
            if (!conversation) {
              patchState(store, {
                selectedConversation: null,
                selectedConversationLoading: false,
                messageList: [],
                memberIdMap: new Map(),
              });

              return EMPTY;
            }

            patchState(store, {
              selectedConversationLoading: true,
              messageListLoading: true,
              messageList: [],
              memberIdMap: new Map(),
            });

            return from(router.navigate([`${routes.chat.url()}`, conversation.conversationId])).pipe(
              switchMap(() => serviceRest.getConversationContent(conversation)),
              tapResponse({
                next: (details: ConversationDetails) =>
                  patchState(store, {
                    selectedConversation: conversation,
                    messageList: details.messageList,
                    memberIdMap: new Map(
                      details.memberList.map((member) => {
                        return [
                          member.id,
                          {
                            id: member.id,
                            name: member.name,
                            avatarUrl: member.avatarUrl,
                          },
                        ];
                      }),
                    ),
                    messageListLoading: false,
                    selectedConversationLoading: false,
                  }),
                error: (error) => {
                  console.error("Failed to load conversation details:", error);
                  patchState(store, {
                    messageListLoading: false,
                    selectedConversationLoading: false,
                    messageList: [],
                    memberIdMap: new Map(),
                  });
                },
              }),
            );
          }),
        ),
      ),

      sendMessage: rxMethod<MessageSendDto>(
        pipe(
          switchMap((message) => {
            const optimisticMessage: Message = {
              createdAt: new Date().toISOString(),
              localMessageId: message.localMessageId,
              messageId: "",
              content: message.content,
              status: "sending" as MessageStatus,
              senderId: message.userId,
            };

            patchState(store, {
              messageList: [...store.messageList(), optimisticMessage],
            });

            if (network.isOnline()) {
              serviceWS.sendMessageWebSocket(message);
            } else {
              const offlineMessages = JSON.parse(localStorage.getItem("offlineMessages") ?? "[]");
              offlineMessages.push(message);
              localStorage.setItem("offlineMessages", JSON.stringify(offlineMessages));
            }

            return EMPTY;
          }),
        ),
      ),

      initializeMessageReceiving: rxMethod<void>(
        pipe(
          switchMap(() => {
            return serviceWS.messageReceived$.pipe(
              tap((message: ReceivedMessage) => {
                const currentConversationId = store.selectedConversation()?.conversationId;

                if (currentConversationId === message.conversationId) {
                  const currentMessages = store.messageList();

                  // todo, not performant, skip  for now
                  const updatedMessages = currentMessages.map((currentMessage: Message) => {
                    if (currentMessage.localMessageId === message.localMessageId) {
                      return {
                        ...currentMessage,
                        status: "sent" as MessageStatus,
                        messageId: message.messageId,
                      };
                    }
                    return currentMessage;
                  });

                  const messageExists = currentMessages.some((msg) => msg.localMessageId === message.localMessageId);

                  if (!messageExists) {
                    updatedMessages.push(message);
                  }

                  patchState(store, {
                    messageList: updatedMessages,
                  });
                }
              }),
            );
          }),
        ),
      ),

      syncOfflineMessages: rxMethod<void>(
        pipe(
          switchMap(() => {
            const offlineMessages: MessageSendDto[] = JSON.parse(localStorage.getItem("offlineMessages") ?? "[]");

            if (offlineMessages.length > 0) {
              offlineMessages.forEach((message) => {
                serviceWS.sendMessageWebSocket(message);
              });
              localStorage.setItem("offlineMessages", "[]");
            }

            return EMPTY;
          }),
        ),
      ),

      updateConversationName: rxMethod<string>(
        pipe(
          switchMap((name) => {
            const conversation = store.selectedConversation();
            const conversationList = store.conversationList();

            if (!conversation || !conversationList) {
              return EMPTY;
            }

            return from(serviceRest.updateConversationName(conversation.conversationId, name)).pipe(
              tapResponse({
                next: () => {
                  // Update selected conversation
                  const updatedConversation = { ...conversation, name };

                  // Update conversation in the list
                  const updatedList = conversationList.map((conv) => (conv.conversationId === conversation.conversationId ? { ...conv, name } : conv));

                  // Update both states
                  patchState(store, {
                    selectedConversation: updatedConversation,
                    conversationList: updatedList,
                  });
                },
                error: (error) => {
                  console.error("Failed to update conversation name:", error);
                },
              }),
            );
          }),
        ),
      ),
    }),
  ),
);

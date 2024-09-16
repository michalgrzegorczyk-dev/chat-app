// import { Conversation } from '@chat-app/domain';
// nie nazywaj libki generycznie (utils). utils moze byc wszystkim, powinno sie nadawac konkretne nazwy
// ta funkcja jest uzyta tylko w jednej libce, nie ma sensu tego wydzielac do osobnej libki (powinno sie robic takie rzeczy dopiero w momencie, gdy wiecej libek bedzie potrzebowalo uzyc tego samego kodu, a i tak sa przypadki, gdy nie ma to sensu)
export function sortConversationsByLastMessageTimestamp(conversations: any[]): any[] {
  return conversations.sort((a, b) => {
    if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
      return b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp);
    }
    return 0;
  });
}

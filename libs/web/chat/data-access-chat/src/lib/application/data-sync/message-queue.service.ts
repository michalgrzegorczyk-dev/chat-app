import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';

@Injectable({
  providedIn: 'root'
})
export class MessageQueueService {
  private queueSubject = new BehaviorSubject<MessageSend[]>([]);
  private sendMessageSubject = new Subject<MessageSend>();
  private messageReceivedSubject = new Subject<ReceivedMessage>();

  public getQueue(): Observable<MessageSend[]> {
    return this.queueSubject.asObservable();
  }

  public addToQueue(message: MessageSend): void {
    const currentQueue = this.queueSubject.value;
    this.queueSubject.next([...currentQueue, message]);
  }

  public removeFromQueue(localMessageId: string): void {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.filter(msg => msg.localMessageId !== localMessageId);
    this.queueSubject.next(updatedQueue);
  }

  public sendMessage(message: MessageSend): void {
    this.sendMessageSubject.next(message);
  }

  public onMessageSend(): Observable<MessageSend> {
    return this.sendMessageSubject.asObservable();
  }

  public handleReceivedMessage(message: ReceivedMessage): void {
    if (message.localMessageId) {
      this.removeFromQueue(message.localMessageId);
      this.messageReceivedSubject.next(message);
    }
  }

  public onMessageReceived(): Observable<ReceivedMessage> {
    return this.messageReceivedSubject.asObservable();
  }

  public syncQueue(): void {
    const currentQueue = this.queueSubject.value;
    currentQueue.forEach(message => this.sendMessage(message));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private queueSubject = new BehaviorSubject<MessageSend[]>([]);
  private sendMessageSubject = new Subject<MessageSend>();
  private messageReceivedSubject = new Subject<ReceivedMessage>();

  constructor() {}

  /**
   * Get the current message queue
   */
  public getQueue(): Observable<MessageSend[]> {
    return this.queueSubject.asObservable();
  }

  /**
   * Add a message to the queue
   * @param message The message to be added to the queue
   */
  public addToQueue(message: MessageSend): void {
    const currentQueue = this.queueSubject.value;
    this.queueSubject.next([...currentQueue, message]);
  }

  /**
   * Remove a message from the queue
   * @param localMessageId The local ID of the message to be removed
   */
  public removeFromQueue(localMessageId: string): void {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.filter(msg => msg.localMessageId !== localMessageId);
    this.queueSubject.next(updatedQueue);
  }

  /**
   * Send a message
   * @param message The message to be sent
   */
  public sendMessage(message: MessageSend): void {
    this.sendMessageSubject.next(message);
  }

  /**
   * Get an Observable for sent messages
   */
  public onMessageSend(): Observable<MessageSend> {
    return this.sendMessageSubject.asObservable();
  }

  /**
   * Handle a received message
   * @param message The received message
   */
  public handleReceivedMessage(message: ReceivedMessage): void {
    if (message.localMessageId) {
      this.removeFromQueue(message.localMessageId);
      this.messageReceivedSubject.next(message);
    }
  }

  /**
   * Get an Observable for received messages
   */
  public onMessageReceived(): Observable<ReceivedMessage> {
    return this.messageReceivedSubject.asObservable();
  }

  /**
   * Sync all messages in the queue
   */
  public syncQueue(): void {
    const currentQueue = this.queueSubject.value;
    currentQueue.forEach(message => this.sendMessage(message));
  }
}

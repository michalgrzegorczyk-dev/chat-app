import {ComponentRef, Injectable, Type,ViewContainerRef } from '@angular/core';

import { ModalComponent, ModalContentComponent } from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef!: ComponentRef<ModalComponent>;
  private rootViewContainer!: ViewContainerRef;

  open(contentComponent: Type<ModalContentComponent>, title: string): void {
    console.log('ModalService: Attempting to open modal');
    if (!this.rootViewContainer) {
      console.error('ModalService: Root view container not set');
      return;
    }

    this.close();

    this.modalComponentRef = this.rootViewContainer.createComponent(ModalComponent);
    this.modalComponentRef.instance.setTitle(title);
    this.modalComponentRef.instance.open()
    this.modalComponentRef.instance.createContent(contentComponent);
  }

  close(): void {
    if (this.modalComponentRef) {
      this.modalComponentRef.destroy();
    }
  }
}

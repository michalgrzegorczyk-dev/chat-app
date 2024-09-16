import {Injectable, ComponentRef, ViewContainerRef, Type, signal} from '@angular/core';
import {ModalComponent} from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // uzywaj ! kiedy tylko musisz, inaczej ts nie bedzie dobrze podpowiadal.
  // w linijce 35 i tak sprawdzasz czy modalComponentRef istnieje. jak usuniesz ! to ts podpowie takie rzeczy
  private modalComponentRef!: ComponentRef<ModalComponent>;
  // uzywaj ! kiedy tylko musisz, inaczej ts nie bedzie dobrze podpowiadal.
  // w linijce 22 i tak sprawdzasz czy rootViewContainer istnieje. jak usuniesz ! to ts podpowie takie rzeczy
  private rootViewContainer!: ViewContainerRef;

  setRootViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.rootViewContainer = viewContainerRef;
  }

  open<T>(contentComponent: Type<T>, title: string): void {
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

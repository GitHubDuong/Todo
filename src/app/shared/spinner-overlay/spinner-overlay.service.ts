import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerOverlayComponent } from './spinner-overlay.component';
import { defer, NEVER } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpinnerOverlayService {
  private overlayRef: OverlayRef | undefined;

  constructor(private overlay: Overlay) {}

  public show(): void {
    // Hack avoiding `ExpressionChangedAfterItHasBeenCheckedError` error
    Promise.resolve(null).then(() => {
      if (!this.overlayRef) {
        this.overlayRef = this.overlay.create({
          positionStrategy: this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically(),
          hasBackdrop: true,
        });
        this.overlayRef.attach(new ComponentPortal(SpinnerOverlayComponent));
      }
    });
  }

  public hide(): void {
    // @ts-ignore
    this.overlayRef.detach();
    this.overlayRef = undefined;
  }

  public readonly spinner$ = defer(() => {
    this.show();
    return NEVER.pipe(
      finalize(() => {
        this.hide();
      }),
    );
  }).pipe(share());
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  show(): void {
    setTimeout(() => {
      this._loading.next(true);
    });
  }

  hide(): void {
    setTimeout(() => {
      this._loading.next(false);
    });
  }
}

import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  Subject,
  takeUntil,
} from 'rxjs';
import { DestroyService } from '../../service/destroy.service';

@Directive({
  selector: '[hotKey]',
  providers: [DestroyService],
})
export class HotkeyDirective implements OnInit {
  @Input() hotKey: string;

  constructor(
    private readonly destroy$: DestroyService,
    private readonly element: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.keyDownListener();
  }

  private keyDownListener() {
    if (!this.hotKey) {
      return;
    }
    fromEvent(document, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.key == this.hotKey),
        takeUntil(this.destroy$),
      )
      .subscribe(
        (event: KeyboardEvent) =>
          this.element.nativeElement.dispatchEvent(new Event('click')) &&
          event.preventDefault(),
      );
  }
}

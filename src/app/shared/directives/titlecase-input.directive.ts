import { AfterViewInit, Directive, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[titlecase]',
  standalone: true
})
export class TitleCaseInputDirective implements AfterViewInit, OnDestroy {
  destroy$ = new Subject();
  @Input() capitalizeFirstLetters: boolean = false;
  @Input() colorName!: string;
  constructor(private _ngControl: NgControl) {}

  ngAfterViewInit(): void {
    this.subscribeControl();
  }

  subscribeControl() {
    this._ngControl.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value) {
          let newValue = this.toTitleCase(value)
          this._ngControl.control.setValue(newValue, {
            emitEvent: false,
          });
          this._ngControl.viewToModelUpdate(newValue);
        }
      });
  }

  private toTitleCase(str: string): string {
    if(this.capitalizeFirstLetters) {
      return str.replace(/(?:^|\s)\S/g, function(match) {
        return match.toUpperCase();
      })
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }


  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

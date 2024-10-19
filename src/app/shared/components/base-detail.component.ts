import { FormGroup } from "@angular/forms";
import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { NotificationService } from "@app/service/notification.service";
import { ICrudMethod } from "@app/models/crud-method.model";
import { Observable } from "rxjs";
import appUtil from "@utilities/app-util";

@Directive()
export abstract class BaseDetailComponent {
  detailForm: FormGroup;
  protected isSubmit: boolean = false;
  protected appUtil= appUtil;
  @Output() onFormClosing: EventEmitter<boolean> = new EventEmitter();

  @Input() visible: boolean = true;
  @Output() visibleChange = new EventEmitter<boolean>();
  isMobile = screen.width <= 1199;
  abstract initForm(data: any): void;
  protected constructor(
  protected readonly crudService: ICrudMethod,
  protected readonly notificationService: NotificationService) {}

  checkInvalidField(field: string): boolean {
    return this.isSubmit && this.detailForm.controls[field].errors?.required;
  }

  protected get isEdit(): boolean {
    return this.detailForm?.value?.id > 0;
  }

  /**
   * Toggles the visibility of the component and resets the form.
   */
   toggleVisible(resetData: any = null): void {
    this.onReset(resetData);
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  protected onReset(data: any = null): void {
    this.isSubmit = false;
    this.initForm(data)
  }

  onEdit(id: number): void {
    this.crudService.get(id).subscribe((res: any) => {
      this.toggleVisible(res)
    })
  }

  protected onSubmit(request: any = this.detailForm.getRawValue()): Observable<any> | undefined {
    this.isSubmit = true;
    if (this.detailForm.invalid) {
      this.notificationService.warning('warning.invalid_data')
      return undefined;
    }

    return (this.isEdit
        ? this.crudService.update(request.id, request)
        : this.crudService.create(request)
    );
  }

  protected onBack(): void {
    this.toggleVisible()
  }
}

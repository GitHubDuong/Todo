import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '@app/service/toast.service';
import { CommonHelper } from '@app/shared/common/helper/common.helper';
import { ICrudService } from '@app/shared/common/service/crud.service';
import { ResponseModel } from '@app/shared/common/model/response.model';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export abstract class IFormLayoutComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() item?: any;
  @Output() visibleChange = new EventEmitter();
  submitted = false;
  mForm!: FormGroup;

  constructor(
    protected fb: FormBuilder,
    protected toastService: ToastService,
    protected translateService: TranslateService,
    protected crudService: ICrudService,
  ) {
    this.initForm();
  }

  abstract initForm(): void;

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.mForm.patchValue(item.currentValue);
    }
  }

  onCancel() {
    this.visibleChange.emit(false);
  }

  abstract onSave(): void;

  protected create() {
    this.crudService.create(this.mForm.value).subscribe(
      (res: ResponseModel) => {
        if (res.success) {
          this.toastService.success(CommonHelper.getObsValue(this.translateService.get('food.created')));
          this.visibleChange.emit(false);
        } else {
          this.toastService.error(res.messages.join('\n'));
        }
      },
      (error) => {
        this.toastService.error(CommonHelper.getObsValue(this.translateService.get('common.internal_error')));
      },
    );
  }

  abstract successCreatedMessage(): string;

  protected update() {
    this.crudService.update(this.item?.id!, this.mForm.value).subscribe(
      (res: ResponseModel) => {
        if (res.success) {
          this.toastService.success(CommonHelper.getObsValue(this.translateService.get('food.updated')));
          this.visibleChange.emit(false);
        } else {
          this.toastService.error(res.messages.join('\n'));
        }
      },
      (error) => {
        this.toastService.error(CommonHelper.getObsValue(this.translateService.get('common.internal_error')));
      },
    );
  }

  abstract successUpdatedMessage(): string;
}

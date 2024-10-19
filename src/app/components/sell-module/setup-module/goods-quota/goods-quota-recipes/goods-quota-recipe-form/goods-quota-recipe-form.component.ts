import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { GoodsQuotaRecipeService } from 'src/app/service/goods-quota-recipe.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { GoodsQuotaStepsService } from "@app/service/goods-quota-steps.service";

@Component({
  selector: 'app-goods-quota-recipe-form',
  templateUrl: './goods-quota-recipe-form.component.html',
  styleUrls: ['./goods-quota-recipe-form.component.scss'],
})
export class GoodsQuotaRecipeFormComponent implements OnInit {
  public appConstant = AppConstant;
  @Input('formData') formData: any = {};
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();

  goodsQuotaForm: FormGroup = new FormGroup({});
  goodQuotaSteps: any[] = [];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private router: Router,
    private goodsQuotaRecipeService: GoodsQuotaRecipeService,
    private readonly goodsQuotaStepsService: GoodsQuotaStepsService
  ) {
    this.goodsQuotaForm = this.fb.group({
      id: 0,
      code: [''],
      name: [''],
      goodsQuotaStepId: ['']
    });
  }

  ngOnInit(): void {
    this.getGoodQuotaSteps()
  }

  getDetail(data) {
    this.goodsQuotaForm.setValue({
      id: data.id,
      code: data.code,
      name: data.name,
      goodsQuotaStepId: data.goodsQuotaStepId
    });
  }

  onSubmit() {
    if (this.goodsQuotaForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(
          this.translateService,
          'info.please_check_again',
        ),
      });
      return;
    }

    let newData = this.cleanObject(
      AppUtil.cleanObject(this.goodsQuotaForm.value),
    );

    if (this.isEdit) {
      this.goodsQuotaRecipeService
        .updateGoodsQuotaRecipe(this.goodsQuotaForm.value.id, newData)
        .subscribe((res: any) => {
          if (res?.code === 400) {
            this.messageService.add({
              severity: 'error',
              detail: res?.msg || '',
            });
            return;
          } else {
            this.onCancel.emit({});
            this.messageService.add({
              severity: 'success',
              detail: 'Cập nhật thành công',
            });
          }
        });
    } else {
      this.goodsQuotaRecipeService
        .createGoodsQuotaRecipe(newData)
        .subscribe((res: any) => {
          if (res?.code === 400) {
            this.messageService.add({
              severity: 'error',
              detail: res?.msg || '',
            });
            return;
          } else {
            this.onCancel.emit({});
            this.messageService.add({
              severity: 'success',
              detail: 'Thêm mới thành công',
            });
          }
        });
    }
  }

  onReset() {
    this.goodsQuotaForm.reset();
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }
    return newData;
  }

  getGoodQuotaSteps():void {
    this.goodsQuotaStepsService.getAllNoneQuery().subscribe(data => {
      this.goodQuotaSteps = data;
    })
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.display) return;
    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSubmit();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }

  onCreateGoodQuotaStepSuccess(newGoodQuotaStep: any) {
    this.goodQuotaSteps.push(newGoodQuotaStep)
    this.goodsQuotaForm.patchValue({
      goodsQuotaStepId: newGoodQuotaStep.id
    })
  }
}

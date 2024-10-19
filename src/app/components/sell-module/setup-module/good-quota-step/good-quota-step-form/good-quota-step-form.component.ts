import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoodsQuotaStepsService } from "@app/service/goods-quota-steps.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TranslationService } from "@app/service/translation.service";
import { UserService } from "@app/service/user.service";

@Component({
  selector: 'app-good-quota-step-form',
  templateUrl: './good-quota-step-form.component.html',
  styleUrls: ['./good-quota-step-form.component.scss']
})
export class GoodQuotaStepFormComponent implements OnInit {
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  display: boolean = false;
  goodQuotaStepForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  employees: any[] = [];

  get goodQuotaStepFormControl() {
    return this.goodQuotaStepForm.controls;
  }

  constructor(
    private readonly goodsQuotaStepsService: GoodsQuotaStepsService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.getAllUserActive();
  }

  getAllUserActive(): void {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  toggleDisplay(): void {
    this.submitted = false;
    this.display = !this.display;
    this.goodQuotaStepForm = this.formBuilder.group({
      id: 0,
      code: [''],
      name: ['', Validators.required],
      userIds: [[], Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    // Validate
    if (this.goodQuotaStepForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        detail: this.translationService.translate('warning.invalid_data'),
      });
      return;
    }
    const id = this.goodQuotaStepForm.get("id").value;
    const requestBody = this.goodQuotaStepForm.value;
    ( id > 0
      ? this.goodsQuotaStepsService.update(id, requestBody)
      : this.goodsQuotaStepsService.create(requestBody)
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: id > 0
          ? this.translationService.translate('success.update')
          : this.translationService.translate('success.create')
      });
      this.onSuccess.emit(res)
    })
    this.toggleDisplay()
  }

  edit(id: number): void {
    this.toggleDisplay()
    this.goodsQuotaStepsService.getById(id).subscribe(res => {
      this.goodQuotaStepForm.patchValue({
        id: res.id,
        code: res.code,
        name: res.name,
        userIds: res.userIds
      })
    })
  }
}

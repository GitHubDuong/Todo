import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { SalaryHistoryService } from '@app/service/salary-history.service';
import { ContractTypeService } from '@app/service/contract-type.service';
import { UserService } from '@app/service/user.service';
import * as moment from 'moment';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-salary-history-form',
  templateUrl: './salary-history-form.component.html',
  styles: []
})
export class SalaryHistoryFormComponent implements OnInit, OnChanges {
  @Input() itemId: number
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  salaryHistoryForm!: FormGroup
  contractTypes = []
  users = []

  constructor(
    private readonly salaryHistoryService: SalaryHistoryService,
    private readonly contractTypeService: ContractTypeService,
    private readonly userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.onGetContractTypes()
    this.getAllUserActive()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.itemId)
      this.salaryHistoryService.getDetail(this.itemId).subscribe((res) => {
        this.salaryHistoryForm.patchValue({
          id: res.id,
          userCode: res.code,
          userId: res.userId,
          contractTypeId: res.contractTypeId,
          salaryTo: res.salaryTo,
          socialInsuranceSalary: res.socialInsuranceSalary,
          effectiveFrom: new Date(res.effectiveFrom),
          effectiveTo: res.effectiveTo != null ? new Date(res.effectiveTo) : null,
          note: res.note,
          percent: res.percent
        })
      })
    else
      this.salaryHistoryForm = new FormGroup({
        id: new FormControl(null),
        userCode: new FormControl(null),
        userFullName: new FormControl(null),
        userId: new FormControl(null),
        contractTypeId: new FormControl(null),
        salaryTo: new FormControl(null),
        socialInsuranceSalary: new FormControl(null),
        changedAt: new FormControl(null),
        effectiveFrom: new FormControl(null),
        effectiveTo: new FormControl(null),
        note: new FormControl(null),
        percent: new FormControl(null),
      })
  }

  onGetContractTypes(type = 0) {
    this.contractTypeService.getAllContractType(type).subscribe((res) => {
      this.contractTypes = res?.data || []
    })
  }

  getAllUserActive() {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.users = res.data;
    });
  }

  onSubmit() {
    console.log(this.salaryHistoryForm.value.effectiveFrom);

    const body = {
      id: this.itemId,
      code: this.salaryHistoryForm.value.userCode,
      userId: this.salaryHistoryForm.value.userId,
      salaryTo: this.salaryHistoryForm.value.salaryTo,
      socialInsuranceSalary: this.salaryHistoryForm.value.socialInsuranceSalary,
      effectiveFrom: this.salaryHistoryForm.value.effectiveFrom
        ? AppUtil.adjustDateOffset(this.salaryHistoryForm.value.effectiveFrom)
        : "",
      effectiveTo: this.salaryHistoryForm.value.effectiveTo
        ?  AppUtil.adjustDateOffset(this.salaryHistoryForm.value.effectiveTo)
        : "",
      note: this.salaryHistoryForm.value.note,
      contractTypeId: this.salaryHistoryForm.value.contractTypeId,
      percent: this.salaryHistoryForm.value.percent,
    }
    if (this.itemId)
      this.salaryHistoryService.updateSalaryHistory(this.itemId, body).subscribe((res) => {
        this.onCancel.emit({});
      })
    else
      this.salaryHistoryService.createSalaryHistory(body).subscribe((res) => {
        this.itemId = 0
        this.salaryHistoryForm.reset()
      })
  }

  onBack() {
    this.onCancel.emit({});
  }
}

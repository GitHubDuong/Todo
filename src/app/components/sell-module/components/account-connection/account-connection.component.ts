import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AccountType,
  AddAccountDetailType,
} from '../../../accounting-module/account-v2/account.model';
import { AddEditAccountDetailsComponent } from '../../../accounting-module/account-v2/dialogs/add-edit-account-details/add-edit-account-details.component';
import { BaseAccountComponent } from '../../../../shared/components/BaseAccountComponent';
import { AddEditAccountComponent } from '../../../accounting-module/account-v2/dialogs/add-edit-account/add-edit-account.component';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-connection',
  templateUrl: './account-connection.component.html',
  styleUrls: ['./account-connection.component.scss'],
})
export class AccountConnectionComponent
  extends BaseAccountComponent
  implements OnInit
{
  @ViewChild('addEditAccount', { static: false })
  addEditAccount: AddEditAccountComponent;
  @ViewChild('addEditAccountDetail', { static: false })
  addEditAccountDetail: AddEditAccountDetailsComponent;

  @Input() isSubmitted = false;
  currentAccountType: AccountType = AccountType.HT;
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      debitCode: [''],
      debitDetailCodeFirst: [''],
      debitDetailCodeSecond: [''],
    });
    this.getChartOfAccounts();
  }

  onAddEditAccountDetail(isDebit1?: boolean) {
    this.addEditAccountDetail.tabIndex = -1;
    if (isDebit1) {
      this.addEditAccountDetail.show(
        AddAccountDetailType.CT1,
        this.fc['debitCode'].value,
      );
    } else {
      this.addEditAccountDetail.show(
        AddAccountDetailType.CT2,
        this.fc['debitDetailCodeFirst'].value,
      );
    }
  }

  getChartOfAccounts() {
    this.chartOfAccountService.getAllCustomer().subscribe((res: any) => {
      this.chartOfAccounts = res.data;
    });
  }

  onAddEditAccountSuccess() {
    this.getChartOfAccounts();
  }

  get f() {
    return this.form;
  }

  get fc() {
    return this.form.controls;
  }

  getValue() {
    return this.f.value;
  }
}

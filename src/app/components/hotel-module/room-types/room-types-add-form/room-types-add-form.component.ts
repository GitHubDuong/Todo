import { Component, EventEmitter, Injector, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AddEditAccountDetailsComponent } from 'src/app/components/accounting-module/account-v2/dialogs/add-edit-account-details/add-edit-account-details.component';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { BaseAccountComponent } from 'src/app/shared/components/BaseAccountComponent';
import {
  AccountType,
  AddAccountDetailType,
} from '../../../accounting-module/account-v2/account.model';
@Component({
  selector: 'app-room-types-add-form',
  templateUrl: './room-types-add-form.component.html',
  styleUrls: ['./room-types-add-form.component.scss']
})
export class RoomTypesAddFormComponent extends BaseAccountComponent implements OnInit {
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @ViewChild('debitCodeTmp') debitCodeTmp: AutoComplete;
  @ViewChild('debitDetailCodeFirstTmp') debitDetailCodeFirstTmp: AutoComplete;
  @ViewChild('debitDetailCodeSecondTmp')
  debitDetailCodeSecondTmp: AutoComplete;
  @ViewChild('addEditAccountDetail', { static: false })
  addEditAccountDetail: AddEditAccountDetailsComponent;
  currentAccountType: AccountType = AccountType.HT;
  constructor(
    fb: FormBuilder,
    renderer: Renderer2,
    injector: Injector,
    chartOfAccountService: ChartOfAccountService,
    private translateService: TranslateService,
  ) {
    super(fb, chartOfAccountService, renderer, injector)
    this.form = this.fb.group({
      debitCode: [''],
      debitDetailCodeFirst: [''],
      debitDetailCodeSecond: [''],
      creditCode: [''],
      creditDetailCodeFirst: [''],
      creditDetailCodeSecond: [''],
    });
  }
  firstComplete = false;

  ngOnInit(): void {
    this.getChartOfAccountForGoods();
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

  onAddEditFirstChildAccountSuccess(input) {
    this.firstComplete = true;
  }
}

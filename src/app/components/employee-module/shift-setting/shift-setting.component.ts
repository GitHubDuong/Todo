import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { ShiftUserService } from 'src/app/service/shift-user.service';
import { SymbolService } from 'src/app/service/symbol.service';
import { TargetService } from 'src/app/service/target.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-shift-setting',
  templateUrl: './shift-setting.component.html',
  styleUrls: ['./shift-setting.component.scss'],
})
export class ShiftSettingComponent implements OnInit {
  @ViewChild('dt1') table: Table;
  @ViewChild('filter') filter: ElementRef;
  public appConstant = AppConstant;
  loading: boolean = true;
  isMobile = screen.width <= 1199;
  listSymbol = [];
  listTarget = [];
  form: FormGroup = new FormGroup({});
  lstUsers: any[] = [];
  public rangeDateArray: string[] = [];
  public searchText: string = '';
  public targetSelected: number;
  monthsOfYear = [
    { key: 1, value: 'Tháng 1' },
    { key: 2, value: 'Tháng 2' },
    { key: 3, value: 'Tháng 3' },
    { key: 4, value: 'Tháng 4' },
    { key: 5, value: 'Tháng 5' },
    { key: 6, value: 'Tháng 6' },
    { key: 7, value: 'Tháng 7' },
    { key: 8, value: 'Tháng 8' },
    { key: 9, value: 'Tháng 9' },
    { key: 10, value: 'Tháng 10' },
    { key: 11, value: 'Tháng 11' },
    { key: 12, value: 'Tháng 12' },
  ];
  selectedMonth: number = new Date().getMonth() + 1;
  first = 0;
  isCheckAll = false;
  showBulkCreate = false;

  constructor(
    private readonly translateService: TranslateService,
    private symbolService: SymbolService,
    private readonly targetService: TargetService,
    private readonly shiftUserService: ShiftUserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.form = this.fb.group({
      id: [0],
      name: [''],
      note: [''],
      month: [this.selectedMonth],
      items: [[]],
    });
    this.getDates();
  }

  ngOnInit(): void {
    forkJoin([this.symbolService.getAllSymbol(), this.targetService.getAllTarget()]).subscribe(([symbol, target]) => {
      this.listSymbol = symbol.data;
      this.listTarget = target.data;
    });
    this.getShiftUserByMonth();
  }

  onSearch(event: any): void {
    if (event.key === 'Enter') {
      this.table.filter(this.searchText, 'userFullName', 'contains');
    }
  }

  onFilterTarget(): void {
    this.table.filter(this.targetSelected, 'targetId', 'equals');
  }

  getShiftUserByMonth(): void {
    this.loading = true;
    this.isCheckAll = false;
    this.getDates();
    this.shiftUserService.getShiftUserByMonth(this.selectedMonth).subscribe((dataShift) => {
      if (dataShift) {
        this.form.patchValue(dataShift);
        this.lstUsers = dataShift.items.map((x) => {
          x.isEdit = false;
          x.checked = false;
          return x;
        });
      }

      AppUtil.scrollToTop();
      this.loading = false;
    });
  }

  getDates(): void {
    this.rangeDateArray = [];
    const year: number = new Date().getFullYear();
    const month: number = this.selectedMonth;
    const numDays = new Date(year, month, 0).getDate();
    for (let date: number = 1; date <= numDays; date++) {
      let newDate = new Date(year, month - 1, date);
      this.rangeDateArray.push(moment(newDate.setHours(0, 0, 0, 0)).format(this.appConstant.FORMAT_DATE.NORMAL_DATE));
    }
  }

  checkValidValidator(fieldName: string) {
    return (this.form.controls[fieldName].dirty || this.form.controls[fieldName].touched) &&
      (this.form.controls[fieldName].value == null || this.form.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
  }

  onSubmit(): void {
    const value = {
      ...this.form.value,
      items: this.lstUsers,
    };

    value.items.forEach((item) => {
      const user = this.lstUsers.find((x) => x.userId === item.userId);
      if (user) {
        delete user['isEdit'];
        item = user;
      }
    });
    this.shiftUserService.create(value).subscribe((res) => {
      if (res?.code === 400) {
        this.messageService.add({
          severity: 'error',
          detail: res?.msg || '',
        });
        return;
      } else {
        this.getShiftUserByMonth();
        this.messageService.add({
          severity: 'success',
          detail: 'Thành công',
        });
      }
    });
  }

  symbolName(id: number): string {
    const symbol = this.listSymbol.find((x) => x.id === id);
    if (!symbol) return '';
    return symbol.code;
  }

  targetName(id: number): string {
    const target = this.listTarget.find((x) => x.id === id);
    if (!target) return '';

    return target.name;
  }

  removeUser(user): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-primary p-button-sm',
      rejectButtonStyleClass: 'p-button-secondary p-button-sm',
      accept: () => {
        this.lstUsers = this.lstUsers.map((item) => {
          if (item.userId === user.userId) {
            item.isDeleted = true;
          }
          return item;
        });
        this.saveUser(user);
      },
    });
  }

  syncUser(): void {
    const id = this.form.get('id')?.value;
    this.shiftUserService.syncUser(id).subscribe((res) => {
      this.getShiftUserByMonth();
      this.messageService.add({
        severity: 'success',
        detail: 'Thành công',
      });
    });
  }

  saveUser(user): void {
    const id = this.form.get('id').value;
    if (!id) {
      this.messageService.add({
        severity: 'fail',
        detail: 'Vui lòng lưu thiết lập ca trước khi cập nhật ca của nhân viên.',
      });
      return;
    }
    delete user['isEdit'];
    const checkedUser = this.lstUsers.filter((x) => x.checked && x.userId !== user.userId);
    for (const key in user) {
      if (key.startsWith('day')) {
        checkedUser.forEach((item: any) => {
          item[key] = user[key];
        });
      }
    }
    if (checkedUser.length == 0) {
      this.shiftUserService.saveUser(id, user).subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.getShiftUserByMonth();
          this.messageService.add({
            severity: 'success',
            detail: 'Thành công',
          });
        }
      });
    } else {
      checkedUser.push(user);
      this.shiftUserService.saveUsers(id, checkedUser).subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.getShiftUserByMonth();
          this.messageService.add({
            severity: 'success',
            detail: 'Thành công',
          });
        }
      });
    }
  }

  onCheckAllChange(event) {
    this.lstUsers.forEach((item: any) => {
      item.checked = this.isCheckAll;
    });
  }

  onShowShiftBulkSetting() {
    this.showBulkCreate = true;
  }

  onReload() {
    this.getShiftUserByMonth();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShiftUserService } from '@app/service/shift-user.service';
import { SymbolService } from '@app/service/symbol.service';
import { TargetService } from '@app/service/target.service';
import { ToastService } from '@app/service/toast.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';

@Component({
  selector: 'app-shift-bulk-setting',
  templateUrl: './shift-bulk-setting.component.html',
  styleUrls: ['./shift-bulk-setting.component.scss'],
})
export class ShiftBulkSettingComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter();
  @Output() reload = new EventEmitter();

  symbolList: any[] = [];
  targetList: any[] = [];
  userList: any[] = [];
  filterUserList: any[] = [];
  selectedTarget: any;
  selectedSymbol: any = null;
  selectedUsers: any[] = [];
  fromDate: Date;
  toDate: Date;

  constructor(
    private symbolService: SymbolService,
    private targetService: TargetService,
    private userService: UserService,
    private shiftUserService: ShiftUserService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.symbolService.getAllSymbol().subscribe((res) => {
      this.symbolList = res.data;
    });
    this.targetService.getAllTarget().subscribe((res: any) => {
      this.targetList = res.data;
    });
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.userList = res.data;
      this.filterUserList = res.data;
    });
  }

  onChangeTarget() {
    this.selectedUsers = [];
    this.filterUserList = this.userList.filter((user) => user.targetId === this.selectedTarget.id);
  }

  onCancel() {
    this.visibleChange.emit(false);
  }

  onSave() {
    const body = {
      symbol: this.selectedSymbol.id,
      userIds: this.selectedUsers,
      fromDate: DateTimeHelper.formatDateI(this.fromDate),
      toDate: DateTimeHelper.formatDateI(this.toDate),
    };
    this.shiftUserService.bulkUsers(body).subscribe((res) => {
      this.toastService.success('Thêm mới thành công');
      this.reload.emit();
      this.visibleChange.emit(false);
    });
  }
}

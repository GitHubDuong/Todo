import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AccountConnectionComponent } from '../account-connection/account-connection.component';
import { CustomerService } from 'src/app/service/customer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dept-notification',
  templateUrl: './dept-notification.component.html',
  styleUrls: ['./dept-notification.component.scss'],
})
export class DeptNotificationComponent {
  @ViewChild('accountConnection') accountConnection: AccountConnectionComponent;
  @Input() displayDept = false;
  @Input() customerId: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() updateAccountant = new EventEmitter<any>();
  isSubmitted = false;

  constructor(
    private readonly customerService: CustomerService,
    private readonly messageService: MessageService,
  ) {}

  onSave() {
    this.isSubmitted = true;
    var debit = this.accountConnection.getValue();

    if (debit) {
      var newData = {
        debitCode: '',
        debitDetailCodeFirst: '',
        debitDetailCodeSecond: '',
      };
      newData.debitCode = debit.debitCode.code;
      if (debit.debitDetailCodeFirst) {
        newData.debitDetailCodeFirst = debit.debitDetailCodeFirst?.code;
      }
      if (debit.debitDetailCodeSecond) {
        newData.debitDetailCodeSecond = debit.debitDetailCodeSecond?.code;
      }
      for(let item in newData) {
        if(!newData[item]) {
          delete newData[item];
        }
      }
      this.customerService
        .updateAccountCustomer(this.customerId, newData)
        .subscribe((res) => {
          this.updateAccountant.emit({
            debitCode: newData.debitCode,
            debitDetailCodeFirst: newData.debitDetailCodeFirst,
          })
          this.messageService.add({
            severity: 'success',
            detail: 'Lưu thành công',
          });
          this.onCancel.emit({});
        });
    }
  }
}

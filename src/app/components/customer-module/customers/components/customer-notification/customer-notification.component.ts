import { Component, Input, SkipSelf } from '@angular/core';
import { BillService } from '../../../../../service/bill.service';
import { CustomerContactHistoryService } from '../../../../../service/customer-contact-history.service';
import { Router } from '@angular/router';
import { AppMainComponent } from '../../../../../layouts/app.main.component';

@Component({
  selector: 'app-customer-notification',
  templateUrl: './customer-notification.component.html',
  styleUrls: ['./customer-notification.component.scss'],
})
export class CustomerNotificationComponent {
  @Input() iconClass: string = 'pi pi-bell p-text-secondary text-2xl';
  @Input() type: string = 'customer';
  messages: any[] = [];
  messageCount = 0;
  displayNotification: boolean = false;

  constructor(
    private billService: BillService,
    private router: Router,
    @SkipSelf() private readonly appMain: AppMainComponent,
    private readonly customerContactHistory: CustomerContactHistoryService,
  ) {}

  ngOnInit(): void {
    this.getCountCustomerContact();
    this.getCustomerContactNotification();
  }

  getCustomerContactNotification(): void {
    this.customerContactHistory
      .getCustomerContactNotification()
      .subscribe((res) => {
        this.messages = res;
      });
  }

  getCountCustomerContact(): void {
    this.customerContactHistory.getCountCustomerContact().subscribe((res) => {
      this.messageCount = res;
    });
  }

  onMove(message: any): void {
    this.displayNotification = false;
    this.router.navigate(['/uikit/customers'], {
      queryParams: { 'customer-id': message.customerId },
    });
    // Close menu on mobile
    this.appMain.isMobile() && this.appMain.toggleMenu(new Event('click'));
  }
}

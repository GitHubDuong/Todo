import { Component, Input, OnInit, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { NotificationResult } from '../../../models/cashier.model';
import { BillService } from '../../../service/bill.service';
import AppUtil from '../../../utilities/app-util';
import { AppMainComponent } from '../../app.main.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styles: [
    `
      :host ::ng-deep .message-note p {
        margin: 0 !important;
      }
    `,
  ],
})
export class NotificationComponent implements OnInit {
  private hubConnection: signalR.HubConnection;
  @Input() displayNotification: boolean = false;
  @Input() iconClass: string = 'pi pi-bell p-text-secondary';
  @Input() notificationType: string = '';
  @Input() navigateUrl: string = '/uikit/workflow';
  existedNumMessage: number = 0;
  messages: any[] = [];

  constructor(
    private billService: BillService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private messageService: MessageService,
    @SkipSelf() private appMain: AppMainComponent,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initNotificationRealtime();
  }

  openDialog() {
    this.displayNotification = true;
    this.getNotificationMessage();
  }

  seenNotify(message: any) {
    this.billService.readMessage(message.id).subscribe((res) => {
      this.messages = this.messages.filter((ele) => ele.id !== message.id);
      this.existedNumMessage = this.existedNumMessage - 1;
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'success.seen_notification'),
      });
      this.router.navigate([this.navigateUrl], { queryParams: { 'task-id': message.userIdReceived } });
      this.displayNotification = false;

      // Close menu on mobile
      this.appMain.isMobile() && this.appMain.toggleMenu(new Event('click'));
    });
  }

  initNotificationRealtime() {
    this.getNotificationCount();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${environment.serverURL}/notify`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(function () {
        console.log('SignalR Connected!');
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    this.hubConnection.on('BroadcastMessage', () => {
      this.getNotificationCount();
      this.getNotificationMessage();
      this.reloadMessCount();
    });
  }

  deleteNotifications(): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tất cả thông báo?',
      header: 'Xóa tất cả thông báo?',
      accept: () => {
        this.billService.deleteNotificationsWork().subscribe(() => {
          this.existedNumMessage = 0;
          this.messages = [];
          this.getNotificationMessage();
          this.displayNotification = false;
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.delete_all_notification'),
          });
        });
      },
    });
  }

  getNotificationMessage() {
    this.billService.getNotificationToStaffMessage({ type: this.notificationType }).subscribe((messages) => {
      this.reloadMessCount(messages);
    });
  }

  reloadMessCount(messages?: NotificationResult[]) {
    if (messages && messages.length > 0) {
      this.messages = messages;
    }
  }

  getNotificationCount() {
    this.billService.getNotificationToStaffCount({ type: this.notificationType }).subscribe((notification: any) => {
      this.existedNumMessage = notification.count;
    });
  }
}

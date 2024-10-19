import { Component, OnInit } from '@angular/core';
import { WebMailService } from "../../../../service/web-mail.service";
import { AppMainComponent } from "../../../../layouts/app.main.component";

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.component.html',
  styles: [`
    :host ::ng-deep {
      .p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td {
        height: 2.5rem;
      }
    }
  `]
})
export class RegisterEmailComponent implements OnInit {

  first = 0;
  constructor(public appMain: AppMainComponent, private webMailService: WebMailService) { }

  webMails: any[] = [];
  loading = false;
  ngOnInit(): void {
    this.getListWebMail();
  }

  getListWebMail() {
    this.loading = true;
    this.webMailService.getList().subscribe({
      next: (res) => {
        this.webMails = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    })
  }
}

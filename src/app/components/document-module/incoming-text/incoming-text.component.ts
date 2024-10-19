import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Page, TypeData } from '../../../models/common.model';
import { IncomingTextModel } from '../../../models/incoming-text.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IncomingTextService } from '../../../service/incoming-text.service';
import AppUtil from '../../../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { IncomingTextFormComponent } from './component/incoming-text-form.component';
import AppConstants from '../../../utilities/app-constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-incoming-text',
  providers: [MessageService, ConfirmationService],
  templateUrl: './incoming-text.component.html',
  styleUrls: ['../../../../assets/demo/badges.scss'],
  styles: [],
})
export class IncomingTextComponent implements OnInit {
  appConstant = AppConstants;
  @ViewChild('incomingTextForm') incomingTextForm: IncomingTextFormComponent;
  display: boolean = false;
  displayWorkflowForm = false;
  formDataWorkflow = {};
  loading: boolean = false;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  result: TypeData<IncomingTextModel> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 10,
    totalItems: 0,
  };
  param: any = {
    page: 1,
    pageSize: 20,
  };
  isMobile = screen.width <= 1199;

  searchAdvancedForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly incomingTextService: IncomingTextService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly authService: AuthService,
    private router: Router,
  ) {
    this.searchAdvancedForm = this.fb.group({
      fromAt: null,
      toAt: null,
    });
  }

  ngOnInit(): void {
    this.getIncomingText();
  }

  getIncomingText(event?: any) {
    if (event) {
      this.param.page = event.first / event.rows;
      this.param.pageSize = event.rows;
    }
    this.incomingTextService.getPagingIncomingText(this.param).subscribe(
      (res) => {
        AppUtil.scrollToTop();
        this.result = res;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      },
    );
  }

  resetForm() {
    this.searchAdvancedForm.setValue({
      fromAt: null,
      toAt: null,
    });
    this.param = {
      page: 0,
      pageSize: 10,
    };
  }
  search() {
    if (this.searchAdvancedForm.value.fromAt) {
      this.param.fromAt = moment(this.searchAdvancedForm.value.fromAt).format(
        'YYYY-MM-DDTh:mm:ss',
      );
    }
    if (this.searchAdvancedForm.value.toAt) {
      this.param.toAt = moment(this.searchAdvancedForm.value.toAt).format(
        'YYYY-MM-DDTh:mm:ss',
      );
    }
    this.getIncomingText();
  }

  onAddIncomingText() {
    this.incomingTextForm.getDetail({});
    this.display = true;
  }

  getIncomingTextDetail(item) {
    this.incomingTextService.getIncomingTextDetail(item.id).subscribe(
      (res) => {
        this.incomingTextForm.getDetail(res);
        this.display = true;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      },
    );
  }

  onDeleteIncomingText(id) {
    let message;
    this.translateService
      .get('question.delete_incoming_text_content')
      .subscribe((res) => {
        message = res;
      });
    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.incomingTextService.deleteIncomingText(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Lỗi lấy dữ liệu',
            });
          },
        );
      },
    });
  }

  onChangeSort(event, type) {}

  onCreateWorkflow(item: IncomingTextModel) {
    this.formDataWorkflow = {
      name: item.textSymbol,
      description: item.documentTypeName,
      dueDate: null,
      userCreateName: this.authService.user.fullname,
      responsiblePerson: [],
      joinedPersons: [],
      viewedPersons: [],
      fileLink: [
        {
          fileId: '',
          fileName: item.fileUrl,
        },
      ],
    };
    this.displayWorkflowForm = true;
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getIncomingText();
    }
  }

  onCancelForm(event) {
    this.display = false;
    this.formDataWorkflow = {};
    this.displayWorkflowForm = false;
    this.getIncomingText();
  }
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddIncomingText();
        break;
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { CustomerJob } from 'src/app/models/customer-job.model';
import { CustomerStatus } from 'src/app/models/customer-status.model';
import { Customer } from 'src/app/models/customer.model';
import { CustomerContactHistoryService } from 'src/app/service/customer-contact-history.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TypeData } from 'src/app/models/common.model';
import { CustomerJobService } from 'src/app/service/customer-job.service';
import { CustomerStatusService } from 'src/app/service/customer-status.service';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { UserTaskCommentService } from 'src/app/service/user-task-comment.service';

@Component({
  selector: 'app-contact-history-form',
  templateUrl: './contact-history-form.component.html',
  styleUrls: ['contact-history-form.component.scss'],
  styles: [
    `
      .style_prev_kit {
        display: inline-block;
        border: 0;
        position: relative;
        -webkit-transition: all 400ms ease-in;
        -webkit-transform: scale(1);
        -ms-transition: all 400ms ease-in;
        -ms-transform: scale(1);
        -moz-transition: all 400ms ease-in;
        -moz-transform: scale(1);
        transition: all 400ms ease-in;
        transform: scale(1);
      }

      .style_prev_kit:hover {
        box-shadow: 0 0 40px #000000;
        z-index: 999;
        -webkit-transition: all 400ms ease-in;
        -webkit-transform: scale(2);
        -ms-transition: all 400ms ease-in;
        -ms-transform: scale(2);
        -moz-transition: all 400ms ease-in;
        -moz-transform: scale(2);
        transition: all 400ms ease-in;
        transform: scale(2);
        cursor: pointer;
      }

      img {
        width: 80px;
        height: 40px;
        border-radius: 4px;
        border: 3px solid var(--primary-color);
      }

      img:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class ContactHistoryFormComponent implements OnInit {
  public appConstant = AppConstant;
  public appUtil = AppUtil;

  @Input('formData') formData: any;
  @Input('isEdit') isEdit = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();

  @ViewChild('contactFormRef') contactFormRef: ContactFormComponent;
  displayJob = false;
  displayStatus = false;

  customerStatus: CustomerStatus[] = [];
  customerJobs: CustomerJob[] = [];
  customer: Customer;

  serverImg = environment.serverURLImage + '/Uploads/usertask/';

  title: string = '';
  customerForm: FormGroup = new FormGroup({});

  countryCodes: any[] = [];

  isSubmitted = false;
  isInvalidForm = false;
  selectedFile: any[] = [];

  types: any = {};
  contacts: any[] = [];
  filteredContacts: any[];
  selectedImageFile: any[] = [];
  fileSelected: any[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly customerContactHistory: CustomerContactHistoryService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly customerStatusService: CustomerStatusService,
    private readonly customerJobService: CustomerJobService,
    private readonly userTaskCommentService: UserTaskCommentService,
  ) {
    this.customerForm = this.fb.group({
      id: [''],
      contact: ['', [Validators.required]],
      contactObject: ['', [Validators.required]],
      phone: [''],
      position: [''],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      nextTime: ['', [Validators.required]],
      customerId: [''],
      statusId: ['', [Validators.required]],
      jobsId: ['', [Validators.required]],
      exchangeContent: [''],
      fileLink: [''],
      fileLinkStr: [''],
    });
  }

  onReset(customer, contactHistory?) {
    this.isInvalidForm = false;
    if (this.isEdit == true) {
      this.serverImg =
        environment.serverURLImage + '/Uploads/customerv2/contacthistory/';
    }
    this.customerForm.reset();
    if (customer) {
      this.customer = customer;
      this.getContacts(this.customer.id, contactHistory);
      if (contactHistory && contactHistory.id) {
        this.customerForm.controls['id'].setValue(contactHistory.id);
        if (contactHistory.fileLink) {
          this.customerForm.controls['fileLinkStr'].setValue(
            JSON.parse(contactHistory.fileLink),
          );
          this.customerForm.controls['fileLink'].setValue(
            this.setFileLink(contactHistory.fileLink),
          );
        }
        this.customerForm.controls['exchangeContent'].setValue(
          contactHistory.exchangeContent,
        );
        this.customerForm.controls['customerId'].setValue(
          contactHistory.customerId,
        );
        this.customerForm.controls['jobsId'].setValue(contactHistory.jobsId);
        this.customerForm.controls['statusId'].setValue(
          contactHistory.statusId,
        );
        this.customerForm.controls['startTime'].setValue(
          moment(contactHistory.startTime).toDate(),
        );
        this.customerForm.controls['endTime'].setValue(
          moment(contactHistory.endTime).toDate(),
        );
        this.customerForm.controls['nextTime'].setValue(
          contactHistory.nextTime !== null
            ? moment(contactHistory.nextTime).toDate()
            : '',
        );
      } else {
        this.customerForm.controls['contact'].setValue(customer.name);
        this.customerForm.controls['phone'].setValue(customer.phone);
        this.customerForm.controls['startTime'].setValue(new Date());
        this.customerForm.controls['endTime'].setValue(new Date());
        this.customerForm.controls['nextTime'].setValue(new Date());
      }
    }
  }

  setFileLink(fileLink: any) {
    var files = [];
    JSON.parse(fileLink).forEach((x) => {
      var file: any = {};
      file.fileName = x;
      var urls = x.split('\\');
      file.fileId = urls[urls.length - 1];
      files.push(file);
    });
    this.selectedFile = files;
    return files;
  }

  ngOnInit() {
    this.getCustomerJobs();
    this.getCustomerStatus();
    this.countryCodes = AppUtil.getCountries();
    this.types = this.appUtil.getUserTypes();
  }

  checkValidValidator(fieldName: string) {
    return ((this.customerForm.controls[fieldName].dirty ||
      this.customerForm.controls[fieldName].touched) &&
      this.customerForm.controls[fieldName].invalid) ||
      (this.isInvalidForm && this.customerForm.controls[fieldName].invalid)
      ? 'ng-invalid ng-dirty'
      : '';
  }

  checkValidMultiValidator(fieldNames: string[]) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (
        ((this.customerForm.controls[fieldNames[i]].dirty ||
          this.customerForm.controls[fieldNames[i]].touched) &&
          this.customerForm.controls[fieldNames[i]].invalid) ||
        (this.isInvalidForm &&
          this.customerForm.controls[fieldNames[i]].invalid)
      ) {
        return true;
      }
    }
    return false;
  }

  onSubmit() {
    this.isSubmitted = true;
    this.isInvalidForm = false;
    let newData = this.cleanObject(
      AppUtil.cleanObject(this.customerForm.value),
    );
    if (!this.isEdit) {
      this.customerContactHistory
        .createCustomerContactHistory(newData)
        .subscribe((response: any) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
          this.onCancel.emit({});
        });
    } else {
      this.customerContactHistory
        .updateCustomerContactHistory(newData, this.customerForm.value.id)
        .subscribe((response: any) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.update'),
          });
          this.onCancel.emit({});
        });
    }
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }
    newData.districtId = parseInt(newData.districtId) || 0;
    newData.provinceId = parseInt(newData.provinceId) || 0;
    newData.customerClassficationId =
      parseInt(newData.customerClassficationId) || 0;
    newData.startTime = this.appUtil.formatLocalTimezone(
      moment(
        newData.startTime && newData.startTime !== 'Invalid date'
          ? newData.startTime
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.endTime = this.appUtil.formatLocalTimezone(
      moment(
        newData.endTime && newData.endTime !== 'Invalid date'
          ? newData.endTime
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.nextTime = newData.nextTime
      ? this.appUtil.formatLocalTimezone(
          moment(
            newData.nextTime && newData.nextTime !== 'Invalid date'
              ? newData.nextTime
              : new Date(),
            this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
          ).format(this.appConstant.FORMAT_DATE.T_DATE),
        )
      : '';

    const formData = new FormData();
    if (newData.id) {
      formData.append('id', String(newData.id));
    }

    if (this.isEdit) {
      if (newData.fileLink != null && newData.fileLink.length > 0) {
        newData.fileLink.forEach((x) => {
          formData.append('fileLink', x.fieldName);
        });
      }
    }

    // Append file attached`
    if (this.fileSelected) {
      this.fileSelected.forEach((x) => {
        formData.append('fileLink', x);
      });
    }

    formData.append('startTime', newData.startTime);
    formData.append('endTime', newData.endTime);
    formData.append('nextTime', newData.nextTime);
    if (newData.exchangeContent) {
      formData.append('exchangeContent', newData.exchangeContent);
    }
    if (newData.position) {
      formData.append('position', newData.position);
    }
    formData.append('statusId', String(newData.statusId));
    formData.append('statusName', newData.statusName);
    formData.append('jobsId', String(newData.jobsId));
    formData.append('jobsName', newData.jobsName);
    formData.append('contact', newData.contact);
    formData.append('customerId', String(this.customer.id));
    return formData;
  }

  getDayOfWeek(date: any) {
    return new Date(date.year, date.month, date.day).getDay();
  }

  doAttachFile(event: any): void {
    if (
      event.target.files.length > 4 ||
      event.target.files.length + this.selectedFile.length > 4
    ) {
      return;
    }
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileSelected.push(event.target.files[i]);
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.userTaskCommentService.uploadFile(formData).subscribe((res: any) => {
        if (this.selectedFile.length < 4) {
          this.selectedFile.push(res);
        }
      });
    }
  }

  setEmptyData(columnName) {
    this.customerForm.controls[columnName].setValue('');
  }

  getCustomerStatus() {
    this.customerStatusService
      .getCustomerStatus({
        page: 0,
        pageSize: 9999,
        type: 0
      })
      .subscribe((response: TypeData<any>) => {
        this.customerStatus = response.data;
      });
  }

  getCustomerJobs() {
    this.customerJobService.getAllCustomerJob().subscribe((res) => {
      this.customerJobs = res.data;
    });
  }

  // Contact
  getContacts(customerId: number, contactHistory) {
    this.customerContactHistory
      .getCustomerContacts(customerId)
      .subscribe((contacts) => {
        this.contacts = contacts;
        this.contacts.map((x) => {
          if (x.position == 'Giám đóc') {
            x.position = 'Giám đốc';
          }
        });
        if (contactHistory) {
          const contactTemp = this.contacts.find(
            (item) => item.name === contactHistory.contact,
          );
          if (contactTemp) {
            this.customerForm.controls['contactObject'].setValue(contactTemp);
            this.fillOutContactInfo(contactTemp);
          }
        }
      });
  }
  filterContact($event: any) {
    let query = $event.query;
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
  fillOutContactInfo(contact) {
    if (contact == null) {
      return;
    }
    // Fill out contact info when selected contact
    this.customerForm.controls['position'].patchValue(contact.position);
    this.customerForm.controls['contact'].patchValue(contact.name);
    this.customerForm.controls['contactObject'].patchValue(contact);

    this.customerForm.patchValue({
      position: contact.position,
      contact: contact.name,
      phone: contact.contact,
      contactObject: contact,
    });
  }

  addNewContact() {
    this.contactFormRef.resetNewForm(this.customer.id);
  }
  onAddNewContactSuccess(contact: any) {
    this.contacts.push(contact);
    this.fillOutContactInfo(contact);
  }

  isImageExtension(fileName: string): boolean {
    return this.appUtil.isImageFile(fileName);
  }

  onImageClick(id: any) {
    // remove or add class name style_prev_kit (css hover)
    let image = document.getElementById(id);
    let isUsingClass = image.classList.contains('style_prev_kit');
    if (isUsingClass) {
      image.classList.remove('style_prev_kit');
      image.classList.add('opacity-custom');
      this.selectedImageFile = [...this.selectedImageFile, id];
    } else {
      image.classList.add('style_prev_kit');
      image.classList.remove('opacity-custom');
      this.selectedImageFile = this.selectedImageFile.filter((x) => x !== id);
    }
  }

  onRemoveFile() {
    this.selectedFile = this.selectedFile.filter(
      (x) => !this.selectedImageFile.includes(x.fileId),
    );
  }

  onSelectFile(id: any) {
    this.selectedImageFile = [...this.selectedImageFile, id];
  }

  checkURL(url: string) {
    if (url && url.includes('contacthistory')) {
      return environment.serverURLImage + '/Uploads/customerv2/contacthistory/';
    }
    return environment.serverURLImage + '/Uploads/usertask/';
  }
}

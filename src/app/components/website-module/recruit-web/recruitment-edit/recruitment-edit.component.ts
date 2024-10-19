import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CareerModel, CareerViewModel } from '../../../../models/web-setting/career.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NewsService } from '../../../../service/web-setting/news.service';
import { CareerService } from '../../../../service/web-setting/career.service';
import {
  CareerGroupType,
  LanguageType,
  WorkingMethodType,
} from '../../../../utilities/app-enum';
import AppUtil from '../../../../utilities/app-util';
import { FileService } from '@app/service/file.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recruitment-edit',
  templateUrl: './recruitment-edit.component.html',
  styleUrls: [],
})
export class RecruitmentEditComponent implements OnInit {
  @Input() display = false;
  serverImage = `${environment.serverURLImage}/`;

  @Input() set formData(value) {
    if (value?.id) {
      this.isEdit = true;
      this.newsModel = Object.assign(this.newsModel, value);
      this.newsModel.image = value.imageUrl;
      this.newsModel.imageUrl = this.serverImage + value.imageUrl;
    } else {
      this.isEdit = false;
      this.newsModel = {
        expiredApply: new Date(),
        type: 2,
      };
    }
  }

  @Output() onCancel = new EventEmitter();
  serverImg = environment.serverURLImage;
  isEdit = false;
  newsModel: CareerViewModel = {};
  languageTypes = [];
  careerGroupTypes = [];
  workingMethodTypes = [];
  file: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly careerService: CareerService,
    private readonly fileService: FileService,
  ) {}

  ngOnInit(): void {
    this.languageTypes = AppUtil.getLanguageTypes();
    this.careerGroupTypes = [
      {
        value: CareerGroupType.Office,
        name: 'Văn phòng',
      },
      {
        value: CareerGroupType.Sale,
        name: 'Bán hàng',
      },
    ];
    this.workingMethodTypes = [
      {
        value: WorkingMethodType.Shift,
        name: 'Ca',
      },
      {
        value: WorkingMethodType.FullTime,
        name: 'Toàn thời gian',
      },
      {
        value: WorkingMethodType.PartTime,
        name: 'Bán thời gian',
      },
    ];
  }

  async onSave() {
    let requestModel: CareerModel = {
      id: this.newsModel.id,
      type: this.newsModel.type,
      department: this.newsModel.department,
      imageUrl: this.newsModel.image,
      endTime: this.newsModel.endTime,
      description: this.newsModel.description,
      expiredApply : this.newsModel.expiredApply ? moment.utc(this.newsModel.expiredApply).toDate() : null,
      group : this.newsModel.group,
      groupName: this.newsModel.groupName,
      salary: this.newsModel.salary,
      location: this.newsModel.location,
      startTime: this.newsModel.startTime,
      title: this.newsModel.title,
      workingMethod: this.newsModel.workingMethod,
      workingMethodName:this.newsModel.workingMethodName,
    };

    if (this.file) {
      requestModel.imageUrl = await this.fileService.uploadMedia(
        this.file,
        'News',
      );
    }
    if (requestModel.id) {
      this.careerService
        .updateCareer(requestModel, this.newsModel.id)
        .subscribe(
          (res) => {
            if (res) {
              this.messageService.add({
                severity: 'success',
                detail: AppUtil.translate(
                  this.translateService,
                  'success.update',
                ),
              });
              this.onCancel.emit({});
            }
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, 'error.0'),
            });
          },
        );
    } else {
      this.careerService.createCareer(requestModel).subscribe(
        (res) => {
          if (res) {
            this.messageService.add({
              severity: 'success',
              detail: AppUtil.translate(
                this.translateService,
                'success.create',
              ),
            });
            this.onCancel.emit({});
          }
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      );
    }
  }
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSave();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }

  onUploadFile(event, fileUpload) {
    this.file = event.currentFiles[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (event) => {

      this.newsModel.image = event.target.result;
      this.newsModel.imageUrl = event.target.result;
      fileUpload.clear()
    };
  }
}

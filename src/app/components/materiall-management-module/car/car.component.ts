import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CarList } from 'src/app/models/car-list.model';
import { CarListService } from 'src/app/service/car-list.service';
import { UserTaskCommentService } from 'src/app/service/user-task-comment.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { CarFormComponent } from './components/car-form/car-form.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['../../../../assets/demo/badges.scss', './car.component.scss'],
})
export class CarComponent implements OnInit {
  public appConstant = AppConstant;
  public appUtil = AppUtil;

  @ViewChild('CarForm') CarFormComponent: CarFormComponent | undefined;

  loading: boolean = true;

  serverImg = environment.serverURLImage + '/Uploads/usertask/';

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listCar: CarList[] = [];

  first = 0;
  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  display: boolean = false;

  carId: any;
  carFieldSetup: any = [
    {
      id: 1,
      carFieldName: '',
      valueNumber: 0,
      fromAt: '',
      toAt: '',
      warningAt: '',
      userIds: [],
      note: '',
      file: '',
    },
    {
      id: 2,
      carFieldName: '',
      valueNumber: 0,
      fromAt: '',
      toAt: '',
      warningAt: '',
      userIds: [],
      note: '',
      file: '',
    },
  ];
  displayCarField = false;
  employees: any[] = [];
  selectedImageFile: any[] = [];
  fileSelected: any[] = [];
  selectedFile: any[] = [];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly carListService: CarListService,
    private readonly userService: UserService,
    private readonly userTaskCommentService: UserTaskCommentService,
  ) {}

  ngOnInit(): void {
    this.carListService.getAllCars().subscribe((response) => {
      this.listCar = response.data;
    });
    this.userService.getUserNotRoles().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  onChangeLicensePlate($event) {
    if ($event && $event.value) {
      this.carListService.getCarFieldSetup($event.value).subscribe((res) => {
        this.carFieldSetup = (res || []).map((item: any, index)=>{
          if(item.file) {
            this.selectedFile[index] = [{
              fileId: item.file?.fileName || null,
              fileName:  item.file?.fileUrl || null,
            }]
          }
          return {
            ...item,
            fromAt: item.fromAt ? new Date(item.fromAt) : null,
            toAt: item.toAt ? new Date(item.toAt) : null,
            warningAt: item.warningAt ? new Date(item.warningAt) : null,
          }
        });
        this.displayCarField = true;
      });
    } else {
      this.displayCarField = false;
    }
  }

  onSubmit() {
    if (this.carFieldSetup.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(this.translateService, 'info.please_check_again'),
      });
      return;
    }

    this.carFieldSetup.forEach((x, i) => {
      const customFile = this.selectedFile && this.selectedFile.length > 0 && this.selectedFile[i] && this.selectedFile[i].length > 0
        ? {
          fileName: this.selectedFile[i][0]?.fileId,
          fileUrl: this.selectedFile[i][0]?.fileName,
        } : null
      x.valueDate = x.valueDate && x.valueDate != 'Invalid date' ? moment(AppUtil.adjustDateOffset(x.valueDate)).format('YYYY-MM-DD') : '';
      x.fromAt = x.fromAt && x.fromAt != 'Invalid date' ? moment(AppUtil.adjustDateOffset(x.fromAt)).format('YYYY-MM-DD') : '';
      x.toAt = x.toAt && x.toAt != 'Invalid date' ? moment(AppUtil.adjustDateOffset(x.toAt)).format('YYYY-MM-DD') : '';
      x.warningAt = x.warningAt && x.warningAt != 'Invalid date' ? moment(AppUtil.adjustDateOffset(x.warningAt)).format('YYYY-MM-DD') : '';
      x.valueNumber = x.valueNumber != null ? Number(x.valueNumber) : 0;
      x.note = x.note ?? '';
      x.file = customFile
    });

    this.carListService.updateCarFieldSetup(this.carId, this.carFieldSetup).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        detail: 'Cập nhật thành công',
      });
      this.displayCarField = false;
      this.carId = null;
    });
  }

  doAttachFile(event: any, id): void {
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileSelected.push(event.target.files[i]);
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.userTaskCommentService.uploadFile(formData).subscribe((res: any) => {
        if (this.selectedFile[id] == undefined) this.selectedFile[id] = [];
        this.selectedFile[id].unshift(res);
      });
    }
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

  onRemoveFile(id) {
    this.selectedFile[id] = [];
  }
}

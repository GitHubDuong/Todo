import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Goods } from '../../../../models/goods.model';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { GoodsService } from '../../../../service/goods.service';
import AppUtil from '../../../../utilities/app-util';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styles: [
    `
      .style_prev_kit {
        display: inline-block;
        border: 0;
        width: 128px;
        height: 128px;
        position: relative;
        -webkit-transition: all 200ms ease-in;
        -webkit-transform: scale(1);
        -ms-transition: all 200ms ease-in;
        -ms-transform: scale(1);
        -moz-transition: all 200ms ease-in;
        -moz-transform: scale(1);
        transition: all 200ms ease-in;
        transform: scale(1);
      }

      .style_prev_kit:hover {
        box-shadow: 0 0 40px #000000;
        z-index: 999;
        -webkit-transition: all 200ms ease-in;
        -webkit-transform: scale(2);
        -ms-transition: all 200ms ease-in;
        -ms-transform: scale(2);
        -moz-transition: all 200ms ease-in;
        -moz-transform: scale(2);
        transition: all 200ms ease-in;
        transform: scale(2);
        cursor: pointer;
      }

      img {
        border-radius: 4px;
        border: 3px solid var(--primary-color);
      }

      img:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class ProductEditComponent implements OnInit {
  @Input() display = false;
  @Input() types = {};

  @Input() set formData(value) {
    this.fileListStr = [];
    if (value?.id) {
      this.isEdit = true;
      Object.assign(this.goodModel, value);
      this.goodModel.detail1 =
        value.detailFirstObj != null ? value.detailFirstObj.code : '';
      this.goodModel.detail2 =
        value.detailSecondObj != null ? value.detailSecondObj.code : '';
      if (this.goodModel.image1) {
        this.fileListStr.push(this.goodModel.image1);
      }
      if (this.goodModel.image2) {
        this.fileListStr.push(this.goodModel.image2);
      }
      if (this.goodModel.image3) {
        this.fileListStr.push(this.goodModel.image3);
      }
      if (this.goodModel.image4) {
        this.fileListStr.push(this.goodModel.image4);
      }
      if (this.goodModel.image5) {
        this.fileListStr.push(this.goodModel.image5);
      }
      if (this.goodModel.contentVietNam) {
        this.contentVietnam = this.goodModel.contentVietNam;
      }
      if (this.goodModel.contentKorea) {
        this.contentKorea = this.goodModel.contentKorea;
      }
      if (this.goodModel.contentEnglish) {
        this.contentEnglish = this.goodModel.contentEnglish;
      }
    } else {
      this.isEdit = false;
    }
  }

  @Output() onCancel = new EventEmitter();

  public appUtil = AppUtil;

  serverImg = environment.serverURLImage + '/';
  isEdit = false;
  goodModel: Goods = {};
  contentVietnam = '';
  newContentImagesVn = [];
  contentKorea = '';
  newContentImagesKo = [];
  contentEnglish = '';
  newContentImagesEn = [];
  selectedImages: string[] = [];
  fileListStr: string[] = [];
  uploading: boolean = false;
  serverUrl = environment.serverURL;
  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly goodsService: GoodsService,
  ) {}

  ngOnInit(): void {}

  onSave() {
    let requestModel: Goods = {};
    Object.assign(requestModel, this.goodModel);
    if (this.newContentImagesVn?.length) {
      this.newContentImagesVn?.map((cmtImg) => {
        this.contentVietnam.replace(cmtImg.oldText, cmtImg.newLink);
      });
    }
    if (this.newContentImagesKo?.length) {
      this.newContentImagesKo?.map((cmtImg) => {
        this.contentKorea.replace(cmtImg.oldText, cmtImg.newLink);
      });
    }
    if (this.newContentImagesEn?.length) {
      this.newContentImagesEn?.map((cmtImg) => {
        this.contentEnglish.replace(cmtImg.oldText, cmtImg.newLink);
      });
    }
    requestModel.contentVietNam = this.contentVietnam;
    requestModel.contentKorea = this.contentKorea;
    requestModel.contentEnglish = this.contentEnglish;

    requestModel.image1 =
      this.fileListStr.length > 0 && this.fileListStr[0]
        ? this.fileListStr[0]
        : '';
    requestModel.image2 =
      this.fileListStr.length > 0 && this.fileListStr[1]
        ? this.fileListStr[1]
        : '';
    requestModel.image3 =
      this.fileListStr.length > 0 && this.fileListStr[2]
        ? this.fileListStr[2]
        : '';
    requestModel.image4 =
      this.fileListStr.length > 0 && this.fileListStr[3]
        ? this.fileListStr[3]
        : '';
    requestModel.image5 =
      this.fileListStr.length > 0 && this.fileListStr[4]
        ? this.fileListStr[4]
        : '';

    this.goodsService
      .updateForWebsite(requestModel, this.goodModel.id)
      .subscribe(
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

  onChangeEditorVietnam(event) {
    this.contentVietnam = event.htmlValue;
    event?.delta?.ops?.map((item) => {
      if (item?.insert?.image) {
        const image = item?.insert?.image;
        const formData = new FormData();
        formData.append(
          'file',
          new Blob([image.split(',')[1]], { type: 'image/png' }),
        );
        this.goodsService.uploadFiles(formData).subscribe(
          (res) => {
            if (res) {
              this.newContentImagesVn.push({
                oldText: image,
                newLink: this.serverImg + res.fileName,
              });
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
    });
  }

  onChangeEditorKorea(event) {
    this.contentKorea = event.htmlValue;
    event?.delta?.ops?.map((item) => {
      if (item?.insert?.image) {
        const image = item?.insert?.image;
        const formData = new FormData();
        formData.append(
          'file',
          new Blob([image.split(',')[1]], { type: 'image/png' }),
        );
        this.goodsService.uploadFiles(formData).subscribe(
          (res) => {
            if (res) {
              this.newContentImagesKo.push({
                oldText: image,
                newLink: this.serverImg + res.fileName,
              });
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
    });
  }

  onChangeEditorEnglish(event) {
    this.contentEnglish = event.htmlValue;
    event?.delta?.ops?.map((item) => {
      if (item?.insert?.image) {
        const image = item?.insert?.image;
        const formData = new FormData();
        formData.append(
          'file',
          new Blob([image.split(',')[1]], { type: 'image/png' }),
        );
        this.goodsService.uploadFiles(formData).subscribe(
          (res) => {
            if (res) {
              this.newContentImagesEn.push({
                oldText: image,
                newLink: this.serverImg + res.fileName,
              });
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
    });
  }

  doAttachFile(event: any): void {
    if (
      this.fileListStr.length >= 5 ||
      event.target?.files.length > 5 ||
      event.target?.files.length + this.fileListStr.length > 5
    ) {
      this.messageService.add({
        severity: 'error',
        detail: this.appUtil.translate(
          this.translateService,
          'The number of uploads has exceeded the allowed amount',
        ),
      });
      return;
    }
    for (let i = 0; i < event.target?.files.length; i++) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.goodsService.uploadFiles(formData).subscribe((response: any) => {
        if (
          response.body &&
          response.body.imageUrl &&
          this.fileListStr.length < 5
        ) {
          this.fileListStr.push(response.body.imageUrl);
        }
        this.uploading = false;
        console.log('index file', i);
      });
    }
  }

  onImageClick(id: any) {
    // remove or add class name style_prev_kit (css hover)
    let image = document.getElementById(id);
    let isUsingClass = image.classList.contains('style_prev_kit');
    if (isUsingClass) {
      image.classList.remove('style_prev_kit');
      image.classList.add('opacity-custom');
      this.selectedImages = [...this.selectedImages, id];
    } else {
      image.classList.add('style_prev_kit');
      image.classList.remove('opacity-custom');
      this.selectedImages = this.selectedImages.filter((x) => x !== id);
    }
  }

  onRemoveImages() {
    if (this.selectedImages.length > 0) {
      this.fileListStr = this.fileListStr.filter(
        (item) => !this.selectedImages.includes(item),
      );
      this.goodsService
        .deleteFiles(this.selectedImages)
        .subscribe((url: string) => {
          this.messageService.add({
            severity: 'success',
            detail: this.appUtil.translate(
              this.translateService,
              'success.delete',
            ),
          });
        });
      this.selectedImages = [];
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
}

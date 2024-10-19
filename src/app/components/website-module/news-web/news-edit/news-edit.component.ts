import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/service/category.service';
import { environment } from '../../../../../environments/environment';
import { NewsModel } from '../../../../models/web-setting/news.model';
import { FileService } from '../../../../service/file.service';
import { NewsService } from '../../../../service/web-setting/news.service';
import { MenuType } from '../../../../utilities/app-enum';
import AppUtil from '../../../../utilities/app-util';
import { Editor } from "primeng/editor";

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styles: [`
    :host ::ng-deep .p-button-label {
      height: 22px;
    }
  `],
})
export class NewsEditComponent implements OnInit {
  @ViewChild('pEditor') pEditor: Editor;
  @Input() display = false;

  @Input() set formData(value) {
    if (value?.id) {
      this.isEdit = true;
      this.newsModel = Object.assign(this.newsModel, value);
      this.newsModel.imageUrl = this.newsModel.image
        ? `${ environment.serverURLImage }/${ this.newsModel.image }`
        : '';
      this.newsModel.categoryId = value.categoryId
        ? this.categories.filter((x) => x.id == value.categoryId)[0]
        : undefined;
      this.content = this.newsModel.content || '';
      this.imgUrls = (value.file || []).map((item => `${ environment.serverURLImage }/${ item.fileUrl }`));
      this.newsModel.uploadedFiles = value.uploadedFiles;
      return
    }

    this.isEdit = false;
    this.content = '';
    this.newsModel = {};
    this.newContentImages = [];
    this.newsModel.type = 2;
    this.imgUrls = []
  }

  @Input() categories: any[] = [];
  @Output() onCancel = new EventEmitter();
  serverImg = environment.serverURLImage;
  isEdit = false;
  newsModel: NewsModel = {};
  languageTypes = [];
  content = '';
  newContentImages = [];
  file: any;
  uploadedFiles: any[] = [];
  imgUrls: any[] = [];
  param: any = {
    type: MenuType.MenuWeb,
    page: 1,
    pageSize: 10000,
  };

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly newsService: NewsService,
    private readonly fileService: FileService,
    private readonly categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this.languageTypes = AppUtil.getLanguageTypes();
  }

  onChangeEditor(event) {
    // this.content = event.htmlValue;
    // event?.delta?.ops?.map(async (item) => {
    //   if (item?.insert?.image) {
    //     const image = item?.insert?.image;
    //     const formData = new FormData();
    //     formData.append(
    //       'file',
    //       new Blob([image.split(',')[1]], { type: 'image/png' }),
    //     );
    //     const imageUrl = await this.fileService.uploadMedia(
    //       new File([image.split(',')[1]], 'image.jpg', {
    //         type: 'image/jpg',
    //       }),
    //       'News',
    //     );
    //     this.newContentImages.push({
    //       oldText: image,
    //       newLink: this.serverImg + imageUrl,
    //     });
    //   }
    // });
  }

  async onSave() {
    // if (this.newContentImages?.length) {
    //   this.newContentImages?.map((cmtImg) => {
    //     this.content.replace(cmtImg.oldText, cmtImg.newLink);
    //     console.log(this.content, cmtImg)
    //   });
    // }
    // this.newsModel.content = this.content;

    this.newsModel.content = this.pEditor.getQuill().root.innerHTML;
    if (this.newsModel.categoryId && this.newsModel.categoryId.id) {
      this.newsModel.categoryId = Number(this.newsModel.categoryId.id);
    }
    const formData = AppUtil.convertObjectToFormData(this.newsModel);
    formData.delete('File');
    formData.delete('uploadedFiles');

    this.uploadedFiles.forEach((file) => {
      formData.append('File', file);
    });

    if (this.newsModel.uploadedFiles !== undefined && this.newsModel.uploadedFiles != null) {
      this.newsModel.uploadedFiles.forEach((fileObject: any, index: number) => {
        Object.keys(fileObject).forEach((fileKey) => {
          formData.append(
            `uploadedFiles[${ index }][${ fileKey }]`,
            fileObject[fileKey],
          );
        });
      });
    }

    if (this.newsModel.id) {
      this.newsService.updateNews(formData, this.newsModel.id).subscribe(
        (res) => {
          if (res) {
            this.messageService.add({
              severity: 'success',
              detail: AppUtil.translate(
                this.translateService,
                'success.update',
              ),
            });
            this.imgUrls = [];
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
      this.newsService.createNews(formData).subscribe(
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

  onUploadFile(event, fileUpload) {
    this.imgUrls = [];
    this.uploadedFiles = [];
    this.newsModel.uploadedFiles = [];
    for (let file of event.files) {
      let reader = new FileReader();
      this.uploadedFiles.push(file);
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imgUrls.push(event.target.result);
        fileUpload.clear()
      };
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

  reset() {
    this.uploadedFiles = [];
  }
}

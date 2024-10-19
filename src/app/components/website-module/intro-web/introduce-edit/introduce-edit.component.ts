import { Component, EventEmitter, HostListener, Input, OnInit, Output, } from '@angular/core';
import { StandardFormService } from '@app/service/standard-form.service';
import { TranslateService } from '@ngx-translate/core';
import { Buffer } from 'buffer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { IntroduceModel, IntroduceType, } from '@app/models/web-setting/introduce.model';
import { FileService } from '@app/service/file.service';
import { IntroduceService } from '@app/service/web-setting/introduce.service';
import AppUtil from '../../../../utilities/app-util';

@Component({
  selector: 'app-introduce-edit',
  templateUrl: './introduce-edit.component.html',
  styleUrls: [],
})
export class IntroduceEditComponent implements OnInit {
  @Input() display = false;

  @Input() set formData(value) {
    if (value?.id) {
      this.isEdit = true;
      this.introduceModel = Object.assign(this.introduceModel, value);
      this.content = this.introduceModel.content || '';
    } else {
      this.isEdit = false;
      this.content = '';
      this.introduceModel.introduceTypeId = IntroduceType.Post;
      this.introduceModel.type = 2;
      this.newContentImages = [];
    }
  }

  @Output() onCancel = new EventEmitter();
  serverImg = `${ environment.serverURLImage }/`;
  isEdit = false;
  introduceModel: IntroduceModel = {};
  languageTypes = [];
  introduceTypes = [];
  content = '';
  newContentImages = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly introduceService: IntroduceService,
    private readonly fileService: FileService,
    private readonly standardFormService: StandardFormService
  ) {
  }

  ngOnInit(): void {
    this.languageTypes = AppUtil.getLanguageTypes();
    this.standardFormService.getIntroduceType().toPromise()
      .then(res => {
        if (res && res.data) {
          this.introduceTypes = res.data.filter(x => x.name || x.code).map(item => {
            return {
              value: item.id,
              name: `${ item.code }-${ item.name }`
            }
          })
        }
      })
      .catch((err: any) => {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.0'),
        });
      });
  }

  async onChangeEditor(event) {
    this.content = event.htmlValue;
    event?.delta?.ops?.map(async (item) => {
      if (item?.insert?.image) {
        const image = item?.insert?.image;
        const file = this.dataUrlToFile(image, 'image.png');
        if (!file) {
          return;
        }
        const imageUrl = await this.fileService.uploadMedia(file, 'Introduces');
        this.newContentImages.push({
          oldText: image,
          newLink: this.serverImg + imageUrl,
        });
      }
    });
  }

  private dataUrlToFile(dataUrl: string, filename: string): File | undefined {
    const arr = dataUrl.split(',');
    if (arr.length < 2) {
      return undefined;
    }
    const mimeArr = arr[0].match(/:(.*?);/);
    if (!mimeArr || mimeArr.length < 2) {
      return undefined;
    }
    const mime = mimeArr[1];
    const buff = Buffer.from(arr[1], 'base64');
    return new File([buff], filename, { type: 'image/png' });
  }

  onSave() {
    if (this.newContentImages?.length) {
      this.newContentImages?.map((cmtImg) => {
        this.content = this.content.replace(cmtImg.oldText, cmtImg.newLink);
      });
    }
    this.introduceModel.content = this.content;
    const isUpdate = this.introduceModel.id != null;
    const submitAction = isUpdate
      ? this.introduceService.updateIntroduce(
        this.introduceModel,
        this.introduceModel.id,
      )
      : this.introduceService.createIntroduce(this.introduceModel);
    submitAction.subscribe(
      (res) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(
              this.translateService,
              isUpdate ? 'success.update' : 'success.create',
            ),
          });
          this.onCancel.emit({});
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.0'),
        });
      },
    );
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

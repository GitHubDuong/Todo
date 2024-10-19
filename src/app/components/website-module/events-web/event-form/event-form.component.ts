import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventFile, EventsWeb } from '../../../../models/event.model';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import AppUtil, { fileToBase64 } from '../../../../utilities/app-util';
import AppConstant from '../../../../utilities/app-constants';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() isSaving = false;
  @Input() event: EventsWeb;
  @Output() save = new EventEmitter<FormData>();
  @Output() back = new EventEmitter();

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    order: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl<Date | null>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    note: new FormControl<string>('', { nonNullable: true }),
    linkDriver: new FormControl<string>('', { nonNullable: true }),
    files: new FormControl<EventFile[]>([], { nonNullable: true }),
  });
  maxFile = 8;
  maxFileSize = 3; // 3MB
  accept = ['.jpg', '.png', '.jpeg'];

  get f() {
    return this.form.controls;
  }

  constructor(private readonly messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { event, isVisible } = changes;
    if (isVisible && !this.isVisible) {
      this.form.reset();
    }
    if (event && this.event) {
      this.form.patchValue({
        ...this.event,
        files: (this.event.files || []).map((f) => ({
          ...f,
          fileFullUrl: `${AppConstant.DEFAULT_URLS.IMAGE}/${f.fileUrl}`,
        })),
        date: this.event.date ? moment.utc(this.event.date).toDate() : null,
      });
    }
  }

  onSave() {
    if (this.isSaving) {
      return;
    }
    const { value, valid } = this.form;
    if (!valid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('id', `${this.event?.id || 0}`);
    formData.append('name', value.name);
    formData.append('date', value.date.toISOString());
    formData.append('order', `${value.order || ''}`);
    formData.append('note', value.note);
    formData.append('linkDriver', value.linkDriver);

    const uploadedFiles: { fileUrl: string; fileName: string }[] = [];
    for (const file of value.files) {
      file.originFile
        ? formData.append('files', file.originFile)
        : uploadedFiles.push({
            fileUrl: file.fileUrl,
            fileName: file.fileName,
          });
    }
    formData.append('fileStored', JSON.stringify(uploadedFiles));

    this.save.emit(formData);
  }

  onRemoveFile(name: string) {
    const files = (this.f.files.value || []).filter((f) => f.fileName != name);
    this.f.files.setValue(files);
  }

  async onFileChanges(event: any) {
    if (event.target.files?.length) {
      const newFiles = [];
      for (const file of event.target.files) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (this.accept.indexOf(ext) < 0) {
          this.messageService.add({
            severity: 'error',
            detail: `Tệp ${file.name} không đúng định dạng!`,
          });
          event.target.value = '';
          return;
        }
        const size = file.size / 1024 / 1024;
        if (size > this.maxFileSize) {
          this.messageService.add({
            severity: 'error',
            detail: `Vui lòng chọn tệp có kích thước nhỏ hơn ${this.maxFileSize}MB!`,
          });
          event.target.value = '';
          return;
        }
        if (this.f.files.value.some((f) => f.fileName == file.name)) {
          this.messageService.add({
            severity: 'error',
            detail: `Tệp ${file.name} đã tồn tại!`,
          });
          event.target.value = '';
          return;
        }
        const url = (await fileToBase64(file)) as string;
        newFiles.push({
          fileUrl: '',
          fileFullUrl: url,
          fileName: file.name,
          originFile: file,
        });
      }
      const files: EventFile[] = [...this.f.files.value, ...newFiles];
      if (files.length > this.maxFile) {
        this.messageService.add({
          severity: 'error',
          detail: `Chỉ được tải lên tối đa ${this.maxFile} file!`,
        });
        return;
      }
      this.f.files.setValue(files);
      event.target.value = '';
    }
  }
}

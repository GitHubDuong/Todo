import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUpload } from '@app/shared/common/model/file-upload';
import { environment } from '@env/environment';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-multiple-upload',
  templateUrl: './multiple-upload.component.html',
  styleUrls: ['./multiple-upload.component.scss'],
})
export class MultipleUploadComponent implements OnInit {
  @Input() fileLink: FileUpload[] = [];
  @Input() disabledUpload = false;
  @Input() minimal = false;
  @Input() label = 'button.import'
  @Input() hideLabel = false;
  @Input() showUploadBtn = true;
  @Input() removable = true;

  showImageDetail = false;
  serverImg = environment.serverURLImage + '/';
  selectedImage: FileUpload;

  @Output() attackFiles = new EventEmitter();
  @Output() removeFile = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  isImageExtension(fileName: string): boolean {
    return AppUtil.isImageFile(fileName);
  }

  onRemoveImage(fileName: string) {
    this.fileLink = this.fileLink.filter((x) => x.fileName !== fileName);
    this.removeFile.emit(this.fileLink);
  }

  onAttachFile(event: any) {
    this.attackFiles.emit(event);
  }

  onViewImage(item: FileUpload) {
    this.selectedImage = item;
    this.showImageDetail = true;
  }
}

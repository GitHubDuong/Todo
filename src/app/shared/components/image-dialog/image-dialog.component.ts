import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileDeliveredModel } from '@app/models/procedure/procedure-product.model';
import { environment } from '@env/environment';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
})
export class ImageDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() fileList: FileDeliveredModel[] = [];
  serverImg = environment.serverURLImage + '/';
  showImageDetail = false;
  selectedImage: FileDeliveredModel;
  isMobile = screen.width <= 1199;
  constructor() {}

  ngOnInit(): void {}

  onViewImage(image: FileDeliveredModel) {
    this.showImageDetail = true;
    this.selectedImage = image;
  }

  isImageExtension(fileName: string): boolean {
    return AppUtil.isImageFile(fileName);
  }
}

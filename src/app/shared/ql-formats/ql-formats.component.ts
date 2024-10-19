import { Component, Input, OnInit } from '@angular/core';
import { Editor } from "primeng/editor";
import { FileService } from "@app/service/file.service";
import { environment } from "@env/environment";

@Component({
  selector: 'app-ql-formats',
  templateUrl: './ql-formats.component.html',
})
export class QlFormatsComponent implements OnInit {
  @Input() pEditor: Editor;
  constructor(
    private fileService: FileService
  ) {}

  ngOnInit(): void {}

  onInsertImageClick() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    // alert("Image upload is not implemented yet")

    input.onchange = async () => {
      const file = input.files[0];
      const imageUrl = await this.fileService.uploadMedia(
        new File([file], 'image.jpg', {
          type: 'image/jpg',
        }),
        'News',
      );

      const quill = this.pEditor.getQuill()
      const range = quill.getSelection(true);

      // Upload selected img into server and get the url
      quill.insertEmbed(range.index, 'image', `${environment.serverURLImage}/${imageUrl}`);
    }
  }

}



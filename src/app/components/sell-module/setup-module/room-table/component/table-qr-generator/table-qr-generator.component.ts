import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode-generator';
import { QRItem } from "../../../../../../models/qr-item.model";
import { CompanyService } from "../../../../../../service/company.service";

const TABLE_QR_CSS = `
      .qr-code-container {
        display: flex;
        flex-direction: column;
        width: 21cm;
      }

      .qr-code-row {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 30px;
      }

      .qr-code-item {
        flex: 0 0 45%; /* Adjust width as needed */
        text-align: center;
      }

      .qr-code-text {
        margin-top: 10px;
        font-size: 20px
      }
    `

@Component({
  selector: 'app-table-qr-generator',
  templateUrl: './table-qr-generator.component.html',
  styles: [TABLE_QR_CSS],
})

export class TableQrGeneratorComponent implements OnInit {
  qrCodeRows: QRItem[][] = [];
  qrCodeSize: number = 8; // Size of each QR code in pixels
  @ViewChild('qrCodesContainer') qrCodesContainer: ElementRef;
  display: boolean  = false;

  constructor(private readonly companyService :CompanyService) { }

  ngOnInit(): void {}

  toggleDialog = () => this.display = !this.display;

  generateQRCodes(codes: string[]) {
    // Get the last company information
    this.companyService.getLastCompanyInfo().subscribe(res => {
      console.log(res)
      // Extract the order web URL from the response
      let orderWebUrl = res.data.websiteName

      // Generate QR codes for each item
      const qrCodes: QRItem[] = codes.map(code => {
        return {
          text: code,
          url: this.generateQRCodeItem(`${orderWebUrl}?table=${code}`, this.qrCodeSize)
        }
      });

      // Chunk QR codes into rows
      this.qrCodeRows = this.chunkArray(qrCodes, 2);
    })
    this.toggleDialog()
  }

  /**
   * Splits an array into smaller chunks of a specified size.
   *
   * @param {any[]} arr - The array to be chunked.
   * @param {number} size - The size of each chunk.
   * @return {QRItem[][]} An array of chunks, where each chunk is an array of QRItem objects.
   */
  chunkArray(arr: any[], size: number): QRItem[][] {
    const chunkedArr = [];
    let index = 0;
    while (index < arr.length) {
      chunkedArr.push(arr.slice(index, size + index));
      index += size;
    }
    return chunkedArr;
  }

  /**
   *  Generate a QR code data URL.
   *
   * @param {string} data - The data to be encoded in the QR code.
   * @param {number} size - The size of the QR code.
   * @return {string} The data URL of the generated QR code.
   */
  generateQRCodeItem(data: string, size: number): string {
    // Create QR code instance
    const qr = QRCode(0, 'M'); // Level: 'M' - medium error correction

    // Set data and generate QR code
    qr.addData(data);
    qr.make();

    // Get QR code data URL
    return qr.createDataURL(size, size);
  }

  /**
   * Prints the QR codes table by creating a new window and writing the HTML content to it.
   *
   * @return {void} Nothing is returned by this function.
   */
  showPrintDialog(): void {
    // Get the HTML content of the QR codes table
    const content = this.qrCodesContainer.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    // Write the HTML content of the new window
    printWindow.document.write(`
      <html lang="">
        <head>
          <title>QR print</title>
          <style>${TABLE_QR_CSS}</style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print()
  }
}

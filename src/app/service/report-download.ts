import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportDownloadService {
  constructor() {}

  getFolderPathDownload(f: string, t: string): string {
    var k =
      environment.serverURL +
      '/api/ReportDownload/DownloadReportFromFile' +
      `?filename=${f}&fileType=${t}`;
    return k;
  }
}

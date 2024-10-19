import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import Fingerprint2 from 'fingerprintjs2';


let _prefix = `${AppConstant.DEFAULT_URLS.API}/InOut`;
@Injectable({
  providedIn: 'root',
})
export class TimekeepingService {
  constructor(private httpClient: HttpClient) {}

  getListInOut(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((InOut) => {
        return InOut;
      }),
    );
  }

  getAllInOut(): Observable<any> {
    return this.httpClient.get(`${_prefix}/countTargetId`).pipe(
      map((InOut: any) => {
        return InOut;
      }),
    );
  }

  saveInOut(body): Observable<any> {
    return this.httpClient.post(`${_prefix}`, body);
  }

  checkIn(body: FormData) {
    return this.httpClient.post(`${AppConstant.DEFAULT_URLS.API}/TimeKeeping/checkin`, body);
  }

  getCheckin() {
    return this.httpClient.get(`${AppConstant.DEFAULT_URLS.API}/TimeKeeping/checkin`);
  }

  getIpAddress() {
    return this.httpClient.get(`${AppConstant.DEFAULT_URLS.API}/TimeKeeping/get-public-ip`);
  }

  getDeviceId(): Promise<string> {
    return new Promise((resolve, reject) => {
      new Fingerprint2.get((components) => {
        const values = components.map(component => component.value);
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        resolve(murmur);
      });
    });
  }


  identifyFaceFromImage(body: FormData) {
    return this.httpClient.post(`${AppConstant.DEFAULT_URLS.API}/FaceRecognition/identify-face-from-image`, body);
  }
}

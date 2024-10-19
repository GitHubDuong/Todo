import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  endpoint = environment.serverURL+'/api/';

  constructor(private http: HttpClient) {}

  get(url: string, options?: any): Observable<any> {
    url = this.updateUrl(url);
    return this.http.get(url, options);
  }

  post(url: string, body: any = null, options?: any): Observable<any> {
    url = this.updateUrl(url);
    return this.http.post(url, body, options);
  }

  put(url: string, body: any = null, options?: any): Observable<any> {
    url = this.updateUrl(url);
    return this.http.put(url, body, options);
  }

  delete(url: string, options?: any): Observable<any> {
    url = this.updateUrl(url);
    return this.http.delete(url, options);
  }

  private updateUrl(req: string) {
    return this.endpoint + req;
  }
}

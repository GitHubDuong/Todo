import { Observable } from 'rxjs';

export interface ICrudService {
  create(body: any): Observable<any>;

  getPage(pageIndex: number, pageSize: number, filter: any, sort: any): Observable<any>;

  get(id: number): Observable<any>;

  update(id: number, body: any): Observable<any>;

  delete(id: number): Observable<any>;

  getAll(params: any): Observable<any>;
}

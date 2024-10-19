import { Observable } from "rxjs";

export interface ICrudMethod {
  create(body: any): Observable<any>;
  update(id: number, body: any): Observable<any>;
  get(id: number): Observable<any>;
  getAll(params: any): Observable<any>;
  delete(id: number): Observable<any>;
  export(id: number): Observable<any>;
}

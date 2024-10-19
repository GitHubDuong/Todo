import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import AppConstant from "@utilities/app-constants";
import { Observable } from "rxjs";
import { UserTaskFileModel } from "@app/models/workflow.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlanningProduceProductsService {
  private prefix: string = `${AppConstant.DEFAULT_URLS.API}/PlanningProduceProducts`;
  constructor(private httpClient: HttpClient) { }

  getCarDelivery(carId: number, carName: string, id: number) {
    const params: any = this.buildParams(carId, carName);
    return this.httpClient.get(`${this.prefix}/car-delivery/${id}`, { params })
  }

  updateCarDelivery(body: any, id: number) {
    return this.httpClient.post(`${this.prefix}/car-delivery/${id}`, body)
  }

  getPaymentProposal(carId: number, carName: string, id: number) {
    const params: any = this.buildParams(carId, carName);
    return this.httpClient.get(`${this.prefix}/payment-proposal/${id}`, { params })
  }

  updatePaymentProposal(body: any, id: number, carId: number, carName: string) {
    const params = this.buildParams(carId, carName);
    return  this.httpClient.post(`${this.prefix}/payment-proposal/${id}`, body, { params })
  }

  private buildParams(carId: number, carName: string) {
    let params: any = {  carName }
    if(carId){
      params.carId = carId;
    }
    return params;
  }

  public uploadFile(formData: any): Observable<any> {
    return this.httpClient.post(`${this.prefix}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }
}

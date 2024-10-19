import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import AppConstant from '../utilities/app-constants';
import { EventsWeb } from '../models/event.model';
import { Observable } from 'rxjs';
import { TypeData } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly url = `${AppConstant.DEFAULT_URLS.API}/EventWithImages`;

  constructor(private readonly http: HttpClient) {}

  getEvents(params: { Page: number; PageSize: number; SearchText?: string }) {
    return this.http.get<TypeData<EventsWeb>>(this.url, { params });
  }

  getEvent(id: number) {
    return this.http.get<EventsWeb>(`${this.url}/${id}`);
  }

  createEvent(formData: FormData) {
    return this.http.post(this.url, formData);
  }

  updateEvent(formData: FormData) {
    return this.http.put(`${this.url}/${formData.get('id')}`, formData);
  }

  deleteEvent(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

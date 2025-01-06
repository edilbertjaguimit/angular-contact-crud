import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contact } from '../models/contact.model';
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  getContacts() {
    return this.http.get<Contact[]>(environment.CONTACT_API_URL);
  }

  addContact(contact: Contact) {
    return this.http.post(environment.CONTACT_API_URL, contact);
  }

  getContact(id: number) {
    return this.http.get<Contact>(`${environment.CONTACT_API_URL}${id}`);
  }

  updateContact(contact: Contact) {
    return this.http.put(`${environment.CONTACT_API_URL}`, contact);
  }

  deleteContact(id: number) {
    return this.http.delete(`${environment.CONTACT_API_URL}${id}`);
  }
}

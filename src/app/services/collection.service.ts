import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.prod';
import { LoadCollections } from '../interfaces/load.interface';
import { Collection } from '../models/collection.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  public user: User = {
    nombre: '',
    email: '',
    role: '',
    google: false,
    estado: '',
    imageUrl: ''
  };

  constructor( private http: HttpClient, private router: Router ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  loadCollections( desde: number = 0 ) {
    const url = `${ base_url }/collections?from=${ desde }`;
    return this.http.get<LoadCollections>(url, this.headers);
  }

  loadCollectionById(id: string) {
    const url = `${ base_url }/collections/${ id }`;
    return this.http.get<{ok:boolean, collection: Collection}>(url, this.headers);
  }

  updateCollection( collection: Collection) {
    const url = `${ base_url }/collections/${ collection._id }`;
    return this.http.put(url, collection, this.headers);
  }

  createCollection(collection: Collection) {
    const url = `${ base_url }/collections`;
    return this.http.post<{ok: boolean, collection: Collection}>(url, collection ,this.headers);
  }

  deleteCollection(collection: Collection) {
    const url = `${ base_url }/collections/${ collection._id }`;
    return this.http.delete(url, this.headers);
  }


}

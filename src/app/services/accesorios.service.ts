import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.prod';
import { LoadCollections, LoadAccesorios } from '../interfaces/load.interface';
import { Collection } from '../models/collection.model';
import { Accesorio } from '../models/accesorio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AccesoriosService {

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

  loadAccesorios( desde: number = 0 ) {
    const url = `${ base_url }/accesorios?from=${ desde }`;
    return this.http.get<LoadAccesorios>(url, this.headers);
  }

  loadAccesorioById(id: string) {
    const url = `${ base_url }/accesorios/${ id }`;
    return this.http.get<{ok:boolean, accesorio: Accesorio}>(url, this.headers);
  }

  updateAccesorio( accesorio: Accesorio) {
    const url = `${ base_url }/accesorios/${ accesorio._id }`;
    return this.http.put(url, accesorio, this.headers);
  }

  createAccesorio(accesorio: Accesorio) {
    const url = `${ base_url }/accesorios`;
    return this.http.post<{ok: boolean, accesorio: Accesorio}>(url, accesorio,this.headers);
  }

  deleteAccesorio(accesorio: Accesorio) {
    const url = `${ base_url }/accesorios/${ accesorio._id }`;
    return this.http.delete(url, this.headers);
  }


}

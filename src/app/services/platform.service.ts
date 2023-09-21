import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { LoadPlatforms } from '../interfaces/load.interface';
import { Platform } from '../models/platform.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor( private http: HttpClient) { }

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

  loadPlatforms( desde: number = 0 ) {
    const url = `${ base_url }/platform?from=${ desde }`;
    return this.http.get<LoadPlatforms>(url, this.headers);
  }

  loadPlatformById(id: string) {
    const url = `${ base_url }/platform/${ id }`;
    return this.http.get<{ok:boolean, platform: Platform}>(url, this.headers);
  }

  updatePlatform( platform: Platform) {
    const url = `${ base_url }/platform/${ platform._id }`;
    return this.http.put(url, platform, this.headers);
  }

  createPlatform(platform: Platform) {
    const url = `${ base_url }/platform`;
    return this.http.post<{ok: boolean, platform: Platform}>(url, platform, this.headers);
  }

  deletePlatform(platform: Platform) {
    const url = `${ base_url }/platform/${ platform._id }`;
    return this.http.delete(url, this.headers);
  }


}

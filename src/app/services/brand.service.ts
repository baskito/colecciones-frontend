import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { LoadBrands } from '../interfaces/load.interface';
import { Brand } from '../models/brand.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BrandService {

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

  loadBrands( desde: number = 0 ) {
    const url = `${ base_url }/brand?from=${ desde }`;
    return this.http.get<LoadBrands>(url, this.headers);
  }

  loadBrandById(id: string) {
    const url = `${ base_url }/brand/${ id }`;
    return this.http.get<{ok:boolean, brand: Brand}>(url, this.headers);
  }

  updateBrand( brand: Brand) {
    const url = `${ base_url }/brand/${ brand._id }`;
    return this.http.put(url, brand, this.headers);
  }

  createBrand(brand: BrandService) {
    const url = `${ base_url }/brand`;
    return this.http.post<{ok: boolean, brand: Brand}>(url, brand,this.headers);
  }

  deleteBrand(brand: Brand) {
    const url = `${ base_url }/brand/${ brand._id }`;
    return this.http.delete(url, this.headers);
  }


}

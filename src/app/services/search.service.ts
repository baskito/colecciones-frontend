import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public user: User = {
    nombre: '',
    email: '',
    role: '',
    google: false,
    estado: '',
    imageUrl: ''
  };


  constructor(private http: HttpClient) { }

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

  private transformUsers( results: User[]): User[] {
    return results.map(
        user => new User(user.nombre, user.email, user.role, user.google, user.estado, user.img, user.uid)
        );
  }

  search(
    type: 'usuarios' | 'consoles' | 'accesorios' | 'collections' | 'games',
    term: string
    ) {

    const url = `${ base_url }/search/collection/${ type }/${ term }`;
    return this.http.get<any>(url, this.headers)
        .pipe(
          map( resp => {
            switch (type) {
              case 'usuarios':
                return {
                  total: resp.total,
                  totalSearch: resp.totalSearch,
                  arrayResp: this.transformUsers( resp.results ),
                };

              case 'collections':
                return {
                  total: resp.total,
                  totalSearch: resp.totalSearch,
                  arrayResp: resp.results
                };


              default:
                return {
                  total: 0,
                  totalSearch: 0,
                  arrayResp: [],
                };
            }


            // const users = resp.usuarios.map(
            //   user => new User(user.nombre, user.email, user.role, user.google, user.estado, user.img, user.uid)
            //   );

            // return {
            //   total: resp.total,
            //   usuarios: users
            // };
          })
        );
  }
}

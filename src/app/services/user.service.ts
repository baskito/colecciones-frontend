import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SignupForm } from '../interfaces/signup-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

  crearUsuario( formData: SignupForm) {
    return this.http.post(`${ base_url }/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                  })
                );
  }

  loginUsuario( formData: LoginForm) {
    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                  })
                );
  }

  loginGoogle( token: string) {
    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                  })
                );
  }

}

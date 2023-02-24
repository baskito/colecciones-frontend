import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SignupForm } from '../interfaces/signup-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  get uid(): string {
    return this.user.uid || '';
  }

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

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img='', uid, estado } = resp.usuario;
        this.user = new User(nombre, email, role, google, estado, img, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError( error => of(false))
    );
  }

  googleInit() {



  }

  logout() {

    localStorage.removeItem('token');

    this.router.navigateByUrl('/login');
    // google.accounts.id.revoke('correo', () => {

    // });


  }



  updateProfile( data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.user.role
    };
    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

}

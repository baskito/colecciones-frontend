import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { SignupForm } from '../interfaces/signup-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
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

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone ) {
    // this.googleInit();
  }

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
    google.accounts.id.initialize({
      client_id: '718625281186-9jc3tim3pqqrntu8450uka9inci47fgc.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

  }

  handleCredentialResponse( response: any ) {
    this.loginGoogle(response.credential).subscribe({
      complete: () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        });
      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: (res) => {
        console.log({login: res});
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    if (this.user.google) {

      google.accounts.id.revoke(this.user.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      }, (err:any) => {
        console.log(err);

      });

    } else {
      this.router.navigateByUrl('/login');
    }





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

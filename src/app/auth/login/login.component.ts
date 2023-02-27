import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn: ElementRef | undefined;

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(localStorage.getItem('user') || '', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    remember: new FormControl(false)
  });

  public formSubmitted = false;

  constructor(private router: Router, private userService: UserService, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    // this.googleInit();
  }

  async googleInit() {
    // google.accounts.id.initialize({
    //   client_id: '718625281186-9jc3tim3pqqrntu8450uka9inci47fgc.apps.googleusercontent.com',
    //   callback: (response: any) => this.handleCredentialResponse(response)
    // });
    await this.userService.googleInit();

    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  // handleCredentialResponse( response: any ) {
  //   this.userService.loginGoogle(response.credential).subscribe({
  //     complete: () => {
  //       console.log('Login google correcto');
  //       this.ngZone.run(() => {
  //         this.router.navigateByUrl('/');
  //       });
  //     }, // completeHandler
  //     error: (err) => {
  //       console.log(err);
  //       Swal.fire({
  //         title: 'Error',
  //         text: err.error.msg,
  //         icon: 'error'
  //       });
  //     },    // errorHandler
  //     next: (res) => {
  //       console.log({login: res});
  //     }
  //   });
  // }

  login() {
    this.formSubmitted = true;

    if ( this.loginForm.invalid ) {
      return;
    }

    this.userService.loginUsuario(this.loginForm.value).subscribe({
      complete: () => {
        console.log('Login correcto');
        this.router.navigateByUrl('/');
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
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('user', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('user');
        }
        console.log(res);
      }     // nextHandler
    });

    // this.router.navigateByUrl('/');
  }

  campoNoValido( campo: string ) {
    return this.formSubmitted && this.loginForm.get(campo)!.invalid ? true : false;
  }


}

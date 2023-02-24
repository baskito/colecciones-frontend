import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { fnPasswordsIguales } from './fnPasswordsIguales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  public formSubmitted = false;

  public signupForm: FormGroup = new FormGroup({
    nombre: new FormControl('Ikertxo', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('ibasko222@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('12345', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('12345', [Validators.required]),
    terms: new FormControl(false, Validators.requiredTrue)
  }, {
  validators: fnPasswordsIguales
}  );

  constructor(private router: Router, private userService: UserService) { }

  createUser() {
    this.formSubmitted = true;

    if ( this.signupForm.invalid ) {
      return;
    }

    // Nueva manera de callback para los observables
    this.userService.crearUsuario(this.signupForm.value).subscribe({
      complete: () => {
        Swal.fire({
          title: 'Ok!',
          text: 'Registro completado',
          icon: 'success'
        });
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
        console.log(res);
      },     // nextHandler
    });

  }

  campoNoValido( campo: string ) {
    return this.formSubmitted && this.signupForm.get(campo)!.invalid ? true : false;
  }

  passwordNotEquals() {
    return this.formSubmitted && this.signupForm.get('password')!.value !== this.signupForm.get('password2')!.value ? true : false;
  }

  passwordEquals(pass1name: string, pass2name: string) {
    return ( formGroup: FormGroup ) => {
      if (formGroup.get(pass1name)!.value === formGroup.get(pass2name)!.value) {
        formGroup.get(pass2name)?.setErrors(null)
      } else {
        formGroup.get(pass2name)?.setErrors({ notEquals: true })
      }
    }
  }

}

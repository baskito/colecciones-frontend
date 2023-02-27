import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public profileForm!: FormGroup;
  public uploadImage!: File;
  @ViewChild('fileInput') fileButton: ElementRef | undefined;
  public imgTemp: any = null;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.user = this.userService.user;

  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre:  new FormControl(this.user.nombre, [Validators.required ]),
      email:  new FormControl(this.user.email, [Validators.required, Validators.email ])
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.profileForm.value).subscribe({
      complete: () => { // completeHandler

        Swal.fire({
          title: 'Actualizado',
          text: `El usuario ${ this.user.nombre } ha sido modificado`,
          icon: 'success'
        });

    }, // errorHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // nextHandler
      next: () => {
        const { nombre, email } = this.profileForm.value;
        this.user.email = email;
        this.user.nombre = nombre;
        if (this.uploadImage) {
          this.uploadImageFunction();
        }
        this.fileButton ? this.fileButton.nativeElement.value = '' : '';
        this.imgTemp = null;
      }
    });

  }

  changeImage(file: File) {
    this.uploadImage = file;

    if (!file) {
      this.fileButton ? this.fileButton.nativeElement.value = '' : '';
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = () => {
      this.imgTemp = reader.result;

    }
  }

  uploadImageFunction() {
    this.fileUploadService.updateImage(this.uploadImage, 'usuarios', this.user.uid! )
        .then( img => this.user.img = img);
  }

  logout() {
    this.userService.logout();
  }

}

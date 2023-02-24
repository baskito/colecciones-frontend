import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: User;
  public profileForm!: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.user = this.userService.user;

  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.user.nombre, Validators.required ],
      email: [this.user.email, Validators.required ]
    });
  }

  updateProfile() {
    console.log(this.profileForm?.value);
    this.userService.updateProfile(this.profileForm.value).subscribe(resp => {
      console.log(resp);

    });

  }

}

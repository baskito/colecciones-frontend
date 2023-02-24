import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public user: User;

  constructor(private userService: UserService, private router: Router) {
    this.user = this.userService.user;
  }

  logout() {
    this.userService.logout();
  }
}

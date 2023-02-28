import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public totalUsers: number = 0;
  public totalSearch: number = 0;
  public users: User[]= [];
  public usersTemp: User[]= [];
  public paginacion: number = 0;
  public loading: boolean = true;
  public paginas = 0;

  constructor(private userServide: UserService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.loadUsers(0);
  }

  loadUsers(pagination: number) {
    this.loading = true;
    this.userServide.loadUsers(this.paginacion).subscribe({
      complete: () => {
        this.loading = false;
      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({total, usuarios}) => {
        this.totalUsers = total;
        this.users = usuarios;
        this.usersTemp = usuarios;
        this.paginas = Math.floor(total/10) + 1;

      }
    });
  }

  counter(i: number) {
    return new Array(i);
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalUsers) {
      this.paginacion -= valor;
    }

    this.loadUsers(this.paginacion);
  }

  search( term: string) {

    if (term.length === 0) {
      this.users = this.usersTemp;
      return;
    }


    this.searchService.search('usuarios', term).subscribe({
      complete: () => {

      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({total, totalSearch, usuarios}) => {
        this.users = usuarios;
        this.totalUsers = total;
        this.totalSearch = totalSearch;
      }
    });
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { SearchService } from '../../../services/search.service';
import { NewImageService } from '../../../services/new-image.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public totalSearch: number = 0;
  public users: User[]= [];
  public usersTemp: User[]= [];
  public paginacion: number = 0;
  public loading: boolean = true;
  public paginas: number = 0;
  public userSelected: User = {
    nombre: '',
    email: '',
    role: '',
    google: false,
    estado: '',
    imageUrl: ''
  };
  public selectedUid: string = '';
  public selectedImg: string = '';
  public imgSubs!: Subscription;

  constructor(private userService: UserService, private newImageService: NewImageService, private searchService: SearchService, private toastr: ToastrService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers(0);
    this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( newImage => {
      this.users[this.users.findIndex(obj => obj.uid === newImage.uid)].img = newImage.img;
      this.usersTemp = this.users;
    });
    // this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( img => {
    //   this.loadUsers(0);
    // });
  }

  loadUsers(pagination: number) {
    this.loading = true;
    this.userService.loadUsers(this.paginacion).subscribe({
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
        this.paginas = Math.floor(total/10.1) + 1;


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

  borrarInput() {
    this.users = this.usersTemp;
  }

  pages(valor: number) {
    this.paginacion = valor;

    this.loadUsers(this.paginacion);
  }

  search(term: string) {

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
      next: ({total, totalSearch, arrayResp}) => {
        this.users = arrayResp;
        this.totalUsers = total;
        this.totalSearch = totalSearch;
      }
    });
  }

  deleteUser(user: User) {
    if (this.userService.uid === user.uid) {
      Swal.fire(
        'Error',
        'No puedes darte de baja a ti mismo',
        'error'
      );
      return;

    }

    Swal.fire({
      title: '¿Dar de baja el usuario?',
      text: `Estás apunto de dar de baja el usuario ${ user.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user).subscribe({
          complete: () => {
            Swal.fire(
              'Borrado!',
              `El usuario ${ user.nombre } ha sido dado de baja`,
              'success'
            );
            this.loadUsers(0);
          }, // completeHandler
          error: (err) => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            });
          }
        });

      }
    });
  }

  changeRole(user: User) {
    console.log(user);
    this.userService.updateUser(user).subscribe({
      complete: () => {
        // Swal.fire(
        //   'Actualizado',
        //   `El usuario ${ user.nombre } ha sido actualizado correctamente`,
        //   'success'
        // );
        this.toastr.info('Usuario actualizado');

      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      }, next: () => {
        this.loadUsers(0);
      }
    });

  }

  modalUser(user: User) {
    this.userSelected = user;
    const userChild = new User(user.nombre, user.email, user.role, user.google, user.estado, user.img, user.uid);
    this.selectedImg = userChild.imageUrl;
    this.selectedUid = userChild.uid || '';
  }

}

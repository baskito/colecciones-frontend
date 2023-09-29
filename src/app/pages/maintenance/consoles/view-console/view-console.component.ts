import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
import { ConsoleService } from 'src/app/services/console.service';
import { Console } from 'src/app/models/console.model';
import { AccesoriosService } from 'src/app/services/accesorios.service';
import { Accesorio } from 'src/app/models/accesorio.model';



const base_url = environment.base_url;

@Component({
  selector: 'app-view-console',
  templateUrl: './view-console.component.html',
  styleUrls: ['./view-console.component.scss']
})
export class ViewConsoleComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  public idParamSubs!: Subscription;
  public console: Console = {
    name: '',
    model: '',
    brand: ''
  }
  public imagen1!: string;
  public missing?: string[] = [];
  public accesorios: Accesorio[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toast: ToastrService, private accService: AccesoriosService, private consoleService: ConsoleService) { }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }



  ngOnInit(): void {
    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      this.loadConsoleById(resp.params.id);
    });

  }

  loadConsoleById(id:string) {
    this.loading = true;
    this.consoleService.loadConsoleById(id).subscribe({
      complete: () => {
        this.loadAccesorioByConsole(id);
      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
        this.router.navigateByUrl( `dashboard/consoles`);
      },    // errorHandler
      next: ({console}) => {
        this.console = console;
        this.imagen1 = `${ base_url }/upload/consoles/1/${ console.img1 }`;
      }
    });
  }

  loadAccesorioByConsole(id:string) {
    this.loading = true;
    this.accService.loadAccesoriosByConsole(id).subscribe({
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
        this.router.navigateByUrl( `dashboard/consoles`);
      },    // errorHandler
      next: ({accesorios}) => {
        this.accesorios = accesorios;

      }
    });
  }

  deleteAccesorio(accesorio: Accesorio) {
    Swal.fire({
      title: '¿Eliminar accesorio?',
      text: `Estás apunto de eliminar definitivamente el accesorio ${ accesorio.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accService.deleteAccesorio(accesorio).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminado!',
              `El accesorio ${ accesorio.name } ha sido eliminado`,
              'success'
            );
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

  deleteConsole(consola: Console) {
    Swal.fire({
      title: '¿Eliminar consola?',
      text: `Estás apunto de eliminar definitivamente la consola ${ consola.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.consoleService.deleteConsole(consola).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminado!',
              `La consola ${ consola.name } ha sido eliminada`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.router.navigateByUrl('/dashboard/consoles')
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

  verImagen(num: number) {
    const url: string  = `dashboard/consoles/view/image/${this.console._id}/${num}`;
    this.router.navigateByUrl(url);
  }

}

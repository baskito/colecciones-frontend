import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';
import { Accesorio } from '../../../models/accesorio.model';
import { AccesoriosService } from '../../../services/accesorios.service';
import { NewImageService } from '../../../services/new-image.service';
import { environment } from '../../../../environments/environment.prod';
const base_url = environment.base_url;

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.scss']
})
export class AccesoriosComponent implements OnInit {

  public loading: boolean = true;
  public totalAccesorios: number = 0;
  public accesorios: Accesorio[] = [];
  public accesoriosTemp: Accesorio[] = [];
  public totalSearch: number = 0;
  public paginacion: number = 0;
  public paginas: number = 0;
  public selectedUid: string = '';
  public selectedImg: string = '';
  public accesorioSelected: Accesorio = {
    name: '',
    model: '',
    brand: ''
  };
  public imgSubs!: Subscription;

  constructor(private accesorioService: AccesoriosService, private newImageService: NewImageService, private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.loadAccesorios(0);
    this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( img => {
      this.loadAccesorios(0);
    });
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalAccesorios) {
      this.paginacion -= valor;
    }

    this.loadAccesorios(this.paginacion);
  }

  loadAccesorios(paginacion:number) {
    this.loading = true;
    this.accesorioService.loadAccesorios(this.paginacion).subscribe({
      complete: () => { // completeHandler
        this.loading = false;
      },
      error: (err) => {  // errorHandler
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // nextHandler
      next: (resp) => {
        this.totalAccesorios = resp.total;
        this.accesorios = resp.accesorios;
        this.accesoriosTemp = this.accesorios;
        this.paginas = Math.floor(this.totalAccesorios/10.1) + 1;
      }
    });
  }

  borrarInput() {
    this.accesorios = this.accesoriosTemp;
  }

  search(term: string) {

    if (term.length === 0) {
      this.accesorios = this.accesoriosTemp;
      return;
    }


    this.searchService.search('accesorios', term).subscribe({
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
        this.accesorios = arrayResp;
        console.log(total);

        this.totalAccesorios = total;
        this.totalSearch = totalSearch;
      }
    });
  }


  counter(i: number) {
    return new Array(i);
  }

  pages(valor: number) {
    this.paginacion = valor;
    console.log(valor);

    this.loadAccesorios(this.paginacion);
  }

  deleteAccesorio(accesorio: Accesorio) {
    Swal.fire({
      title: '¿Eliminar accesorio',
      text: `Estás apunto de eliminar definitivamente el accesorio ${ accesorio.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesorioService.deleteAccesorio(accesorio).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminada!',
              `El accesorio ${ accesorio.name } ha sido eliminado`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.loadAccesorios(this.paginacion);
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

  modalAccesorio(accesorio: Accesorio) {
    this.accesorioSelected = accesorio;
    if ( !accesorio.img1 ) {
      this.selectedImg = `${ base_url }/upload/usuarios/1/no-img.jpg`;
    } else {
      this.selectedImg = `${ base_url }/upload/collections/1/${ accesorio.img1 }`;
    }
    this.selectedUid = accesorio._id || '';
    console.log(this.selectedUid);


  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}

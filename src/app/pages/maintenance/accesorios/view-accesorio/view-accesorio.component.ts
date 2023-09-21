import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from 'src/app/services/collection.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Collection } from 'src/app/models/collection.model';
import { environment } from '../../../../../environments/environment.prod';
import { Accesorio } from '../../../../models/accesorio.model';
import { AccesoriosService } from '../../../../services/accesorios.service';



const base_url = environment.base_url;

@Component({
  selector: 'app-view-accesorio',
  templateUrl: './view-accesorio.component.html',
  styleUrls: ['./view-accesorio.component.scss']
})
export class ViewAccesorioComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  public idParamSubs!: Subscription;
  public accesorio: Accesorio = {
    name: '',
    brand: '',
    model: ''
  };
  public imagen1!: string;
  public missing?: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toast: ToastrService, private accService: AccesoriosService) { }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }



  ngOnInit(): void {
    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      this.loadAccesorioById(resp.params.id);
    });

  }

  loadAccesorioById(id:string) {
    this.loading = true;
    this.accService.loadAccesorioById(id).subscribe({
      complete: () => {
        console.log('subscribe complere');
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
      next: ({accesorio}) => {
        this.accesorio = accesorio;

        this.imagen1 = `${ base_url }/upload/accesorios/1/${ accesorio.img1 }`;
      }
    });


  }

  deleteAccesorio(accesorio: Accesorio) {
    Swal.fire({
      title: '¿Eliminar colección',
      text: `Estás apunto de eliminar definitivamente ${ accesorio.name }`,
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
              'Eliminada!',
              `El accesorio ${ accesorio.name } ha sido eliminado`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.router.navigateByUrl('/dashboard/accesorios')
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
    const url: string  = `dashboard/accesorios/view/image/${this.accesorio._id}/${num}`;
    this.router.navigateByUrl(url);
  }

}

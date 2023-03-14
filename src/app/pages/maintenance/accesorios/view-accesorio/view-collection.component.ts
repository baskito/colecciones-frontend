import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from 'src/app/services/collection.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Collection } from 'src/app/models/collection.model';
import { environment } from '../../../../../environments/environment.prod';



const base_url = environment.base_url;

@Component({
  selector: 'app-view-accesorio',
  templateUrl: './view-accesorio.component.html',
  styleUrls: ['./view-accesorio.component.scss']
})
export class ViewAccesorioComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  public idParamSubs!: Subscription;
  public collection: Collection = {
    name: '',
    year: '',
    editorial: ''
  };
  public imagen1!: string;
  public missing?: string[] = [];
  public chart: any;
  public data = {
    labels: [
      'Faltan',
      'Tengo'
    ],
    datasets: [{
      // label: 'My First Dataset',
      data: [15, 195],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toast: ToastrService, private colecService: CollectionService) { }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }



  ngOnInit(): void {
    console.log('empieza ngoninit');

    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      this.loadCollectionById(resp.params.id);
    });
    console.log('🚀 ~ oninit ~ this.imagen1:', this.imagen1);
    console.log('fin on onit');

  }

  loadCollectionById(id:string) {
    this.loading = true;
    this.colecService.loadCollectionById(id).subscribe({
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
      next: ({collection}) => {
        this.collection = collection;
        this.calculateMissing();

        console.log('🚀 ~ ViewCollectionComponent ~ this.colecService.loadCollectionById ~ this.collection:', this.collection);
        this.imagen1 = `${ base_url }/upload/collections/1/${ collection.img1 }`;
        console.log('🚀 ~ ViewCollectionComponent ~ this.colecService.loadCollectionById ~ this.imagen1:', this.imagen1);
      }
    });


  }

  deleteCollection(collection: Collection) {
    Swal.fire({
      title: '¿Eliminar colección',
      text: `Estás apunto de eliminar definitivamente la colección ${ collection.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.colecService.deleteCollection(collection).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminada!',
              `La colección ${ collection.name } ha sido eliminada`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.router.navigateByUrl('/dashboard/collections')
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

  calculateMissing() {



   if (this.collection.missing) {
      this.missing = this.collection.missing?.split(',');
      this.data.datasets[0].data[0] = this.missing.length;
      this.data.labels[0] = `Faltan ${ this.missing.length }`;
   } else {
    this.missing = [];
    this.data.datasets[0].data[0] = 0;
   }
    if (this.collection.fullCollection) {

     this.data.datasets[0].data[1] = this.collection.fullCollection - this.missing.length;
     this.data.labels[1] = `Tengo ${ this.collection.fullCollection - this.missing.length }`;
   }
   console.log( this.data.datasets[0].data);
   console.log(this.missing);
   console.log(this.collection.missing);
  }

  verImagen(num: number) {
    const url: string  = `dashboard/collections/view/image/${this.collection._id}/${num}`;
    this.router.navigateByUrl(url);
  }

}

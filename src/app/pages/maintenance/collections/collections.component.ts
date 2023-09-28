import { Component, OnInit, OnDestroy } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import Swal from 'sweetalert2';
import { Collection } from '../../../models/collection.model';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { delay, Subscription } from 'rxjs';
import { NewImageService } from '../../../services/new-image.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public totalCollections: number = 0;
  public collections: Collection[] = [];
  public collectionsTemp: Collection[] = [];
  public totalSearch: number = 0;
  public paginacion: number = 0;
  public paginas: number = 0;
  public selectedUid: string = '';
  public selectedImg: string = '';
  public collectionSelected: Collection = {
    name: '',
    year: '',
    editorial: ''
  };
  public imgSubs!: Subscription;

  constructor(private collectionService: CollectionService, private newImageService: NewImageService, private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.loadCollections(0);
    this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( newImage => {
      this.collections[this.collections.findIndex(obj => obj._id === newImage.uid)].img1 = newImage.img;
      this.collectionsTemp = this.collections;
    });
    // this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( img => {

    //   this.loadCollections(0);
    // });
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalCollections) {
      this.paginacion -= valor;
    }

    this.loadCollections(this.paginacion);
  }

  loadCollections(paginacion:number) {
    this.loading = true;
    this.collectionService.loadCollections(this.paginacion).subscribe({
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
        this.totalCollections = resp.total;
        this.collections = resp.collections;
        this.collectionsTemp = this.collections;
        this.paginas = Math.floor(this.totalCollections/10.1) + 1;
      }
    });
  }

  borrarInput() {
    this.collections = this.collectionsTemp;
  }

  search(term: string) {

    if (term.length === 0) {
      this.collections = this.collectionsTemp;
      return;
    }


    this.searchService.search('collections', term).subscribe({
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
        this.collections = arrayResp;
        console.log(total);

        this.totalCollections = total;
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

    this.loadCollections(this.paginacion);
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
        this.collectionService.deleteCollection(collection).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminada!',
              `La colección ${ collection.name } ha sido eliminada`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.loadCollections(this.paginacion);
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

  modalCollection(collection: Collection) {
    this.collectionSelected = collection;
    if ( !collection.img1 ) {
      this.selectedImg = `${ base_url }/upload/usuarios/1/no-img.jpg`;
    } else {
      this.selectedImg = `${ base_url }/upload/collections/1/${ collection.img1 }`;
    }
    this.selectedUid = collection._id || '';
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}

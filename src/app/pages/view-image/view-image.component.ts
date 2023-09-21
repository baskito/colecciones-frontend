import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Collection } from '../../models/collection.model';
import { CollectionService } from '../../services/collection.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.prod';
import { Accesorio } from '../../models/accesorio.model';
import { Console } from 'src/app/models/console.model';
import { AccesoriosService } from '../../services/accesorios.service';
import { ConsoleService } from '../../services/console.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit, OnDestroy {

  public idParamSubs!: Subscription;
  public loading: boolean = true;
  public num: string = '1';
  public id: string = '';
  public type: string = 'collections';
  public imageSelected: string = '';
  public img1: string = '';
  public img2: string = '';
  public img3: string = '';
  public name: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private colecService: CollectionService,
    private accService: AccesoriosService,
    private consService: ConsoleService
    ) { }

  ngOnInit(): void {
    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      this.num = resp.params.num;
      this.type = resp.params.type;
      this.id = resp.params.id;
      console.log('🚀 ~ ViewImageComponent ~ this.idParamSubs=this.activatedRoute.paramMap.subscribe ~ this.id:', this.id);
      switch (this.type) {
        case 'collections':
          this.loadCollectionById(this.id);
          break;
        case 'accesorios':
          this.loadAccesoriosById(this.id);
          break;
        case 'accesorios':
          this.loadConsolesById(this.id);
          break;
      }

    });
  }

  loadAccesoriosById(id:string) {
    this.loading = true;
    this.accService.loadAccesorioById(id).subscribe({
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
      next: ({accesorio}) => {
        this.img1 = accesorio.img1 || '';
        this.img2 = accesorio.img2 || '';
        this.img3 = accesorio.img3 || '';
        this.name = accesorio.name;
      }
    });
  }

  loadConsolesById(id:string) {
    this.loading = true;
    this.consService.loadConsoleById(id).subscribe({
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
      next: ({console}) => {
        this.img1 = console.img1 || '';
        this.img2 = console.img2 || '';
        this.img3 = console.img3 || '';
        this.name = console.name;
      }
    });
  }

  loadCollectionById(id:string) {
    this.loading = true;
    this.colecService.loadCollectionById(id).subscribe({
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
      next: ({collection}) => {
        this.img1 = collection.img1 || '';
        this.img2 = collection.img2 || '';
        this.img3 = collection.img3 || '';
        this.name = collection.name;
      }
    });


  }

  verImagen(num: number) {
    const url: string  = `dashboard/${this.type}/view/image/${this.id}/${num}`;
    this.router.navigateByUrl(url);
  }

  managePag(sum: number) {
    const number: number = parseInt(this.num);
    if (sum < 0) {
      if (number === 1) {
        return;
      } else {
        this.verImagen(number-1);
      }

    } else {
      if (number === 3) {
        return;
      } else {
        this.verImagen(number+1);
      }
    }

  }

  back() {
    this.router.navigateByUrl(`dashboard/${this.type}/view/${this.id}`);
  }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }


}

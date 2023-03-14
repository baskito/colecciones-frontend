import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Collection } from '../../models/collection.model';
import { CollectionService } from '../../services/collection.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.prod';

const base_url = environment.base_url;

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit, OnDestroy {

  public idParamSubs!: Subscription;
  public collection: Collection = {
    name: '',
    year: '',
    editorial: ''
  };
  public loading: boolean = true;
  public num: string = '1';
  public type: string = 'collections';
  public imageSelected: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private colecService: CollectionService) { }

  ngOnInit(): void {
    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      console.log(resp.params.id);
      console.log(resp.params.num);
      console.log(resp.params.type);
      this.num = resp.params.num;
      if (resp.params.type === 'collections') {
        this.loadCollectionById(resp.params.id);
      }

    });
  }

  loadCollectionById(id:string) {
    this.loading = true;
    this.colecService.loadCollectionById(id).subscribe({
      complete: () => {
        console.log('subscribe complere');
        console.log(this.collection.img1);

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
        console.log(this.collection);

      }
    });


  }

  verImagen(num: number) {
    const url: string  = `dashboard/${this.type}/view/image/${this.collection._id}/${num}`;
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
    this.router.navigateByUrl(`dashboard/collections/view/${this.collection._id}`);
  }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }


}

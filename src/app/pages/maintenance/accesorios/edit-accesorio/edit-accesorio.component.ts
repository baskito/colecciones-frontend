import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { CollectionService } from '../../../../services/collection.service';
import Swal from 'sweetalert2';
import { Collection } from '../../../../models/collection.model';
import { ToastrService } from 'ngx-toastr';
import { LoadCollections } from '../../../../interfaces/load.interface';
import { FileUploadService } from '../../../../services/file-upload.service';
import { Accesorio } from '../../../../models/accesorio.model';
import { AccesoriosService } from '../../../../services/accesorios.service';

@Component({
  selector: 'app-edit-accesorio',
  templateUrl: './edit-accesorio.component.html',
  styleUrls: ['./edit-accesorio.component.scss']
})
export class EditAccesorioComponent implements OnInit, OnDestroy {

  public idParamSubs!: Subscription;
  public accesorioEdit: Accesorio = {
    name: '',
    model: '',
    brand: ''
  };
  public formSubmitted = false;
  public tableTitle = '';
  public years: number[] = [];
  @ViewChild('fileInput') fileButton1: ElementRef | undefined;
  @ViewChild('fileInput') fileButton2: ElementRef | undefined;
  @ViewChild('fileInput') fileButton3: ElementRef | undefined;
  public uploadImage!: File;
  public uploadImage2!: File;
  public uploadImage3!: File;
  public imgTemp: any = null;
  public imgTemp2: any = null;
  public imgTemp3: any = null;
  public inputName: boolean = false;
  public saleDateFormat: string = '';
  public purchaseDateFormat: string = '';

  // public collectionForm: FormGroup = new FormGroup({
  //   name: new FormControl(this.collectionEdit.name, [Validators.required]),
  //   editorial: new FormControl(this.collectionEdit.editorial, [Validators.required]),
  //   year: new FormControl(this.collectionEdit.year, [Validators.required]),
  //   tipology: new FormControl(this.collectionEdit.tipology),

  // });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fileUploadService: FileUploadService, private toast: ToastrService, private accService: AccesoriosService) { }

  ngOnDestroy(): void {
    if (this.idParamSubs) {
      this.idParamSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.createYearsArray();
    if (this.router.url.includes('edit')) {
      this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
          this.loadAccesorioById(resp.params.id);
        });

      } else {
        this.tableTitle = 'Nueva colección';
      }

    }

    loadAccesorioById(id:string) {
      this.accService.loadAccesorioById(id).subscribe({
        complete: () => {
        this.tableTitle = this.accesorioEdit.name;
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
          this.accesorioEdit = accesorio;
          accesorio.saleDate ? this.saleDateFormat = accesorio.saleDate.toString().substring(0,10) : '';
          accesorio.purchaseDate ? this.purchaseDateFormat = accesorio.purchaseDate.toString().substring(0,10) : '';

        }
    });


  }

  createYearsArray() {
    const currentYear = new Date().getFullYear();
    for (let i=currentYear; i>=1950; i--) { this.years.push(i); }
  }

  onChanged($event: any) {
    this.accesorioEdit.sold = $event && $event.target && $event.target.checked;
    (<HTMLInputElement>document.getElementById('salePriceInput')!).value = '';
    (<HTMLInputElement>document.getElementById('datePriceInput')!).value = '';
    (<HTMLInputElement>document.getElementById('placePriceInput')!).value = '';
    this.saleDateFormat = '';
    this.accesorioEdit.salePlace = '';
    this.accesorioEdit.salePrice = 0;
  }

  async saveAccesorio() {
    this.formSubmitted = true;
    if(!this.accesorioEdit.name) {
      this.toast.error('El nombre es obligatorio');
      return;
    }
    if(!this.accesorioEdit.model) {
      this.toast.error('El mdoelo es obligatorio');
      return;
    }
    if(!this.accesorioEdit.brand) {
      this.toast.error('La marca es obligatoria');
      return;
    }

    if (this.saleDateFormat) {
      this.accesorioEdit.saleDate = new Date(this.saleDateFormat);
    } else {
      this.accesorioEdit.saleDate = new Date(0);
    }
    if (this.purchaseDateFormat) {
      this.accesorioEdit.purchaseDate = new Date(this.purchaseDateFormat);
    } else {
      this.accesorioEdit.purchaseDate = new Date(0);
    }
    console.log(this.accesorioEdit);

    // this.saleDateFormat ? this.accesorioEdit.saleDate = new Date(this.saleDateFormat): this.accesorioEdit.saleDate = undefined;
    // this.purchaseDateFormat ? this.accesorioEdit.purchaseDate = new Date(this.purchaseDateFormat): this.accesorioEdit.purchaseDate = undefined;
    if (this.router.url.includes('edit')) {
      await this.cargaImagenNum(this.accesorioEdit._id!);

      this.accService.updateAccesorio(this.accesorioEdit).subscribe({
        complete: () => { // completeHandler
          Swal.fire({
            title: 'Accesorio actualizado',
            text: 'El accesorio se ha modificado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/accesorios');
        },
        error: (err) => { // errorHandler
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: err.error.msg,
            icon: 'error'
          });
        },    // nextHandler
        next: (resp) => {
          console.log(resp);
        }
      });
    } else if (this.router.url.includes('new')) {
      console.log('estamos en new');
      this.accService.createAccesorio(this.accesorioEdit).subscribe({
        complete: () => { // completeHandler

          Swal.fire({
            title: 'Accesorio creado',
            text: 'El accesorio se ha creado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/accesorios');
        },
        error: (err) => { // errorHandler
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: err.error.msg,
            icon: 'error'
          });
        },    // nextHandler
        next: async (resp) => {
          await this.cargaImagenNum(resp.accesorio._id!);
          console.log(resp);
        }
      });
    }
  }

  cargaImagenNum(id:string) {
    return new Promise(resolve => {
      if (this.uploadImage) {
        this.uploadImageFunction('1',id);
      }
      if (this.uploadImage2) {
        this.uploadImageFunction('2',id);
      }
      if (this.uploadImage3) {
        this.uploadImageFunction('3',id);
      }
      setTimeout(() => {
        resolve('File uploaded');
      }, 1000);
    });
  }

  // Load images
  changeImage(file: File, num:number) {
    if (num === 1) {
      this.uploadImage = file;
    } else if (num === 2) {
      this.uploadImage2 = file;
    } else if (num === 3) {
      this.uploadImage3 = file;
    }


    if (!file) {
      switch (num) {
        case 1:
          this.fileButton1 ? this.fileButton1.nativeElement.value = '' : '';
          this.imgTemp = null;
          break;
        case 2:
          this.fileButton2 ? this.fileButton2.nativeElement.value = '' : '';
          this.imgTemp2 = null;
          break;
        case 3:
          this.fileButton3 ? this.fileButton3.nativeElement.value = '' : '';
          this.imgTemp3 = null;
          break;

      }
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = () => {
      switch (num) {
        case 1:
          this.imgTemp = reader.result;
          break;
        case 2:
          this.imgTemp2 = reader.result;
          break;
        case 3:
          this.imgTemp3 = reader.result;
          break;
      }
    }
  }

  uploadImageFunction(num: string, id: string) {
    switch (num) {
      case '1':
        this.fileUploadService.updateImage(this.uploadImage, 'accesorios', id, num )
        .then( img => {
            this.accesorioEdit.img1 = img;
          });
          break;
      case '2':
        this.fileUploadService.updateImage(this.uploadImage2, 'accesorios', id, num )
        .then( img => {
            this.accesorioEdit.img2 = img;
          });
          break;
      case '3':
        this.fileUploadService.updateImage(this.uploadImage3, 'accesorios', id, num )
        .then( img => {
          this.accesorioEdit.img3 = img;
        });
        break;
    }
  }

}

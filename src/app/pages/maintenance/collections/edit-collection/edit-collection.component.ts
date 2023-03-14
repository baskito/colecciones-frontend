import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { CollectionService } from '../../../../services/collection.service';
import Swal from 'sweetalert2';
import { Collection } from '../../../../models/collection.model';
import { ToastrService } from 'ngx-toastr';
import { LoadCollections } from '../../../../interfaces/load.interface';
import { FileUploadService } from '../../../../services/file-upload.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit, OnDestroy {

  public idParamSubs!: Subscription;
  public collectionEdit: Collection = {
    name: '',
    year: '',
    editorial: ''
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

  // public collectionForm: FormGroup = new FormGroup({
  //   name: new FormControl(this.collectionEdit.name, [Validators.required]),
  //   editorial: new FormControl(this.collectionEdit.editorial, [Validators.required]),
  //   year: new FormControl(this.collectionEdit.year, [Validators.required]),
  //   tipology: new FormControl(this.collectionEdit.tipology),

  // });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fileUploadService: FileUploadService, private toast: ToastrService, private colecService: CollectionService) { }

  ngOnDestroy(): void {
    if (this.idParamSubs) {
      this.idParamSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.createYearsArray();
    if (this.router.url.includes('edit')) {
      this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
          this.loadCollectionById(resp.params.id);
        });

      } else {
        this.tableTitle = 'Nueva colección';
      }

    }

    loadCollectionById(id:string) {
      this.colecService.loadCollectionById(id).subscribe({
        complete: () => {
        this.tableTitle = this.collectionEdit.name;
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
          this.collectionEdit = collection;
        }
    });


  }

  createYearsArray() {
    const currentYear = new Date().getFullYear();
    for (let i=currentYear; i>=1950; i--) { this.years.push(i); }
  }

  async saveCollection() {
    this.formSubmitted = true;
    if(!this.collectionEdit.name) {
      this.toast.error('El nombre es obligatorio');
      return;
    }
    if(!this.collectionEdit.editorial) {
      this.toast.error('La editorial es obligatoria');
      return;
    }
    if(!this.collectionEdit.year) {
      this.toast.error('El año es obligatorio');
      return;
    }
    if (this.router.url.includes('edit')) {
      await this.cargaImagenNum(this.collectionEdit._id!);

      this.colecService.updateCollection(this.collectionEdit).subscribe({
        complete: () => { // completeHandler
          Swal.fire({
            title: 'Colección actualizada',
            text: 'La colección se ha modificado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/collections');
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
      this.colecService.createCollection(this.collectionEdit).subscribe({
        complete: () => { // completeHandler

          Swal.fire({
            title: 'Colección creada',
            text: 'La colección se ha creado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/collections');
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
          await this.cargaImagenNum(resp.collection._id!);
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
        this.fileUploadService.updateImage(this.uploadImage, 'collections', id, num )
        .then( img => {
            this.collectionEdit.img1 = img;
          });
          break;
      case '2':
        this.fileUploadService.updateImage(this.uploadImage2, 'collections', id, num )
        .then( img => {
            this.collectionEdit.img2 = img;
          });
          break;
      case '3':
        this.fileUploadService.updateImage(this.uploadImage3, 'collections', id, num )
        .then( img => {
          this.collectionEdit.img3 = img;
        });
        break;
    }
  }

}

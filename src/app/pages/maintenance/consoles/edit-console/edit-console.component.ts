import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../../services/file-upload.service';
import { ConsoleService } from '../../../../services/console.service';
import { Console } from 'src/app/models/console.model';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-edit-console',
  templateUrl: './edit-console.component.html',
  styleUrls: ['./edit-console.component.scss']
})
export class EditConsoleComponent implements OnInit, OnDestroy {

  public idParamSubs!: Subscription;

  public consoleEdit: Console = {
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
  public consoles: Console[] = [];

  // public collectionForm: FormGroup = new FormGroup({
  //   name: new FormControl(this.collectionEdit.name, [Validators.required]),
  //   editorial: new FormControl(this.collectionEdit.editorial, [Validators.required]),
  //   year: new FormControl(this.collectionEdit.year, [Validators.required]),
  //   tipology: new FormControl(this.collectionEdit.tipology),

  // });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private toast: ToastrService,
    private gameService: GameService,
    private consoleService: ConsoleService
    ) { }

  ngOnDestroy(): void {
    if (this.idParamSubs) {
      this.idParamSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.createYearsArray();
    this.loadGamesByConsole();
    if (this.router.url.includes('edit')) {
      this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
          this.loadConsoleById(resp.params.id);
        });

      } else {
        this.tableTitle = 'Nueva consola';
      }

    }

    loadConsoleById(id:string) {
      this.consoleService.loadConsoleById(id).subscribe({
        complete: () => {
          this.tableTitle = this.consoleEdit.name;
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
          this.consoleEdit = console;
          console.saleDate ? this.saleDateFormat = console.saleDate.toString().substring(0,10) : '';
          console.purchaseDate ? this.purchaseDateFormat = console.purchaseDate.toString().substring(0,10) : '';
          this.loadGamesByConsole();
        }
      });


  }

  loadGamesByConsole() {
    this.consoleService.loadConsoles().subscribe({
      complete: () => {
        console.log(this.consoles);
      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({consoles}) => {
        this.consoles = consoles;

      }
    });
  }

  createYearsArray() {
    const currentYear = new Date().getFullYear();
    for (let i=currentYear; i>=1950; i--) { this.years.push(i); }
  }

  onChanged($event: any) {
    this.consoleEdit.sold = $event && $event.target && $event.target.checked;
    (<HTMLInputElement>document.getElementById('salePriceInput')!).value = '';
    (<HTMLInputElement>document.getElementById('datePriceInput')!).value = '';
    (<HTMLInputElement>document.getElementById('placePriceInput')!).value = '';
    this.saleDateFormat = '';
    this.consoleEdit.salePlace = '';
    this.consoleEdit.salePrice = 0;
  }

  async saveGame() {
    this.formSubmitted = true;
    if(!this.consoleEdit.name) {
      this.toast.error('El nombre es obligatorio');
      return;
    }
    if(!this.consoleEdit.genre) {
      this.toast.error('El género es obligatorio');
      return;
    }
    if(!this.consoleEdit.editorial) {
      this.toast.error('La editorial es obligatoria');
      return;
    }
    if(!this.consoleEdit.platform) {
      this.toast.error('La plataforma es obligatoria');
      return;
    }

    if (this.saleDateFormat) {
      this.consoleEdit.saleDate = new Date(this.saleDateFormat);
    } else {
      this.consoleEdit.saleDate = new Date(0);
    }
    if (this.purchaseDateFormat) {
      this.consoleEdit.purchaseDate = new Date(this.purchaseDateFormat);
    } else {
      this.consoleEdit.purchaseDate = new Date(0);
    }
    console.log(this.consoleEdit);

    // this.saleDateFormat ? this.consoleEdit.saleDate = new Date(this.saleDateFormat): this.consoleEdit.saleDate = undefined;
    // this.purchaseDateFormat ? this.consoleEdit.purchaseDate = new Date(this.purchaseDateFormat): this.consoleEdit.purchaseDate = undefined;
    if (this.router.url.includes('edit')) {
      await this.cargaImagenNum(this.consoleEdit._id!);

      this.gameService.updateGame(this.consoleEdit).subscribe({
        complete: () => { // completeHandler
          Swal.fire({
            title: 'Juego actualizado',
            text: 'El juego se ha modificado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/games');
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
      this.gameService.createGame(this.consoleEdit).subscribe({
        complete: () => { // completeHandler

          Swal.fire({
            title: 'Juego creado',
            text: 'El juego se ha creado correctamente',
            icon: 'success'
          });
          this.router.navigateByUrl('/dashboard/games');
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
          await this.cargaImagenNum(resp.game._id!);
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
        this.fileUploadService.updateImage(this.uploadImage, 'games', id, num )
        .then( img => {
            this.consoleEdit.img1 = img;
          });
          break;
      case '2':
        this.fileUploadService.updateImage(this.uploadImage2, 'games', id, num )
        .then( img => {
            this.consoleEdit.img2 = img;
          });
          break;
      case '3':
        this.fileUploadService.updateImage(this.uploadImage3, 'games', id, num )
        .then( img => {
          this.consoleEdit.img3 = img;
        });
        break;
    }
  }

}

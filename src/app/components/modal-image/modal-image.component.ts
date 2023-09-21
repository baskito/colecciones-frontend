import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { NewImageService } from '../../services/new-image.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent implements OnInit {

  @Input() img!: string;
  @Input() uid!: string;
  @Input() numImg!: string;
  @Input() type!: 'usuarios' | 'consoles' | 'accesorios' | 'collections' | 'games';
  public profileForm!: FormGroup;
  public uploadImage!: File;
  @ViewChild('fileInput') fileButton: ElementRef | undefined;
  public imgTemp: any;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  constructor(private newImageService: NewImageService, private toastr: ToastrService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {

  }

  changeImage(file: File) {
    this.uploadImage = file;
    console.log('🚀 ~ ModalImageComponent ~ changeImage ~ uploadImage:', this.uploadImage);

    if (!file) {
      this.fileButton ? this.fileButton.nativeElement.value = '' : '';
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      console.log('🚀 ~ ModalImageComponent ~ changeImage ~ this.imgTemp:', this.imgTemp);
    }
  }

  updateImage() {
    if (this.uploadImage) {
      if (!(this.numImg in ['1', '2', '3'])) {
        return;
      }
      this.fileUploadService.updateImage(this.uploadImage, this.type, this.uid, this.numImg )
        .then( img => {
          this.toastr.info('Imagen actualizada');
          this.closeBtn.nativeElement.click();
          this.fileButton ? this.fileButton.nativeElement.value = '' : '';
          this.cerrarModal();
          this.newImageService.newImage.emit(img);

        });
    }
  }

  cerrarModal() {
    this.imgTemp = null;
  }


}

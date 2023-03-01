import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent implements OnInit {

  @Input() img!: string;
  @Input() uid!: string;
  @Input() type!: 'usuarios' | 'consoles' | 'accesorios' | 'collections';
  public profileForm!: FormGroup;
  public uploadImage!: File;
  @ViewChild('fileInput') fileButton: ElementRef | undefined;
  public imgTemp: any;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  constructor(private userService: UserService, private toastr: ToastrService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {

  }

  changeImage(file: File) {
    this.uploadImage = file;

    if (!file) {
      this.fileButton ? this.fileButton.nativeElement.value = '' : '';
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  updateImage() {
    if (this.uploadImage) {
      this.fileUploadService.updateImage(this.uploadImage, this.type, this.uid )
        .then( img => {
          this.toastr.info('Imagen actualizada');
          this.closeBtn.nativeElement.click();
          this.fileButton ? this.fileButton.nativeElement.value = '' : '';
          this.cerrarModal();
          this.userService.newImage.emit(img);
        });
    }
  }

  cerrarModal() {
    this.imgTemp = null;
  }


}

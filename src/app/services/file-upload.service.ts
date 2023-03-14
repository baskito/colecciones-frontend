import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async updateImage(
    file: File,
    type: 'usuarios'|'consoles'|'accesorios'|'collections',
    id: string,
    numImg: string
  ) {

    try {

      const url = `${ base_url }/upload/${ type }/${ numImg }/${ id }`;

      console.log('🚀 ~ FileUploadService ~ url:', url);
      const formdata = new FormData();
      formdata.append('image', file);

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formdata
      });

      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        Swal.fire({
          title: 'Error',
          text: data.msg,
          icon: 'error'
        });
        return false;
      }


    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error',
        text: 'Error subiendo la imagen',
        icon: 'error'
      });
      return false;

    }

  }
}

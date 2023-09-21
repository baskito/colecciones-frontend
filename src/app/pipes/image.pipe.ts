import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, type: 'usuarios' | 'consoles' | 'accesorios' | 'collections' | 'games', num: number): string {
    if ( !img ) {
      return `${ base_url }/upload/usuarios/1/no-img.jpg`;
    }

    if ( img.includes('https') ) {
      return img;
    }

    return `${ base_url }/upload/${ type }/${ num }/${ img }`;
  }

}

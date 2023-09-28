import { Injectable, EventEmitter } from '@angular/core';
import { NewImage } from '../interfaces/load.interface';

@Injectable({
  providedIn: 'root'
})
export class NewImageService {

  constructor() { }

  public newImage: EventEmitter<NewImage> = new EventEmitter();
}

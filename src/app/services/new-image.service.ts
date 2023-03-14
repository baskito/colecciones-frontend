import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewImageService {

  constructor() { }

  public newImage: EventEmitter<string> = new EventEmitter();
}

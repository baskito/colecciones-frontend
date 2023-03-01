import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  public loading: boolean = false;
  public totalCollections: number = 0;
  public totalSearch: number = 0;
  public paginacion: number = 0;
  public paginas: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalCollections) {
      this.paginacion -= valor;
    }

    this.loadCollections(this.paginacion);
  }

  loadCollections(paginacion:number) {

  }

  borrarInput() {

  }

  search(term: string) {

  }

  counter(i: number) {
    return new Array(i);
  }

  pages(valor: number) {
    this.paginacion = valor;

    this.loadCollections(this.paginacion);
  }

}

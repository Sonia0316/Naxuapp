import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  public loading = false;
  public status: string;
  public productos = [];
  public categorias = [];
  public categoriaSelected = 0;
  public searchValue = '';

  constructor(private readonly httpClient: HttpClient) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      this.categorias = ((await this.httpClient
        .get(`${environment.mainUrl}/productos/categorias`)
        .toPromise()) as any).response.lista;
      this.productos = ((await this.httpClient
        .get(`${environment.mainUrl}/productos`)
        .toPromise()) as any).response.lista;
      if (this.productos.length) {
        this.status = 'complete';
      } else {
        this.status = 'empty';
      }
    } catch (error) {
      console.log(error);
      this.status = 'error';
    } finally {
      this.loading = false;
    }
  }
  public checkValueSearch(productTitle: string) {
    const searchValue = this.searchValue.trim().toUpperCase();
    return (
      searchValue === '' || productTitle.toUpperCase().includes(searchValue)
    );
  }
  public toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}

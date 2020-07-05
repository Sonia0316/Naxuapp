import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
})
export class BeneficiosComponent implements OnInit {
  htmlStr: string;
  htmlStrModals: string;
  htmlSafeHtml: SafeHtml;
  htmlSafeHtmlModal: SafeHtml;
  public loading = false;
  public status: string;

  constructor(
    private httpClient: HttpClient,
    protected sanitizer: DomSanitizer
  ) {}
  public transform(
    value: string,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
  public async ngOnInit(): Promise<void> {
    this.htmlStr = '';
    this.htmlStrModals = '';
    this.loading = true;
    try {
      const items: [] = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/beneficios'
        )
        .toPromise()) as any).response.lista;
      if (items.length) {
        let flag_row = 0;
        let flag_col = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i]['t02_estatus'] == 'Activo') {
            console.log(items[i]);
            //console.log(items[i]);
            let componente = '';
            let modal = '';
            if (flag_row == 0) {
              if (flag_col == 0) {
                componente = '<div class="row">';
              }
              if (flag_col < 2) {
                componente =
                  componente +
                  '<div class="col-md-4 OtroSeg">' +
                  '<img alt="Burger King descuentos" src="' +
                  items[i]['t02_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t02_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegCod">Código: <span>ABC123</span></p>' +
                  '<p class="OtroSegDate">Valido hasta el 12 de Julio de 2020</p>' +
                  '<a id="modal-otroseg02" ' +
                  'data-toggle="modal" role="button" class="btn btn-primary Benef" href="#modal-container-otroseg0' +
                  i +
                  '" >' +
                  'MÁS DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-otroseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  items[i]['t02_titulo'] +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">×</span>' +
                  '</button></div><div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t02_imagenurls3'] +
                  '" alt="Burger king">' +
                  '</div><div class="OtroSegInfo">' +
                  '<p class="OtroSegCod">Código: <span>QWERTY123</span></p>' +
                  '<p class="OtroSegDesc"> ' +
                  items[i]['t02_descripcion'] +
                  '</p><p class="OtroSegDate">Valido hasta el 23 de Agosto de 2020</p> ' +
                  '</div></div><div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>  ' +
                  '</div></div></div></div>';

                flag_col++;
              } else {
                componente =
                  componente +
                  '<div class="col-12 col-md-4">' +
                  '<div class="ObtBene"><h2>COMO OBTENER MIS BENEFICIOS</h2>' +
                  '<hr><ul><li><div class="ObtBenePasoImg"><img src="assets/img/logos_cuerpo/logo_beneficios01.svg" alt="Paso1">' +
                  '</div><div class="ObtBenePasoText"><p class="ObtBenePasoTextStep">Paso 1 <br> <span> Let\'s meet at starbucks today, are you free?</span></p>' +
                  '</div></li><li><div class="ObtBenePasoImg">' +
                  '<img src="assets/img/logos_cuerpo/logo_beneficios02.svg" alt="Paso2">' +
                  '</div><div class="ObtBenePasoText">' +
                  '<p class="ObtBenePasoTextStep">Product Issue <br> <span> A new issue has been reported, would you be able to help me?</span></p>' +
                  '</div></li><li>' +
                  '<div class="ObtBenePasoImg">' +
                  '<img src="assets/img/logos_cuerpo/logo_beneficios03.svg" alt="Paso3">' +
                  '</div><div class="ObtBenePasoText">' +
                  '<p class="ObtBenePasoTextStep">New Rating <br> <span> Hurray! You\'ve got a new rating.</span></p>' +
                  '</div></li></ul></div></div>';
                flag_col = 0;
                flag_row++;
                i--;
              }
              if (flag_col == 0) {
                componente = componente + '</div>';
              }
            } else {
              if (flag_col == 0) {
                componente = componente + '<div class="row">';
              }
              if (flag_col < 3) {
                componente =
                  componente +
                  '<div class="col-md-4 OtroSeg">' +
                  '<img alt="Burger King descuentos" src="' +
                  items[i]['t02_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t02_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegCod">Código: <span>ABC123</span></p>' +
                  '<p class="OtroSegDate">Valido hasta el 12 de Julio de 2020</p>' +
                  '<a id="modal-otroseg02"' +
                  'data-toggle="modal" role="button" class="btn btn-primary Benef" ' +
                  ' href="#modal-container-otroseg0' +
                  i +
                  '">' +
                  'MÁS DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-otroseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  items[i]['t02_titulo'] +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">×</span>' +
                  '</button></div><div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t02_imagenurls3'] +
                  '" alt="Burger king">' +
                  '</div><div class="OtroSegInfo">' +
                  '<p class="OtroSegCod">Código: <span>QWERTY123</span></p>' +
                  '<p class="OtroSegDesc"> ' +
                  items[i]['t02_descripcion'] +
                  '</p><p class="OtroSegDate">Valido hasta el 23 de Agosto de 2020</p> ' +
                  '</div></div><div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>  ' +
                  '</div></div></div></div>';
                flag_col++;
                console.log(flag_col);
              }
              if (flag_col == 3) {
                componente = componente + '</div>';
                flag_col = 0;
              }
            }
            this.htmlStrModals = this.htmlStrModals + modal;
            this.htmlStr = this.htmlStr + componente;
          }

          //Hasta aqui llegar el For
        }
        this.htmlSafeHtmlModal = this.transform(this.htmlStrModals, 'html');
        this.htmlSafeHtml = this.transform(this.htmlStr, 'html');
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
}

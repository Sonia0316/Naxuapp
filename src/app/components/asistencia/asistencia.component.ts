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
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss'],
})
export class AsistenciaComponent implements OnInit {
  public htmlStr: string;
  public htmlStrModals: string;
  public htmlSafeHtml: SafeHtml;
  public htmlSafeHtmlModal: SafeHtml;
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
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/asistencia'
        )
        .toPromise()) as any).response.lista;
      if (items.length) {
        let flagRow = 0;
        let flagCol = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i]['t03_estatus'] == 'Activo') {
            let componente = '';
            let modal = '';
            if (flagRow === 0) {
              if (flagCol === 0) {
                componente = '<div class="row">';
                componente =
                  componente +
                  '<div class="col-12 col-md-4 descriptiononly">' +
                  '<div class="ObtBene"><h2>COMO USAR MIS ASITENCIAS</h2>' +
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
              }
              if (flagCol < 2) {
                componente =
                  componente +
                  '<div class="col-md-4 OtroSeg">' +
                  '<img alt="Imagen" src="' +
                  items[i]['t03_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t03_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t03_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegDate">Vigencia: ' +
                  items[i]['t03_vigencia'] +
                  '</p>' +
                  '<a id="modal-otroseg02" href="#modal-container-asistseg0' +
                  i +
                  '" ' +
                  'data-toggle="modal" role="button" class="btn btn-primary Benef">' +
                  'MÁS DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-asistseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  'ATENCIÓN TELEFÓNICA: 01800 123 23 23' +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">×</span>' +
                  '</button>' +
                  '</div>' +
                  '<div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t03_imagenurls3'] +
                  '" alt="Asistencia Telefónica">' +
                  '</div>' +
                  '<div class="OtroSegInfo">' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t03_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegDate">Vigencia: ' +
                  items[i]['t03_vigencia'] +
                  '</p>' +
                  '</div>' +
                  '</div>' +
                  '<div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>';
                flagCol++;
              } else {
                i--;
                flagCol = 0;
                flagRow++;
              }
              if (flagCol === 0) {
                componente = componente + '<div>';
              }
            } else {
              if (flagCol === 0) {
                componente = componente + '<div class="row">';
              }
              if (flagCol < 3) {
                componente =
                  componente +
                  '<div class="col-md-4 OtroSeg">' +
                  '<img alt="Imagen" src="' +
                  items[i]['t03_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t03_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t03_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegDate">Vigencia: ' +
                  items[i]['t03_vigencia'] +
                  '</p>' +
                  '<a id="modal-otroseg02" href="#modal-container-asistseg0' +
                  i +
                  '" ' +
                  'data-toggle="modal" role="button" class="btn btn-primary Benef">' +
                  'MÁS DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-asistseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  'ATENCIÓN TELEFÓNICA: 01800 123 23 23' +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">×</span>' +
                  '</button>' +
                  '</div>' +
                  '<div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t03_imagenurls3'] +
                  '" alt="Asistencia Telefónica">' +
                  '</div>' +
                  '<div class="OtroSegInfo">' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t03_descripcion'] +
                  '</p>' +
                  '<p class="OtroSegDate">Vigencia: ' +
                  items[i]['t03_vigencia'] +
                  '</p>' +
                  '</div>' +
                  '</div>' +
                  '<div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>';

                flagCol++;
              }
              if (flagCol === 3) {
                componente = componente + '</div>';
                flagCol = 0;
              }
            }
            this.htmlStrModals = this.htmlStrModals + modal;
            this.htmlStr = this.htmlStr + componente;
          }
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

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
  selector: 'app-adquirir-seguro',
  templateUrl: './adquirir-seguro.component.html',
})
export class AdquirirSeguroComponent implements OnInit {
  htmlStrModals: string;
  htmlStrOtros: string;
  htmlSafeHtml: SafeHtml;
  htmlSafeHtmlModal: SafeHtml;
  htmlSafeHtmlOtros: SafeHtml;
  mainItem;
  public status = 'Loading';

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

  public async senmailBackOffice(seguro: string) {
    console.log('Lllamada a la funcion');
    const result = await this.httpClient
      .post(
        'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice',
        {
          asunto: 'Adquisición de seguros',
          mensaje: 'El usuario: desea comprar el seguro ' + seguro,
          grupo: 'SEGUROS',
        }
      )
      .toPromise();
    console.log('====================================');
    console.log(result);
    console.log('====================================');
  }
  async ngOnInit(): Promise<void> {
    this.htmlStrModals = '';
    this.htmlStrOtros = '';
    try {
      const items: [] = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/seguros'
        )
        .toPromise()) as any).response.lista;
      this.mainItem = items.find(
        (element: any) =>
          element.t06_prioridad == '1' && element.t06_estatus === 'Activo'
      );

      let flag_col = 0;

      for (let i = 0; i < items.length; i++) {
        if (items[i]['t06_estatus'] == 'Activo') {
          let componente = '';
          let modal = '';
          if (items[i]['t06_prioridad'] == 2) {
            if (flag_col == 0) {
              componente = '<div class="row">';
            }
            componente =
              componente +
              '<div class="col-md-4 OtroSeg">' +
              '<img alt="Seguro de gastos médicos" src="' +
              items[i]['t06_imagenurls3'] +
              '" />' +
              '<div class="OtroSegInfo">' +
              '<h3 class="OtroSegTitle">' +
              items[i]['t06_titulo'] +
              '</h3>' +
              '<p class="OtroSegDesc">' +
              items[i]['t06_descripcion'] +
              '</p>' +
              '<p class="OtroSegDate">' +
              items[i]['t06_vigencia'] +
              '</p>' +
              '<a id="modal-otroseg01" href="#modal-container-otroseg0' +
              i +
              '" data-toggle="modal" role="button"  class="btn btn-primary">Conoce más</a>' +
              '</div>' +
              '</div>';

            modal =
              ' <div class="modal fade" id="modal-container-otroseg0' +
              i +
              '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
              '<div class="modal-dialog" role="document">' +
              '<div class="modal-content AdqOtroSegModal01">' +
              '<div class="modal-header">' +
              '<h5 class="modal-title" id="myModalLabel">' +
              items[i]['t06_titulo'] +
              '</h5> ' +
              '<button type="button" class="close" data-dismiss="modal">' +
              '<span aria-hidden="true">×</span>' +
              '</button>' +
              '</div>' +
              '<div class="modal-body">' +
              '<div class="imagen">' +
              '<img src="' +
              items[i]['t06_imagenurls3'] +
              '" alt="seguro médico">' +
              '</div>' +
              '<div class="OtroSegInfo">' +
              '<h3 class="OtroSegTitle">' +
              items[i]['t06_titulo'] +
              '</h3>' +
              '<p class="OtroSegDesc">' +
              items[i]['t06_descripcion'] +
              '</p>' +
              '<p class="OtroSegDate">' +
              items[i]['t06_vigencia'] +
              '</p>   ' +
              '</div>' +
              '</div>' +
              '<div class="modal-footer">     ' +
              '<a href="#" data-dismiss="modal">OK</a>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>';

            flag_col++;
            if (flag_col == 3) componente = componente + '</div>';
          }
          this.htmlStrModals = this.htmlStrModals + modal;
          this.htmlStrOtros = this.htmlStrOtros + componente;
        }
      }

      this.htmlSafeHtmlModal = this.transform(this.htmlStrModals, 'html');
      this.htmlSafeHtmlOtros = this.transform(this.htmlStrOtros, 'html');
    } catch (error) {}
  }
}

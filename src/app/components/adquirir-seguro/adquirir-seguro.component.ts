import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-adquirir-seguro',
  templateUrl: './adquirir-seguro.component.html',
  styleUrls: ['./adquirir-seguro.component.scss'],
})
export class AdquirirSeguroComponent implements OnInit {
  htmlStrModals: string;
  htmlStrOtros: string;
  htmlSafeHtml: SafeHtml;
  htmlSafeHtmlModal: SafeHtml;
  htmlSafeHtmlOtros: SafeHtml;
  public dataNaxu: DataModel;
  mainItem;
  public loading = false;
  public status: string;
  constructor(
    private readonly httpClient: HttpClient,
    private elRef: ElementRef,
    protected sanitizer: DomSanitizer,
    private readonly dataProvider: DataProvider
  ) {}

  public async ngOnInit(): Promise<void> {
    this.htmlStrModals = '';
    this.htmlStrOtros = '';
    this.loading = true;
    this.dataNaxu = this.dataProvider.getDataNaxu();
    try {
      const items: [] = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/seguros'
        )
        .toPromise()) as any).response.lista;
      if (items.length) {
        this.mainItem = items.find(
          (element: any) =>
            element.t06_prioridad == '1' && element.t06_estatus === 'Activo'
        );

        let flagCol = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i]['t06_estatus'] === 'Activo') {
            let componente = '';
            let modal = '';
            if (items[i]['t06_prioridad'] == 2) {
              if (flagCol === 0) {
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
                'Vigencia: ' +
                items[i]['t06_vigencia'] +
                '</p>' +
                '<p class="OtroSegDate">' +
                'Precio:' +
                items[i]['t06_precio'] +
                '</p>   ' +
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
                'Vigencia:' +
                items[i]['t06_vigencia'] +
                '</p>   ' +
                '<p class="OtroSegDate">' +
                'Precio:' +
                items[i]['t06_precio'] +
                '</p>   ' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<a href="#" id="contratar' +
                i +
                '" data-dismiss="modal">Contratar</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
              setTimeout(() => {
                this.elRef.nativeElement
                  .querySelector('#contratar' + i)
                  .addEventListener(
                    'click',
                    this.senmailBackOffice.bind(this, items[i]['t06_titulo'])
                  );
              }, 1000);
              flagCol++;
              if (flagCol === 3) {
                componente = componente + '</div>';
              }
            }
            this.htmlStrModals = this.htmlStrModals + modal;
            this.htmlStrOtros = this.htmlStrOtros + componente;
          }
        }
        this.htmlSafeHtmlModal = this.transform(this.htmlStrModals, 'html');
        this.htmlSafeHtmlOtros = this.transform(this.htmlStrOtros, 'html');
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
    this.loading = true;
    try {
      await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice',
          {
            asunto: 'Adquisición de seguros',
            mensaje: `El usuario ${this.dataNaxu.RFCEmpleado} desea comprar el seguro ${seguro}`,
            grupo: 'SEGUROS',
          }
        )
        .toPromise();
      document.getElementById('showModalExitoSolicitud').click();
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
}

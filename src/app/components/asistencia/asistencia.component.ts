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
import { environment } from '@envs/environment';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';

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
  public instructions = [];
  public dataNaxu: DataModel;

  constructor(
    private httpClient: HttpClient,
    protected sanitizer: DomSanitizer,
    private readonly dataProvider: DataProvider
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

    this.dataNaxu = this.dataProvider.getDataNaxu();

    try {
      const items: [] = ((await this.httpClient
        .get(
          `${environment.mainUrl}/asistencia/empresa/${this.dataNaxu.empresa}`
        )
        .toPromise()) as any).response.lista;
      const instructions = ((await this.httpClient
        .get(
          `${environment.mainUrl}/pasos/byseccion/Asistencia/${this.dataNaxu.empresa}`
        )
        .toPromise()) as any).body;
      if (Array.isArray(instructions) && instructions.length) {
        this.instructions = instructions;
      }
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
                componente +=
                  '<div class="col-12 col-md-4 descriptiononly">' +
                  '<div class="ObtBene"><h2>COMO USAR MIS ASISTENCIAS</h2>' +
                  '<hr><ul>';
                this.instructions.forEach((item, index) => {
                  const tmp = document.createElement('DIV');
                  tmp.innerHTML = item.c10_descripcion;
                  const description = tmp.textContent || tmp.innerText || '';
                  componente += `
                  <li>
                     <div class="ObtBenePasoImg">
                      <img src="${item.c10_imagen}" alt="Paso${index + 1}" />
                     </div>
                     <div class="ObtBenePasoText">
                      <p class="ObtBenePasoTextStep">
                        ${item.c10_titulo}<br />
                        <span>${description}</span>
                      </p>
                     </div>
                  <li>
                  `;
                });
                componente += '</ul></div></div>';
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
                  'M??S DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-asistseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  'ATENCI??N TELEF??NICA: 01800 123 23 23' +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">??</span>' +
                  '</button>' +
                  '</div>' +
                  '<div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t03_imagenurls3'] +
                  '" alt="Asistencia Telef??nica">' +
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
                  'M??S DETALLE</a></div></div>';

                modal =
                  '<div class="modal fade" id="modal-container-asistseg0' +
                  i +
                  '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                  '<div class="modal-dialog" role="document">' +
                  '<div class="modal-content AdqOtroSegModal01">' +
                  '<div class="modal-header rojo">' +
                  '<h5 class="modal-title" id="myModalLabel">' +
                  'ATENCI??N TELEF??NICA: 01800 123 23 23' +
                  '</h5>' +
                  '<button type="button" class="close" data-dismiss="modal">' +
                  '<span aria-hidden="true">??</span>' +
                  '</button>' +
                  '</div>' +
                  '<div class="modal-body">' +
                  '<div class="imagen">' +
                  '<img src="' +
                  items[i]['t03_imagenurls3'] +
                  '" alt="Asistencia Telef??nica">' +
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

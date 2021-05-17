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
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss'],
})
export class BeneficiosComponent implements OnInit {
  htmlStr: string;
  htmlStrModals: string;
  htmlSafeHtml: SafeHtml;
  htmlSafeHtmlModal: SafeHtml;
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
      const instructions = ((await this.httpClient
        .get(
          `${environment.mainUrl}/pasos/byseccion/Beneficios/${this.dataNaxu.empresa}`
        )
        .toPromise()) as any).body;
      if (Array.isArray(instructions) && instructions.length) {
        this.instructions = instructions;
      }
      const items: [] = ((await this.httpClient
        .get(
          `${environment.mainUrl}/beneficios/empresa/${this.dataNaxu.empresa}`
        )
        .toPromise()) as any).response.lista;
      if (items.length) {
        let flagRow = 0;
        let flagCol = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i]['t02_estatus'] == 'Activo') {
            let componente = '';
            let modal = '';
            if (flagRow === 0) {
              if (flagCol === 0) {
                componente = '<div class="row">';
                componente =
                  componente +
                  '<div class="col-12 col-md-4 descriptiononly">' +
                  '<div class="ObtBene"><h2>COMO OBTENER MIS BENEFICIOS</h2>' +
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
                  '<img alt="imagen" src="' +
                  items[i]['t02_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t02_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p style="color: #43425d;font-size: 0.9em;text-align: center;font-weight: 400;">Vigencia: ' +
                  items[i]['t02_vigencia'] +
                  '</p>' +
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
                  '" alt="imagen">' +
                  '</div><div class="OtroSegInfo">' +
                  '<p class="OtroSegDesc"> ' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p style="color: #43425d;font-size: 0.9em;text-align: center;font-weight: 400;">Vigencia: ' +
                  items[i]['t02_vigencia'] +
                  '</p>' +
                  '</div></div><div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>  ' +
                  '</div></div></div></div>';

                flagCol++;
              } else {
                flagCol = 0;
                flagRow++;
                i--;
              }
              if (flagCol === 0) {
                componente = componente + '</div>';
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
                  items[i]['t02_imagenurls3'] +
                  '" />' +
                  '<div class="OtroSegInfo">' +
                  '<h3 class="OtroSegTitle">' +
                  items[i]['t02_titulo'] +
                  '</h3>' +
                  '<p class="OtroSegDesc">' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p style="color: #43425d;font-size: 0.9em;text-align: center;font-weight: 400;">Vigencia: ' +
                  items[i]['t02_vigencia'] +
                  '</p>' +
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
                  '" alt="Imagen">' +
                  '</div><div class="OtroSegInfo">' +
                  '<p class="OtroSegDesc"> ' +
                  items[i]['t02_descripcion'] +
                  '</p>' +
                  '<p style="color: #43425d;font-size: 0.9em;text-align: center;font-weight: 400;">Vigencia: ' +
                  items[i]['t02_vigencia'] +
                  '</p>' +
                  '</div></div><div class="modal-footer">' +
                  '<a href="#" data-dismiss="modal">OK</a>  ' +
                  '</div></div></div></div>';
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

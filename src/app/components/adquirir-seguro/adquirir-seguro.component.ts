import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-adquirir-seguro',
  templateUrl: './adquirir-seguro.component.html'
  })
export class AdquirirSeguroComponent implements OnInit {
  htmlStr : string;
  htmlStrModals : string;
  htmlStrOtros : string;
  htmlSafeHtml : SafeHtml;
  htmlSafeHtmlModal : SafeHtml;
  htmlSafeHtmlOtros : SafeHtml;

  constructor(private httpClient: HttpClient,protected sanitizer: DomSanitizer) { }
  public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
   switch (type) {
     case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
     case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
     case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
     case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
     case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
     default: throw new Error(`Invalid safe type specified: ${type}`);
   }
 }

 public senmailBackOffice(seguro : string) {
   console.log("Lllamada a la funcion");
    let url = "https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice";
    let data =  { "asunto" : "Adquisición de seguros", "mensaje" : "El usuario: desea comprar el seguro "+seguro , "grupo":"SEGUROS" };
    let result =  this.httpClient.post(url,data );
    if(result['codigo']=="200"){
      console.log("Se mando el correo");
    }
 }
  ngOnInit(): void {

    this.htmlStr="";
    this.htmlStrModals="";
    this.htmlStrOtros="";

    this.httpClient.get('https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/seguros')
    .subscribe(response => {
      let items = response['response']['lista'];
      let flag_row=0;
      let flag_col=0;

      for (let i =0;i < items.length; i++){
        if(items[i]['t06_estatus']=="Activo"){
          let componente="";
          let modal="";
          let principal="";
            if(items[i]['t06_prioridad']==2){

                if(flag_col==0){
                  componente="<div class=\"row\">";
                }

              console.log(items[i]);
               componente=componente+"<div class=\"col-md-4 OtroSeg\">"+
                  "<img alt=\"Seguro de gastos médicos\" src=\""+items[i]['t06_imagenurls3']+"\" />"+
                      "<div class=\"OtroSegInfo\">"+
                          "<h3 class=\"OtroSegTitle\">"+items[i]['t06_titulo']+
                          "</h3>"+
                          "<p class=\"OtroSegDesc\">"+items[i]['t06_descripcion']+
                          "</p>"+

                          "<p class=\"OtroSegDate\">"+items[i]['t06_vigencia']+"</p>"+
                          "<a id=\"modal-otroseg01\" href=\"#modal-container-otroseg0"+i+"\" data-toggle=\"modal\" role=\"button\"  class=\"btn btn-primary\">Conoce más</a>"+
                      "</div>"+
              "</div>";


              modal=" <div class=\"modal fade\" id=\"modal-container-otroseg0"+i+"\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">"+
            "<div class=\"modal-dialog\" role=\"document\">"+
                "<div class=\"modal-content AdqOtroSegModal01\">"+
                    "<div class=\"modal-header\">"+
                        "<h5 class=\"modal-title\" id=\"myModalLabel\">"+items[i]['t06_titulo']+
                        "</h5> "+
                        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">"+
                            "<span aria-hidden=\"true\">×</span>"+
                        "</button>"+
                    "</div>"+
                    "<div class=\"modal-body\">"+
                       "<div class=\"imagen\">"+
                           "<img src=\""+items[i]['t06_imagenurls3']+"\" alt=\"seguro médico\">"+
                       "</div>"+
                       "<div class=\"OtroSegInfo\">"+
                        "<h3 class=\"OtroSegTitle\">"+items[i]['t06_titulo']+
                        "</h3>"+
                        "<p class=\"OtroSegDesc\">"+items[i]['t06_descripcion']+"</p>"+

                        "<p class=\"OtroSegDate\">"+items[i]['t06_vigencia']+"</p>   "+
                    "</div>"+
                      "</div>"+
                    "<div class=\"modal-footer\">     "+
                        "<a href=\"#\" data-dismiss=\"modal\">OK</a>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>";

        flag_col++;
        if(flag_col==3)
        componente=componente+"</div>";
            }
            if(items[i]['t06_prioridad']==1){
                principal="<div class=\"row\"><div class=\"col-12 col-md-8\">"+
                            "<div class=\"row no-gutters\">"+
                                "<div class=\"col-12 col-md-6 col-xl-4\">"+
                                    "<img alt=\"Imagen seguros\" src=\""+items[i]['t06_imagenurls3']+"\"/>"+
                                "</div>"+
                                "<div class=\"col-12  col-md-6 col-xl-8\">"+
                                    "<div class=\"AdqSegInfo\">"+
                                        "<p>Promoción especial</p>"+
                                        "<h3>"+items[i]['t06_titulo']+"</h3>"+
                                        "<p class=\"AdqSegInfoDesc\">"+items[i]['t06_descripcion']+
                                        "</p>"+
                                        "<p class=\"AdqSegInfoVig\">"+items[i]['t06_vigencia']+"</p>"+
                                        "<br>"+
                                        "<a id=\"modal-destacado\" (click)=\"senmailBackOffice('"+items[i]['t06_titulo']+"')\" data-toggle=\"modal\" role=\"button\" class=\"btn btn-primary\">CONTRATAR</a>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>"

                        principal=principal+
                        "<div class=\"col-12 col-md-4\">"+
                            "<div class=\"ObtBene\">"+
                                "<h2>COMO OBTENER MIS BENEFICIOS</h2>"+
                                "<hr>"+
                                "<ul>"+
                                    "<li>"+
                                        "<div class=\"ObtBenePasoImg\">"+
                                            "<img src=\"assets/img/logos_cuerpo/logo_beneficios01.svg\" alt=\"Paso1\">"+
                                        "</div>"+
                                        "<div class=\"ObtBenePasoText\">"+
                                            "<p class=\"ObtBenePasoTextStep\">Paso 1 <br> <span> Let's meet at starbucks today, are you free?</span></p>"+
                                        "</div>"+
                                    "</li>"+
                                    "<li>"+
                                        "<div class=\"ObtBenePasoImg\">"+
                                            "<img src=\"assets/img/logos_cuerpo/logo_beneficios02.svg\" alt=\"Paso2\">"+
                                        "</div>"+
                                        "<div class=\"ObtBenePasoText\">"+
                                            "<p class=\"ObtBenePasoTextStep\">Product Issue <br> <span> A new issue has been reported, would you be able to help me?</span></p>"+
                                        "</div>"+
                                    "</li>"+
                                    "<li>"+
                                        "<div class=\"ObtBenePasoImg\">"+
                                            "<img src=\"assets/img/logos_cuerpo/logo_beneficios03.svg\" alt=\"Paso3\">"+
                                        "</div>"+
                                        "<div class=\"ObtBenePasoText\">"+
                                            "<p class=\"ObtBenePasoTextStep\">New Rating <br> <span> Hurray! You've got a new rating.</span></p>"+
                                        "</div>"+
                                    "</li>"+
                                "</ul>"+
                            "</div>"+
                        "</div> </div>";


            }
          this.htmlStr=this.htmlStr+principal;
          this.htmlStrModals=this.htmlStrModals+modal;
         this.htmlStrOtros  =this.htmlStrOtros  +componente;
       }

              //Hasta aqui llegar el For



      }


      this.htmlSafeHtmlModal = this.transform(this.htmlStrModals,'html');
      this.htmlSafeHtmlOtros=this.transform(this.htmlStrOtros,'html');
      this.htmlSafeHtml = this.transform(this.htmlStr,'html');
      console.log(this.htmlStrOtros);

});


  }

}

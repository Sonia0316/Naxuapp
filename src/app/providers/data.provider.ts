import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataModel } from '../models/data.interface';
import asyncLocalStorage from '../util/async-local-storage';
import { environment } from '@envs/environment';

@Injectable()
export class DataProvider {
  private dataNaxu: DataModel;
  public logos;

  constructor(
    public readonly http: HttpClient,
  ) {
  }

  public getDataNaxu(): DataModel {
    return this.dataNaxu;
  }
  public async clearDataNaxu() {
    await asyncLocalStorage.clearItem('naxu');
    this.dataNaxu = null;
    this.logos = undefined;
  }
  public async setDataNaxu(dataNaxu: DataModel) {
    await asyncLocalStorage.setItem('naxu', JSON.stringify(dataNaxu));
    this.dataNaxu = dataNaxu;
  }

  public async load() {
    this.dataNaxu = JSON.parse(await asyncLocalStorage.getItem('naxu'));
    if (this.dataNaxu && this.dataNaxu.empresa && !this.logos) {
      let logos;
      try {
        logos = ((await this.http
          .get(`${environment.mainUrl}/logos/empresa/${this.dataNaxu.empresa}`)
          .toPromise()) as any).body.find(
            (element) => element.c09_status === 'Activo'
          );
      } finally {
        this.logos = logos;
      }
    }
  }
}

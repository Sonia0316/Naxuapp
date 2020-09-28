import { Injectable } from '@angular/core';
import { DataModel } from '../models/data.interface';
import asyncLocalStorage from '../util/async-local-storage';

@Injectable()
export class DataProvider {
  private dataNaxu: DataModel;
  public getDataNaxu(): DataModel {
    return this.dataNaxu;
  }

  public async clearDataNaxu() {
    await asyncLocalStorage.clearItem('naxu');
    this.dataNaxu = null;
  }

  public async setDataNaxu(dataNaxu: DataModel) {
    await asyncLocalStorage.setItem('naxu', JSON.stringify(dataNaxu));
    this.dataNaxu = dataNaxu;
  }

  public async load() {
    this.dataNaxu = JSON.parse(await asyncLocalStorage.getItem('naxu'));
  }
}

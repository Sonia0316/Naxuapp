import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataModel } from '../models/data.interface';
import asyncLocalStorage from '../util/async-local-storage';

@Injectable()
export class DataProvider {
  private dataNaxu: DataModel;
  constructor(private readonly http: HttpClient) {}

  public getDataNaxu(): DataModel {
    return this.dataNaxu;
  }

  public async setDataNaxu(dataNaxu: DataModel) {
    await asyncLocalStorage.setItem('naxu', JSON.stringify(dataNaxu));
    this.dataNaxu = dataNaxu;
  }

  public async load() {
    this.dataNaxu = JSON.parse(await asyncLocalStorage.getItem('naxu'));
  }
}

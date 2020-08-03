import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DataProvider } from '../providers/data.provider';
@Injectable({
  providedIn: 'root',
})
export class CheckUnauthenticationGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly dataProvider: DataProvider
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUnauthentication();
  }
  private async checkUnauthentication(): Promise<boolean> {
    const dataNaxu = this.dataProvider.getDataNaxu();
    if (dataNaxu) {
      return this.router.navigate(['/home']);
    }
    return true;
  }
}

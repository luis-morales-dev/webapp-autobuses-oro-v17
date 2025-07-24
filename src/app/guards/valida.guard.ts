import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalService } from '../services/local.service';

@Injectable({
  providedIn: 'root'
})

export class ValidaGuard  {
  pasajeros: any;
  constructor(private router:Router,private local: LocalService){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkboletos();
  }

  private async checkboletos():Promise<boolean>{
    this.local.liberar();
   return true;
  }
}

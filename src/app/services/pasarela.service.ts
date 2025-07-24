import { Injectable } from '@angular/core';
declare var PaymentCheckout: any;



@Injectable({
  providedIn: 'root'
})
export class PasarelaService {
  hsbcLoaded = false;

  init(renderer: any, document: any): Promise<any> {

    return new Promise((resolve) => {

      if (this.hsbcLoaded) {
        console.log('pasarela ya estaba cargada');
        resolve(true);
        return;
      }

      const script = renderer.createElement('script');
      script.id = 'payHsbc';
      script.charset = 'UTF-8';
      script.src = 'https://cdn.gpvicomm.com/ccapi/sdk/payment_checkout_stable.min.js';
      renderer.appendChild(document.body, script);
      script.onload = () => {
        if (PaymentCheckout) {
          console.log('pasarela cargada corrcetamente');
          this.hsbcLoaded = true;
          resolve(true);

        } else {
          console.log('fallo la carga de la pasarela');
          resolve(false);

        }
      };
    });
  }


}

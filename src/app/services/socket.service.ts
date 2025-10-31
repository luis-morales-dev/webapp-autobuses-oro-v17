import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //@ts-ignore
  private socket: WebSocket;
  //@ts-ignore
  private subject: Subject<any>;


  constructor() { }

  public connect(): Subject<any> {
    if (!this.subject) {
      //this.subject = this.create(`wss://api.lerco.agency:8080/payments`);
      this.subject = this.create(`wss://api-oro.lercomx.com/websocket/`);
    }
    return this.subject;
  }
  private create(url: string): Subject<any> {
    this.socket = new WebSocket(url);
    const observable = new Observable(observer => {
      this.socket.onmessage = event => observer.next(event.data);
      this.socket.onerror = event => observer.error(event);
      this.socket.onclose = event => observer.complete();

      return () => this.socket.close();
    });

    const observer = {
      next: (data: Object) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
  sendMessage(body: any): void {
    this.connect().next(body);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    if (this.subject) {
      this.subject.complete();
      this.subject = null as any;
    }
  }

  public isConnected(): boolean {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

export interface Asiento {
  Vehiculo?: string;
  Asiento?: string;
  Bloque?: string;
  FilaColumna: string;
  selec?: boolean;
  ocupado?: boolean;
  fijado?: boolean;
}


export interface RestAsientos {
  SDTVehiculoAsientos: Asiento[];
}

export interface RestAsientoOcupado {
  SDTVentaListaDD: AsientoOcupado[];
}
export interface AsientoOcupado {
  Viaje: string;
  Origen: string;
  OrigenNombre: string;
  Destino: string;
  DestinoNombre: string;
  FechaSalida: string;
  Asiento: string;
  DescuentoCodigo: string;
  DescuentoDescripcion: string;
  Apertura: string;
  ClienteNombre: string;
  ClienteFechaNacimiento: string;
  ClienteTelefono: string;
  Estatus: string;
}

export interface RestVentaAsiento {
  SDTVentaAsiento: InfoVentaAsiento;
}

export interface InfoVentaAsiento {
  Viaje: string;
  Partida: string;
  FechaSalida: string;
  Asiento: string;
  AsientoXDescuento: number;
  Apertura: string;
  IdTransaccion: string;
  Estatus: string;
  Success: boolean;
  SuccessMsg: string;
}
export interface InfoPasajero {
  Viaje?: number;
  Partida?: number;
  FechaSalida?: string;
  Asiento?: number;
  Apertura?: string;
  ClienteNombre?: string;
  LugarAbordaje?: string;
  Apellido?: string;
  Descuento?: string;
  Precio: number;
  Preciounitario?: number;
  myindex?: string | number;
  IdTransaccion?: string;
  DescuentoImporte?: number;
}


export interface RESTAbordaje {
  SDTViajePtoInter: SDTViajePtoInter[];
}

export interface SDTViajePtoInter {
  Viaje: string;
  Partida: string;
  Destino: string;
  DestinoNombre: string;
  TiempoRecorrido: string;
  PuntoFinal: number;
}


export interface Restpagados {
  SDTListaBoletoPagado: SDTListaBoletoPagado[];
}

export interface SDTListaBoletoPagado {
  Empresa: string;
  EmpresaNombre: string;
  TipoDeServicio: string;
  Folio: string;
  Origen: string;
  Destino: string;
  LugarAbordaje: string;
  FechaSalida: string;
  FechaSalidaPtoInt: string;
  Asiento: string;
  Descuento: string;
  PrecioUnitario: string;
  Cliente: string;
  Asesor: string;
  Terminal: string;
  FechaExpedicion: string;
  DataSet: string;
  FolioAsiento: string;
  EmpresaLogo: string;
  NumImpresion: number;
  MotivoReimpresion: string;
  CVC: string;
  IVA: string;
  Subtotal: string;
  TipoPago: string;
}

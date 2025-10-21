export interface RestViajes {
    SDTViajes: Viaje[];
}
export interface Viaje {
    Viaje: string;
    Origen: string;
    OrigenNombre: string;
    Destino: string;
    DestinoNombre: string;
    Empresa: string;
    EmpresaNombre: string;
    PuntoVenta: string;
    Ruta: string;
    Servicio: string;
    Nombre: string;
    FechaViaje: string;
    HoraViaje: string;
    HoraSistema: string;
    Horallegada: string;
    HoraViajePtoInt: string;
    Partida: string;
    Precio: string;
    EmpresaLogoURL: string;
    TiempoLimiteVisualizacion: string;
    TiempoLimiteConfirmacion: string;
    TiempoLimiteVisualizacionWeb: string;
    VehiculoAsignado: string;
    NumAsientosDisponibles: number | null;
}

export interface RestPrecioViaje {
    SDTPreciosViaje: PrecioViaje[];
}

export interface PrecioViaje {
    Viaje: string;
    ViajeNombre: string;
    Origen: string;
    OrigenNombre: string;
    Destino: string;
    Descuento: string;
    DescuentoDsc: string;
    DescuentoTipo: string;
    DescuentoValor: number;
    InfoClienteRequerido: boolean;
    FolioSiguiente: string;
    PrecioUnitario: string;
    DescuentoImporte: string;
    Precio: string;
}

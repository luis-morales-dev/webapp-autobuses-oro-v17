

export interface RestPago {
    code: number;
    payment_id: string;
    payment_transaction: string;
    payment_status: string;
    message?: string;
}
export interface Respuesta {
    code: number;
    name: string;
    message: string;
    boleto_pdf?: string;
    type: string;
}

export interface RespuestaConfirmacion {
    SDTVentasPagosRespuesta: SDTVentasPagosRespuesta;
}

export interface SDTVentasPagosRespuesta {
    Success: boolean;
    SuccessMsg: string;
}

export interface Restligapago {
    code: number;
    name: string;
    message: string;
    type: string;
    url_pago: string;
}
export interface RestStatusPago {
    status: string;
    reference: string;
    amount: string;
    message?: string;
    type_card: string;
    card_type_code: string;
    folio: string;
    timestamp: Date;
    payment_id: string;
}
export interface Mitresponse {
    action: string;
    payment_reference: string;
    data: RestStatusPago;
}

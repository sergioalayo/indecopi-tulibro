import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamacionesService {
  private URL_TOKEN = 'https://apiconnect.indecopi.gob.pe/auth/realms/RLM-Indecopi-Produccion/protocol/openid-connect/token';
  private URL_GENERAR_LOTE = 'https://connpc.indecopi.gob.pe/appDPClrmypesApi/api/pdf/generar-lote';

  // Inyectamos HttpClient
  constructor(private http: HttpClient) { }

  /**
   * Paso 1: Obtener el Access Token
   */
  private async obtenerToken(): Promise<string> {
    const body = new URLSearchParams();
    body.set('client_id', 'CLI_appDPClrmypesApi');
    body.set('username', 'usr_hrmypes');
    body.set('password', 'iN@%25');
    body.set('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Usamos firstValueFrom para manejar el Observable de Angular como una Promesa
    const response: any = await firstValueFrom(
      this.http.post(this.URL_TOKEN, body.toString(), { headers })
    );
    return response.access_token;
  }

  /**
   * Paso 2: Generar el Lote (retorna el archivo binario)
   */
  async generarArchivoZip(datosEmpresa: any): Promise<Blob> {
    const token = await this.obtenerToken();

    const payload = {
      nuTipo: 1,
      nuAnio: new Date().getFullYear(), // Lo hacemos dinámico
      nuCorrelativoInicio: 1,
      nuCorrelativoFin: 1,
      lstCampos: [
        { vcCampo: "txtRazonSocial", vcValor: datosEmpresa.razonSocial, blSoloLectura: true, vcPlaceholder: "" },
        { vcCampo: "txtRUC", vcValor: datosEmpresa.ruc, blSoloLectura: true, vcPlaceholder: "" },
        { vcCampo: "txtDomicilio", vcValor: datosEmpresa.domicilio, blSoloLectura: true, vcPlaceholder: "" },
        { vcCampo: "txtTipoHoja", vcValor: datosEmpresa.tipoHoja, blSoloLectura: true, vcPlaceholder: "" }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // CRÍTICO: Indicamos a Angular que la respuesta es un archivo ('blob')
    return await firstValueFrom(
      this.http.post(this.URL_GENERAR_LOTE, payload, { headers, responseType: 'blob' })
    );
  }
}
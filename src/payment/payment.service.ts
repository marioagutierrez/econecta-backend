import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom,  } from "rxjs";
import * as crypto from "crypto";

interface GenerateOtpDto {
  banco: string;
  monto: string;
  telefono: string;
  cedula: string;
}

interface DebitoInmediatoDto extends GenerateOtpDto {
  nombre: string;
  otp: string;
  concepto: string;
}

interface ConsultarDebitoInmediatoDto {
  id?: string;
  banco?: string;
  monto?: string;
  telefono?: string;
  cedula?: string;
}

interface OtpResponse {
  code: string;
  message: string;
  success: boolean;
}

interface DebitoResponse {
  code: string;
  message: string;
  reference: string;
  id: string;
  success?: boolean;
}

@Injectable()
export class PaymentService {
  private readonly BASE_URL =
    this.configService.get<string>('PAYMENT_BASE_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private generateHmacToken(message: string): string {
    const commerceToken = this.configService.get<string>('COMMERCE_TOKEN');
    if (!commerceToken) {
      throw new HttpException(
        'Token de comercio no configurado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const hmac = crypto.createHmac('sha256', commerceToken);
    hmac.update(message);
    return hmac.digest('hex');
  }

  async generateOtp(data: GenerateOtpDto) {
    try {
      const message = `${data.banco}${data.monto}${data.telefono}${data.cedula}`;
      const authToken = this.generateHmacToken(message);
      const commerceToken = this.configService.get<string>('COMMERCE_TOKEN');

      const response = await lastValueFrom(
        this.httpService.post<OtpResponse>(
          `${this.BASE_URL}/GenerarOtp`,
          {
            Banco: data.banco,
            Monto: data.monto,
            Telefono: data.telefono,
            Cedula: data.cedula,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: authToken,
              Commerce: commerceToken,
            },
          },
        ),
      );

      if (response.data.code !== '202') {
        throw new HttpException(
          'Error generando OTP',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data: any }; message: string };
      console.log(err);
      console.error(
        'Error en el servicio de pago:',
        err.response?.data || err.message,
      );
      throw new HttpException(
        'Error en el servicio de pago',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async processDebitoInmediato(data: DebitoInmediatoDto) {
    try {
      const message = `${data.banco}${data.cedula}${data.telefono}${data.monto}${data.otp}`;
      const authToken = this.generateHmacToken(message);
      const commerceToken = this.configService.get<string>('COMMERCE_TOKEN');

      const debitoResponse = await lastValueFrom(
        this.httpService.post<DebitoResponse>(
          `${this.BASE_URL}/DebitoInmediato`,
          {
            Banco: data.banco,
            Monto: data.monto,
            Telefono: data.telefono,
            Cedula: data.cedula,
            Nombre: data.nombre,
            OTP: data.otp,
            Concepto: data.concepto,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: authToken,
              Commerce: commerceToken,
            },
          },
        ),
      );

      if (debitoResponse.data.success !== true) {
        throw new HttpException(
          JSON.stringify(debitoResponse.data),
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.consultPayment({ id: debitoResponse.data.id });
    } catch (error: unknown) {
      throw error;
    }
  }
  
  async consultPayment(data: ConsultarDebitoInmediatoDto) {
    try {
      const message = `${data.id}`;
      const authToken = this.generateHmacToken(message);
      const commerceToken = this.configService.get<string>('COMMERCE_TOKEN');
      
      await new Promise(resolve => setTimeout(resolve, 10000));

      const response = await lastValueFrom(
        this.httpService.post<DebitoResponse>(
          `${this.BASE_URL}/ConsultarOperaciones`,
          {
            id: data.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: authToken,
              Commerce: commerceToken,
            },
          },
        ),
      );

      console.log(response.data); 

      if (!response.data.success) {
        throw new HttpException(
         JSON.stringify(response.data),
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error: unknown) {
      // const err = error as { response?: { data: any }; message: string };
      // console.error(
      //   'Error en el servicio de pago:',
      //   err.response?.data || err.message,
      // );
      // throw new HttpException(
      //   'Error en el servicio de pago',
      //   HttpStatus.SERVICE_UNAVAILABLE,
      // );
      throw error;
    }
  }
}

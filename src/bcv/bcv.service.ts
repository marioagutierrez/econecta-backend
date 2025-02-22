import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { lastValueFrom } from 'rxjs';

interface BcvResponse {
  code: string;
  fechavalor: string;
  tipocambio: number;
}

@Injectable()
export class BcvService {
  private readonly BCV_API_URL =
    this.configService.get<string>('PAYMENT_BASE_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private generateHmacToken(message: string, key: string): string {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('hex');
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getTasaBCV(): Promise<number> {
    try {
      const commerceToken = this.configService.get<string>('COMMERCE_TOKEN');
      if (!commerceToken) {
        throw new HttpException(
          'Token de comercio no configurado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const fechavalor = this.getCurrentDate();
      const moneda = 'USD';
      const message = `${fechavalor}${moneda}`;
      const authToken = this.generateHmacToken(message, commerceToken);

      const response = await lastValueFrom(
        this.httpService.post<BcvResponse>(
          this.BCV_API_URL + '/MBbcv',
          {
            Moneda: moneda,
            Fechavalor: fechavalor,
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

      if (!response.data?.tipocambio) {
        throw new HttpException(
          'Respuesta inválida del BCV',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data.tipocambio;
    } catch (error: unknown) {
      const err = error as { response?: { data: any }; message: string };
      console.error(
        'Error consultando tasa BCV:',
        err.response?.data || err.message,
      );
      throw new HttpException(
        'Error consultando tasa BCV',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

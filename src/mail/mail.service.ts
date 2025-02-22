import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

interface OrderEmail {
  id: string;
  total: number;
  totalBs: number;
  tasaBCV: number;
  items: Array<{
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
  client: {
    email: string;
  };
}

interface WelcomeEmail {
  name: string;
  email: string;
  profileUrl: string;
  adminUrl: string;
}

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async getTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src/mail/templates',
      `${templateName}.hbs`,
    );
    return await fs.readFile(templatePath, 'utf-8');
  }

  async sendOrderConfirmation(order: OrderEmail) {
    try {
      const template = await this.getTemplate('order-confirmation');
      const compiledTemplate = handlebars.compile(template);
      const html = compiledTemplate({
        orderNumber: order.id,
        total: order.total,
        totalBs: order.totalBs,
        tasaBCV: order.tasaBCV,
        items: order.items,
      });

      await this.resend.emails.send({
        from: 'noreply@econecta.io',
        to: order.client.email,
        subject: `Confirmación de orden #${order.id}`,
        html: html,
      });
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  }

  async sendWelcomeEmail(data: WelcomeEmail) {
    try {
      const template = await this.getTemplate('welcome');
      const compiledTemplate = handlebars.compile(template);
      const html = compiledTemplate({
        ...data,
        year: new Date().getFullYear(),
      });

      await this.resend.emails.send({
        from: 'noreply@econecta.io',
        to: data.email,
        subject: '¡Bienvenido a Econecta!',
        html: html,
      });
    } catch (error) {
      console.error('Error enviando email de bienvenida:', error);
    }
  }
}

import { Response, Request } from 'express';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { container } from 'tsyringe';

export default class ProvidersAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;
    const listProviderService = container.resolve(
      ListProviderAppointmentsService,
    );
    const listProviders = await listProviderService.execute({
      provider_id,
      day,
      month,
      year,
    });
    return response.json(listProviders);
  }
}
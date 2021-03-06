import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
    const user_id = '1';
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 2, 10, 12).getTime();
    });
    await createAppointment.execute({
      date: new Date(2020, 3, 20, 8, 0, 0),
      provider_id: '123456',
      user_id,
    });

    // eslint-disable-next-line no-plusplus
    for (let index = 8; index < 18; index++) {
      // eslint-disable-next-line no-await-in-loop
      await createAppointment.execute({
        date: new Date(2020, 4, 20, index, 0, 0),
        provider_id: '123456',
        user_id,
      });
    }

    const list = await listProviderAvailabilityService.execute({
      provider_id: '123456',
      month: 5,
      year: 2020,
    });

    expect(list).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});

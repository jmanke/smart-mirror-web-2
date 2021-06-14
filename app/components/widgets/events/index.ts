import { DateTime } from 'luxon';
import WidgetsGapiIndex from '../gapi';

interface WidgetsEventsIndexArgs {
  maxEvents: number;
}

export default class WidgetsEventsIndex extends WidgetsGapiIndex {
  constructor(owner: any, args: WidgetsEventsIndexArgs) {
    super(owner, args);

    this.startGetItems(() => this.getEvents(args.maxEvents));
  }

  async getEvents(maxEvents: number) {
    const now = DateTime.now();
    const timeMax = now.plus({ hours: 16 });

    return this.googleApiService.getEvents({
      timeMin: now.toJSDate(),
      timeMax: timeMax.toJSDate(),
      maxResults: maxEvents,
    });
  }
}

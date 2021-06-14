import Service from '@ember/service';
// @ts-ignore
import { Client } from 'iexjs';
import Config from 'smart-mirror-desktop/config/environment';

interface IntradayOptions {
  last?: number;
  interval?: number;
  IEXOnly?: boolean;
  simplify?: boolean;
  changeFromClose?: boolean;
}

export default class StockApiService extends Service {
  client: any;

  constructor() {
    super();

    this.client = new Client({ api_token: Config.APP.IEX_TOKEN });
  }

  async getIntradayStockInfo(symbol: string, options: IntradayOptions) {
    return this.client.intraday(symbol, options);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'stock-api-service': StockApiService;
  }
}

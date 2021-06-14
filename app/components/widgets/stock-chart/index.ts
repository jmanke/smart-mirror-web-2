import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ApexCharts from 'apexcharts';
import StockApiService from 'smart-mirror-desktop/services/stock-api-service';
import { DateTime } from 'luxon';
import {
  getFormattedDate,
  isWeekend,
} from 'smart-mirror-desktop/utils/dateUtils';
import HeartbeatService, {
  HeartBeat,
} from 'smart-mirror-desktop/services/heart-beat-service';

interface WidgetsStockChartIndexArgs {
  stockSymbol: string;
}

const GMT = 'GMT';
const AMERICA_NEW_YORK = 'America/New_York';
const MIN_TRADING_TIME = '9:30';
const MAX_TRADING_TIME = '15:59';

export default class WidgetsStockChartIndex extends Component<WidgetsStockChartIndexArgs> {
  @service declare stockApiService: StockApiService;
  @service declare heartBeatService: HeartbeatService;

  @tracked stockDate: string = '';
  @tracked currentPrice: number | undefined;
  @tracked connected = true;

  chart: ApexCharts | undefined;
  currStockSymbol: string | undefined;
  chartElement: Element | undefined;
  lastUpdated: DateTime | undefined;
  stockPrices: any[] = [];
  heartBeat: HeartBeat | undefined;

  getDateFromTime(time: string, timeZone: string) {
    return DateTime.fromFormat(time, 'H:m', { zone: timeZone });
  }

  async updateStockPrices() {
    this.stockPrices =
      (await this.stockApiService.getIntradayStockInfo(this.args.stockSymbol, {
        IEXOnly: true,
      })) ?? [];

    if (!this.stockPrices.length) {
      return;
    }

    // set current price to last known close value. API can return null close values
    for (let i = this.stockPrices.length - 1; i >= 0; i--) {
      if (this.stockPrices[i].close) {
        this.currentPrice = this.stockPrices[i].close;
        break;
      }
    }

    const stockDateTime = DateTime.fromISO(this.stockPrices[0].date);
    this.stockDate = getFormattedDate(stockDateTime.toJSDate());
  }

  shouldUpdateStockPrices() {
    if (!this.lastUpdated || this.currStockSymbol != this.args.stockSymbol) {
      return true;
    }

    let nowEasternTime = DateTime.fromISO(DateTime.now().toISO(), {
      zone: AMERICA_NEW_YORK,
    });

    if (isWeekend(nowEasternTime)) {
      const fridayClose = nowEasternTime.set({
        weekday: 5,
        hour: 16,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      return this.lastUpdated < fridayClose;
    }

    let minTradingDateTime = this.getDateFromTime(
      MIN_TRADING_TIME,
      AMERICA_NEW_YORK
    );
    let maxTradingDateTime = this.getDateFromTime(
      MAX_TRADING_TIME,
      AMERICA_NEW_YORK
    );

    const isBetweenTradingHours =
      nowEasternTime > minTradingDateTime &&
      nowEasternTime < maxTradingDateTime;

    if (isBetweenTradingHours) {
      return true;
    }

    return (
      nowEasternTime > maxTradingDateTime &&
      this.lastUpdated < maxTradingDateTime
    );
  }

  createOptions() {
    return {
      annotations: {
        position: 'front',
        xaxis: [
          {
            x: this.getDateFromTime(
              this.stockPrices[this.stockPrices.length - 1].minute,
              GMT
            )
              .toJSDate()
              .getTime(),
            strokeDashArray: 1,
          },
        ],
      },
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      series: [
        {
          name: this.args.stockSymbol,
          data: this.stockPrices.map((p) => ({
            x: this.getDateFromTime(p.minute, GMT).toJSDate().getTime(),
            y: p.close,
          })),
        },
      ],
      xaxis: {
        type: 'datetime',
        min: this.getDateFromTime('9:30', GMT).toJSDate().getTime(),
        max: this.getDateFromTime('16:30', GMT).toJSDate().getTime(),
        labels: {
          format: 'h:mm TT',
          style: {
            colors: '#ffffff',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff',
          },
        },
      },
      colors: ['#ffffff'],
      tooltip: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },
      grid: {
        show: true,
        borderColor: '#444444',
      },
    };
  }

  @action
  async updateChart() {
    if (this.shouldUpdateStockPrices()) {
      this.currStockSymbol = this.args.stockSymbol;

      try {
        await this.updateStockPrices();

        if (!this.connected) {
          this.connected = true;
        }

        const options = this.createOptions();
        if (!this.chart) {
          this.chart = new ApexCharts(this.chartElement, options);
          this.chart.render();
        } else {
          this.chart.updateOptions(options);
        }
      } catch (e: any) {
        if (this.connected) {
          this.connected = false;
        }
      }
    }
  }

  @action
  createChart(ele: HTMLElement) {
    this.chartElement = ele;

    if (this.heartBeat) {
      this.stopHeartBeat();
    }

    this.heartBeat = this.heartBeatService.startHeartbeat(async () => {
      if (this.shouldUpdateStockPrices()) {
        this.updateChart();
      }
    }, 1000 * 60 * 10);
  }

  willDestroy() {
    super.willDestroy();

    this.stopHeartBeat();
  }

  stopHeartBeat() {
    if (this.heartBeat) {
      this.heartBeatService.stopHeartbeat(this.heartBeat);
      this.heartBeat = undefined;
    }
  }
}

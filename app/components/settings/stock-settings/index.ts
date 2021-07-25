import Component from '@glimmer/component';
import { action } from '@ember/object';
import { StockWidget } from 'smart-mirror-desktop/models/settings';
import StockApiService from 'smart-mirror-desktop/services/stock-api-service';
import { inject as service } from '@ember/service';

interface SettingsStockSettingsArgs {
  stockWidget: StockWidget;
  // eslint-disable-next-line no-unused-vars
  onUpdateStockWidget: (stockWidget: StockWidget) => void;
}

export default class SettingsStockSettingsIndex extends Component<SettingsStockSettingsArgs> {
  @service declare stockApiService: StockApiService;

  @action
  async handleStockSymbolChange(stockSymbol: string) {
    try {
      // check if stock is valid
      await this.stockApiService.getIntradayStockInfo(stockSymbol, {
        IEXOnly: true,
        simplify: true,
      });

      this.args.onUpdateStockWidget?.({
        ...this.args.stockWidget,
        stockSymbol,
      });
    } catch (e: any) {
      console.error('Invalid stock symbol: ' + stockSymbol);
      this.args.onUpdateStockWidget?.({
        ...this.args.stockWidget,
      });
    }
  }

  @action handleShowStockWidgetChange() {
    this.args.onUpdateStockWidget?.({
      ...this.args.stockWidget,
      showStockWidget: !this.args.stockWidget.showStockWidget,
    });
  }
}

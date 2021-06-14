import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Profile, Margin } from 'smart-mirror-desktop/models/settings';
import { inject as service } from '@ember/service';
import StockApiService from 'smart-mirror-desktop/services/stock-api-service';

interface SettingsProfileIndexArgs {
  profile: Profile;
  // eslint-disable-next-line no-unused-vars
  onProfileChange: (profile: Profile) => void;
}

export default class SettingsProfileIndex extends Component<SettingsProfileIndexArgs> {
  @service declare stockApiService: StockApiService;

  @action
  handleMarginChange(margin: Margin) {
    this.args.onProfileChange?.({
      ...this.args.profile,
      margin,
    });
  }

  @action
  async handleStockSymbolChange(stockSymbol: string) {
    try {
      // check if stock is valid
      await this.stockApiService.getIntradayStockInfo(stockSymbol, {
        IEXOnly: true,
        simplify: true,
      });

      this.args.onProfileChange?.({
        ...this.args.profile,
        stockSymbol,
      });
    } catch (e: any) {
      console.error('Invalid stock symbol: ' + stockSymbol);
      this.args.onProfileChange?.({
        ...this.args.profile,
      });
    }
  }
}

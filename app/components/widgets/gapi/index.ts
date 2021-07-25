import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import GoogleApiService from 'smart-mirror-desktop/services/google-api-service';
import HeartbeatService, {
  HeartBeat,
} from 'smart-mirror-desktop/services/heart-beat-service';
import { isSameArray } from '../../../utils/utils';

interface WidgetsGapiIndexArgs {}

export default class WidgetsGapiIndex extends Component<WidgetsGapiIndexArgs> {
  @service declare heartBeatService: HeartbeatService;
  @service declare googleApiService: GoogleApiService;

  heartBeat: HeartBeat | undefined;

  @tracked items: [] = [];
  @tracked isConnected = true;

  get anyItems() {
    return !!this.items.length;
  }
  get itemsLength() {
    return this.items.length;
  }

  startGetItems(getFn: () => Promise<[] | null>) {
    this.heartBeat = this.heartBeatService.startHeartbeat(
      async () => {
        try {
          const items = (await getFn()) ?? [];
          if (!this.isConnected) {
            this.isConnected = true;
          }

          const isSame = isSameArray(this.items, items, 'updated');

          if (isSame) {
            return;
          }

          this.items = items;
        } catch (err) {
          if (this.isConnected) {
            this.isConnected = false;
          }

          console.error('Cannot get items');
          throw err;
        }
      },
      1000 * 60,
      true
    );
  }

  willDestroy() {
    super.willDestroy();

    if (this.heartBeat) {
      this.heartBeatService.stopHeartbeat(this.heartBeat);
    }
  }
}

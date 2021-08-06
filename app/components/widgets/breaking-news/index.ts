import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import NewsApiService, {
  NewsResult,
} from 'smart-mirror-desktop/services/news-api-service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import HeartBeatService, {
  HeartBeat,
} from 'smart-mirror-desktop/services/heart-beat-service';

interface WidgetsBreakingNewsArgs {}

export default class WidgetsBreakingNews extends Component<WidgetsBreakingNewsArgs> {
  @service declare newsApiService: NewsApiService;
  @service declare heartBeatService: HeartBeatService;

  getNewsBeat: HeartBeat | undefined;
  nextNewsItemBeat: HeartBeat | undefined;

  @tracked newsResults: NewsResult[] = [];
  @tracked currentNewsItemIndex = 0;

  get currentNewsItem() {
    return this.newsResults[this.currentNewsItemIndex];
  }

  constructor(owner: any, args: WidgetsBreakingNewsArgs) {
    super(owner, args);

    const initialize = async () => {
      this.getNewsBeat = this.heartBeatService.startHeartbeat(
        async () => {
          const newsResults = await this.newsApiService.getTopNews();
          this.newsResults = newsResults?.filter((x) => !!x.description) ?? [];
        },
        1000 * 60 * 60,
        true
      );

      this.nextNewsItemBeat = this.heartBeatService.startHeartbeat(
        async () => {
          this.nextNewsItem();
        },
        1000 * 60,
        true
      );
    };

    initialize();
  }

  nextNewsItem() {
    let nextIndex = this.currentNewsItemIndex + 1;

    if (nextIndex >= this.newsResults.length) {
      nextIndex = 0;
    }

    this.currentNewsItemIndex = -1;

    next(() => {
      this.currentNewsItemIndex = nextIndex;
    });
  }

  filterNewsResults(newsResults: NewsResult[]) {
    if (!newsResults) {
      return [];
    }

    return newsResults.filter((x) => !!x.description);
  }

  willDestroy() {
    super.willDestroy();

    if (this.getNewsBeat) {
      this.heartBeatService.stopHeartbeat(this.getNewsBeat);
    }

    if (this.nextNewsItemBeat) {
      this.heartBeatService.stopHeartbeat(this.nextNewsItemBeat);
    }
  }
}

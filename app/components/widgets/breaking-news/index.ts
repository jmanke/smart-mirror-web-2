import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import NewsApiService, {
  NewsResult,
} from 'smart-mirror-desktop/services/news-api-service';
import { tracked } from '@glimmer/tracking';
import { later, next } from '@ember/runloop';

interface WidgetsBreakingNewsArgs {}

export default class WidgetsBreakingNews extends Component<WidgetsBreakingNewsArgs> {
  @service declare newsApiService: NewsApiService;
  @tracked newsResults: NewsResult[] = [];
  @tracked currentNewsItemIndex = 0;

  get currentNewsItem() {
    return this.newsResults[this.currentNewsItemIndex];
  }

  constructor(owner: any, args: WidgetsBreakingNewsArgs) {
    super(owner, args);

    this.test();
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

    later(() => {
      this.nextNewsItem();
    }, 50000);
  }

  async test() {
    console.log('test');
    this.newsResults = await this.newsApiService.getTopNews();
    console.log(this.newsResults);

    this.nextNewsItem();
  }
}

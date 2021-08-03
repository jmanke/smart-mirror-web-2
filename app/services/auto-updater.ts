import Service, { inject as service } from '@ember/service';
import ApiService from './api-service';
import HeartBeatService, { HeartBeat } from './heart-beat-service';

const UPDATE_INTERVAL = 1000 * 60 * 60;

export default class AutoUpdater extends Service {
  @service declare apiService: ApiService;
  @service declare heartBeatService: HeartBeatService;

  currentBuildVersion: string | undefined;
  heartBeat: HeartBeat | undefined;

  startCheckingForUpdates() {
    if (this.heartBeat) {
      this.heartBeatService.stopHeartbeat(this.heartBeat);
      this.heartBeat = undefined;
    }

    const metaTags = document.getElementsByTagName('meta');

    // find current build version
    this.currentBuildVersion = Array.from(metaTags).find(
      (metaTag) => metaTag.name === 'build-version'
    )?.content;

    // check for updates
    this.heartBeat = this.heartBeatService.startHeartbeat(() => {
      this.apiService
        .getRequest(window.location.href)
        .then((res: any) => {
          const re = /<meta name="build-version" content="(.*?)".*?\/>/;
          const matches = res.match(re);

          if (matches && matches.length === 2) {
            const buildVersion = matches[1];

            if (this.currentBuildVersion !== buildVersion) {
              window.location.reload();
            }
          }
        })
        .catch((e: any) => {
          console.error('Could not reach ' + window.location.href);
          console.error(e);
        });
    }, UPDATE_INTERVAL);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'auto-updater': AutoUpdater;
  }
}

import { later } from '@ember/runloop';
import Service from '@ember/service';

export interface HeartBeat {
  interval: any;
}

export default class HeartBeatService extends Service {
  startHeartbeat(
    fn: () => any,
    interval: number,
    autoRetry = false,
    retryInterval = 1000 * 10
  ): HeartBeat {
    let cbFn = autoRetry
      ? async () => {
          try {
            if (fn.constructor.name === 'AsyncFunction') {
              await fn();
            } else {
              fn();
            }
          } catch (err) {
            console.log('something went wrong... retrying');
            later(cbFn, retryInterval);
          }
        }
      : fn;

    cbFn();
    const int = setInterval(cbFn, interval);

    return {
      interval: int,
    };
  }

  stopHeartbeat(heartBeat: HeartBeat) {
    window.clearInterval(heartBeat.interval);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'heart-beat-service': HeartBeatService;
  }
}

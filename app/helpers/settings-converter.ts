import { isEmpty } from '@ember/utils';
import { Settings } from 'smart-mirror-desktop/models/settings';

export function convertSettings(settings: any): Settings {
  if (settings?.version === 1) {
    return settings;
  }

  settings = convertVersion0(settings);
  convertVersion1(settings);

  return settings as Settings;
}

function convertVersion0(settings: any) {
  if (!isEmpty(settings) && settings.version >= 0) {
    return settings;
  }

  return {
    version: 0,
    layout: {
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      fontSize: '19px',
    },
    stockWidget: {
      stockSymbol: 'SPY',
      showStockWidget: true,
    },
    newsWidget: {
      width: 540,
    },
    googleWidget: {
      visible: false,
    },
  };
}

function convertVersion1(settings: any) {
  if (settings.version >= 1) {
    return;
  }

  settings.version = 1;
  settings.googleWidget = {
    visible: false,
  };
}

export interface Margin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Profile {
  margin: Margin;
  showStockWidget: boolean;
  stockSymbol: string;
}

export interface Settings {
  profile: Profile;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    settings: Settings;
  }
}

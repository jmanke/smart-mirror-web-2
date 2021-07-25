export interface Margin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Layout {
  margin: Margin;
}

export interface StockWidget {
  showStockWidget: boolean;
  stockSymbol: string;
}

export interface Settings {
  layout: Layout;
  stockWidget: StockWidget;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    settings: Settings;
  }
}

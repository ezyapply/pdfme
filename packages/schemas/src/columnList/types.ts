import { TableSchema } from '../tables/types';
import type { ALIGNMENT } from '../text';

export interface ColumnListSchema extends TableSchema {
  columnGroups: number;
  //e.g - •
  bulletSymbol?: string;
  bulletWidth?: number;
  enhancedColumnStyles?: {
    bulletColumn?: ALIGNMENT;
    nonBulletColumn?: ALIGNMENT;
  };
}

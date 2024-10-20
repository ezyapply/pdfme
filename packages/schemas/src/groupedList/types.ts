import { TableSchema } from '../tables/types';

export interface GroupedListSchema extends TableSchema {
  groupedListHeadStyles: Partial<TableSchema>;
  groupedListItemStyles: Partial<TableSchema>;
  //e.g - •
  bulletSymbol?: string;
  bulletWidth?: number;
}

export interface GroupedItems {
  head: string[][];
  items: string[];
  __isSplit: boolean;
}

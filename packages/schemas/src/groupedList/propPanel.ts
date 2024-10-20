import type { PropPanel } from '@pdfme/common';
import { GroupedListSchema } from './types';
import { propPanel as tablePropPanel } from '../tables/propPanel';

const groupedListSchema = { ...tablePropPanel.defaultSchema };
export const propPanel: PropPanel<GroupedListSchema> = {
  schema: () => {
    return {
      ...tablePropPanel.schema,
      columnGroups: {
        title: 'Columns Groups',
        type: 'number',
        widget: 'inputNumber',
        span: 6,
        props: { min: 0 },
      },
      bulletSymbol: {
        title: 'Bullet Symbol',
        type: 'string',
        widget: 'lineTitle',
        span: 6,
      },
      bulletWidth: {
        title: 'Bullet Width',
        type: 'number',
        widget: 'inputNumber',
        span: 6,
        props: { min: 0 },
      },
    };
  },
  defaultSchema: {
    ...groupedListSchema,
    type: 'groupedList',
    groupedListItemStyles: groupedListSchema,
    groupedListHeadStyles: groupedListSchema,
    bulletSymbol: '•',
    bulletWidth: 2,
  },
};

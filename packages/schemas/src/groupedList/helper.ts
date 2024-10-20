import { GroupedItems, GroupedListSchema } from './types';
import { TableSchema } from '../tables/types';

export const getBody = (value: string | GroupedItems[]): GroupedItems[] => {
  if (typeof value === 'string') {
    return JSON.parse(value || '[]') as GroupedItems[];
  }
  return value || [];
};

type GroupedRowItem = { row: string[] | string; group: GroupedItems };
export const getBodyWithRange = (
  value: string | GroupedItems[],
  range?: { start: number; end?: number | undefined }
) => {
  const body = getBody(value);
  if (!range) return body;
  const flattenItems = body.flatMap((group) => {
    return group.head
      .map((head) => ({ row: head, group } as GroupedRowItem))
      .concat(group.items.map((item) => ({ row: item, group } as GroupedRowItem)));
  });
  const result = flattenItems.slice(range.start, range.end);
  //recombine result
  // Reconstruct the GroupedItems from the sliced result
  const groupsMap = new Map<GroupedItems, GroupedRowItem[]>();

  result.forEach((item) => {
    if (!groupsMap.has(item.group)) {
      groupsMap.set(item.group, []);
    }
    groupsMap.get(item.group)!.push(item);
  });

  // Build the new GroupedItems array
  const newBody: GroupedItems[] = [];
  groupsMap.forEach((items, group) => {
    const newGroup: GroupedItems = { head: [], items: [], __isSplit: false };
    items.forEach((item) => {
      if (Array.isArray(item.row)) {
        if (newGroup.head.length == 0) {
          newGroup.__isSplit = group.head.length > 0 && group.head[0] != item.row;
        }
        newGroup.head.push(item.row);
      } else {
        newGroup.items.push(item.row);
      }
    });
    newBody.push(newGroup);
  });

  return newBody;
};

const toTableData = (
  value: GroupedItems[],
  bulletSymbol: string
): {
  head: string[][];
  __isSplit: boolean;
  items: string[][];
}[] => {
  return value.map((u) => {
    const { head = [], items = [], __isSplit } = u;
    return { head, __isSplit, items: items.map((item) => [bulletSymbol, item]) };
  });
};

export const makeTableSchema = (main: TableSchema, partial: Partial<TableSchema>): TableSchema => {
  return Object.assign({}, main, partial, {
    position: main.position,
    type: 'table',
    __bodyRange: undefined,
  });
};

export function groupBody(arg: { schema: GroupedListSchema; value: string }) {
  const { schema, value } = arg;
  const bodyWidthRange = getBodyWithRange(getBody(value), schema.__bodyRange);
  const inputs = toTableData(bodyWidthRange, schema.bulletSymbol || '•');
  const headSchema = makeTableSchema(schema, schema.groupedListHeadStyles);
  const itemsSchema = makeTableSchema(schema, schema.groupedListItemStyles);
  const itemsColumns = inputs.length && inputs[0].items.length ? inputs[0].items[0].length : 0;
  itemsSchema.head = [...new Array(itemsColumns).keys()].map((i) => `Col ${i}`);
  itemsSchema.showHead = false;
  const columnsLength = itemsSchema.headWidthPercentages.length;
  const percentageForBulletWidth = Math.floor((100 * (schema.bulletWidth || 2)) / schema.width);
  const spread = percentageForBulletWidth / columnsLength;
  itemsSchema.headWidthPercentages = [...new Array(itemsColumns).keys()].map((u, index) =>
    index == 0 ? percentageForBulletWidth : itemsSchema.headWidthPercentages[index - 1] - spread
  );
  return { inputs, headSchema, itemsSchema };
}

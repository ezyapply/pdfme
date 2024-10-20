import { BasePdf, CommonOptions, Schema } from '@pdfme/common';
import { createSingleTable } from './tableHelper';
import { getBody, getBodyWithRange } from './helper.js';
import { TableSchema } from './types';
import { dynamicHeights } from '../columnList/dynamicHeights';
import { dynamicHeights as groupedListDynamicHeights } from '../groupedList/dynamicHeights';

export const getDynamicHeightsForTable = async (
  value: string,
  args: {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<any, any>;
  }
): Promise<number[]> => {
  if (args.schema.type == 'table') {
    const schema = args.schema as TableSchema;
    const body =
      schema.__bodyRange?.start === 0
        ? getBody(value)
        : getBodyWithRange(value, schema.__bodyRange);
    const table = await createSingleTable(body, args);
    return table.allRows().map((row) => row.height);
  } else if (args.schema.type == 'columnList') {
    return await dynamicHeights(args, value);
  } else if (args.schema.type == 'groupedList') {
    return await groupedListDynamicHeights(args, value);
  }
  return Promise.resolve([args.schema.height]);
};

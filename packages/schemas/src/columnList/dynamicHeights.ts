import { BasePdf, CommonOptions, Schema } from '@pdfme/common';
import { ColumnListSchema } from './types';
import { groupBody } from './helper';
import { createSingleTable } from '../tables/tableHelper';

export async function dynamicHeights(
  args: {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<any, any>;
  },
  value: string
) {
  const schema = args.schema as ColumnListSchema;
  const { body, tableSchema } = groupBody({ schema, value });
  const table = await createSingleTable(body, { ...args, schema: tableSchema });
  return table.allRows().map((row) => row.height);
}

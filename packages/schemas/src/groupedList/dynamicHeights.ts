import {BasePdf, CommonOptions, Schema} from '@pdfme/common';
import {GroupedListSchema} from './types';
import {groupBody} from './helper';
import {createSingleTable} from '../tables/tableHelper';
import {Row} from '../tables/classes';

export async function dynamicHeights(
    args: {
        schema: Schema;
        basePdf: BasePdf;
        options: CommonOptions;
        _cache: Map<any, any>;
    },
    value: string
): Promise<number[]> {
    const schema = args.schema as GroupedListSchema;
    const {inputs, headSchema, itemsSchema} = groupBody({schema, value});
    const heights: Row[] = [];
    for (const input of inputs) {
        const head = await createSingleTable(input.head, {...args, schema: headSchema});
        const items = await createSingleTable(input.items, {...args, schema: itemsSchema});
        heights.push(...head.body);
        heights.push(...items.body);
    }
    //the whole system is fundamentally build on having a header
    return [0].concat(heights.map((row) => row.height));
}

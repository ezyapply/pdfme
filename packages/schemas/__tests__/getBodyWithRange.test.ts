import {getBodyWithRange} from '../src/groupedList/helper';
import {GroupedItems} from '../src/groupedList/types';

describe('getBodyWithRange', () => {
    const sampleData: GroupedItems[] = [
        {
            head: [['Header1'], ['Header2']],
            items: ['Item1', 'Item2', 'Item3'],
            __isSplit: false
        },
        {
            head: [['Header3']],
            items: ['Item4', 'Item5'],
            __isSplit: false,
        },
        {
            head: [['Header4'], ['Header5'], ['Header6']],
            items: [],
            __isSplit: false,
        },
    ];

    test('returns the entire body when no range is provided (input as GroupedItems[])', () => {
        const result = getBodyWithRange(sampleData);
        expect(result).toEqual(sampleData);
    });


    test('returns items within the specified range (start and end)', () => {
        const range = {start: 2, end: 5};
        const result = getBodyWithRange(sampleData, range);

        const expected: GroupedItems[] = [
            {
                head: [],
                items: ['Item1','Item2', 'Item3'],
                __isSplit: false,
            }
        ];

        expect(result).toEqual(expected);
    });

    test('returns items from the start index to the end of the flattened list when end is undefined', () => {
        const range = {start: 4};
        const result = getBodyWithRange(sampleData, range);

        const expected: GroupedItems[] = [
            {
                head: [],
                items: ['Item3'],
                __isSplit: false,
            },
            {
                head: [['Header3']],
                items: ['Item4', 'Item5'],
                __isSplit: false,
            },
            {
                head: [['Header4'], ['Header5'], ['Header6']],
                items: [],
                __isSplit: false,
            },
        ];

        expect(result).toEqual(expected);
    });

    test('returns an empty array when the range is out of bounds', () => {
        const range = {start: 11, end: 15};
        const result = getBodyWithRange(sampleData, range);
        expect(result).toEqual([]);
    });

    test('handles empty GroupedItems array', () => {
        const emptyData: GroupedItems[] = [];
        const range = {start: 0, end: 5};
        const result = getBodyWithRange(emptyData, range);
        expect(result).toEqual([]);
    });

    test('handles GroupedItems with no heads', () => {
        const data: GroupedItems[] = [
            {
                head: [],
                items: ['Item1', 'Item2'],
                __isSplit: false,
            },
        ];
        const range = {start: 1, end: 2};
        const result = getBodyWithRange(data, range);

        const expected: GroupedItems[] = [
            {
                head: [],
                items: ['Item2'],
                __isSplit: false,
            },
        ];

        expect(result).toEqual(expected);
    });

    test('handles GroupedItems with no items', () => {
        const data: GroupedItems[] = [
            {
                head: [['Header1']],
                items: [],
                __isSplit: false,
            },
        ];
        const range = {start: 0, end: 1};
        const result = getBodyWithRange(data, range);

        const expected: GroupedItems[] = [
            {
                head: [['Header1']],
                items: [],
                __isSplit: false,
            },
        ];

        expect(result).toEqual(expected);
    });

    test('handles ranges that include both heads and items', () => {
        const range = {start: 1, end: 4};
        const result = getBodyWithRange(sampleData, range);

        const expected: GroupedItems[] = [
            {
                head: [['Header2']],
                items: ['Item1', 'Item2'],
                __isSplit: true,
            },
        ];

        expect(result).toEqual(expected);
    });

    test('handles single item range', () => {
        const range = {start: 3, end: 4};
        const result = getBodyWithRange(sampleData, range);

        const expected: GroupedItems[] = [
            {
                head: [],
                items: ['Item2'],
                __isSplit: false,
            },
        ];

        expect(result).toEqual(expected);
    });

    test('handles range that exactly matches the flattened list', () => {
        // Flattened indices: 0 (Header1), 1 (Header2), 2 (Item1), 3 (Item2), 4 (Item3),
        // 5 (Header3), 6 (Item4), 7 (Item5),
        // 8 (Header4), 9 (Header5), 10 (Header6)
        const range = {start: 0, end: 11};
        const result = getBodyWithRange(sampleData, range);
        expect(result).toEqual(sampleData);
    });

    test('handles range where start is 0', () => {
        const range = {start: 0, end: 3};
        const result = getBodyWithRange(sampleData, range);

        const expected: GroupedItems[] = [
            {
                head: [['Header1'], ['Header2']],
                items: ['Item1'],
                __isSplit: false,
            },
        ];

        expect(result).toEqual(expected);
    });
});
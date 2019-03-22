/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Bas Verweij. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
* getCells parses the lines found for a certain row, and transforms these to
* the separate cell lines.
* 
* @param columnWidths The column widths for this table.
* @param columnOffsets The absolute column offsets for this table. 
* @param lines The lines for the row.
*/
export default function getCells(
    columnWidths: number[],
    columnOffsets: number[],
    lines: string[]):
    string[][]
{
    const cells = [];

    for (let i = 0; i < columnWidths.length; i++)
    {
        let cell = [];

        for (let j = 0; j < lines.length; j++)
        {
            const s = lines[j]
                .substr(columnOffsets[i] + 1, columnWidths[i] - 1)
                .trimRight();

            if ((s.length == 0) &&
                (cell.length == 0))
            {
                // skip leading empty lines
                continue;
            }

            cell.push(s);
        }

        // remove trailing empty lines
        let j = cell.length - 1;
        for (; j >= 0; j--)
        {
            if (cell[j].length > 0)
            {
                break;
            }
        }

        if (j < cell.length - 1)
        {
            cell = cell.slice(0, j + 1);
        }

        cells.push(cell);
    }

    return cells;
}
/**
 * getColumnWidths parses the provided line and returns the associated column widths.
 * 
 * @param line The separator line to parse for the column widths.
 * @returns The column widths for the provided line, or an empty array if the line is invalid. 
 */
export function getColumnWidths(
    line: string):
    number[] {

    // try to parse as a row separator line
    let columnMatch = line
        .substr(1)
        .match(/[:-][-]+[:-]\+/g);

    if (columnMatch == null) {
        // try to parse as a header separator line
        columnMatch = line
            .substr(1)
            .match(/[:=][=]+[:=]\+/g);
    }

    if (columnMatch == null) {
        return [];
    }

    return columnMatch.map(s => s.length);
}

/**
 * getCells parses the lines found for a certain row, and transforms these to
 * the separate cell lines.
 * 
 * @param columnWidths The column widths for this table.
 * @param columnOffsets The absolute column offsets for this table. 
 * @param lines The lines for the row.
 */
export function getCells(
    columnWidths: number[],
    columnOffsets: number[],
    lines: string[]):
    string[][] {

    let cells = [];

    for (var i = 0; i < columnWidths.length; i++) {
        var cell = [];

        for (var j = 0; j < lines.length; j++) {
            var s = lines[j]
                .substr(columnOffsets[i] + 1, columnWidths[i] - 1)
                .trim();

            if ((s.length == 0) &&
                (cell.length == 0)) {
                // skip leading empty lines
                continue;
            }

            cell.push(s);
        }

        // remove trailing empty lines
        var j = cell.length - 1;
        for (; j >= 0; j--) {
            if (cell[j].length > 0) {
                break;
            }
        }

        if (j < cell.length - 1) {
            cell = cell.slice(0, j + 1);
        }

        cells.push(cell);
    }

    return cells;
}
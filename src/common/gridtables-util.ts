export function GetColumnWidths(
    separatorLine: string):
    number[] {

    let columnMatch = separatorLine
        .substr(1)
        .match(/[:-][-]+[:-]\+/g);

    if (columnMatch == null) {
        return [];
    }

    return columnMatch.map(s => s.length);
}

export function GetCells(
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
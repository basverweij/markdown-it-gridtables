/**
 * getColumnWidths parses the provided line and returns the associated column widths.
 * 
 * @param line The separator line to parse for the column widths.
 * @returns The column widths for the provided line, or an empty array if the line is invalid. 
 */
export default function getColumnWidths(
    line: string):
    number[]
{
    // try to parse as a row separator line
    let columnMatch = line
        .substr(1)
        .match(/[:-][-]+[:-]\+/g);

    if (columnMatch == null)
    {
        // try to parse as a header separator line
        columnMatch = line
            .substr(1)
            .match(/[:=][=]+[:=]\+/g);
    }

    if (columnMatch == null)
    {
        return [];
    }

    return columnMatch.map(s => s.length);
}
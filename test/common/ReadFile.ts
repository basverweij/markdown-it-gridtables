/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Bas Verweij. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readFileSync } from "fs";

export default function readFile(
    path: string
): string
{
    return readFileSync(path, "utf8")
        .replace(/\r\n/g, "\n");
}

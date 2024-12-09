import * as path from "jsr:@std/path"
import { buildDiskMap, checksum } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const data = inputs.split("").map((v) => parseInt(v, 10))

const diskMap = buildDiskMap(data)

const compactDiskMap = [...diskMap]

function findFreeSpaceOf(diskMap: (number | null)[], length: number, cursor: number) {
    let size = 0

    for (let i = 0; i < cursor; i++) {
        const currentValue = diskMap[i]

        if (currentValue === null) {
            size++
        } else {
            size = 0
        }

        if (size >= length) {
            return i - size + 1
        }
    }

    return -1
}

let cursor = compactDiskMap.length - 1

do {
    const cursorValue = compactDiskMap[cursor]

    // skip free space
    if (cursorValue === null) {
        cursor--
        continue
    }

    let endCursor: number = cursor
    let endCursorValue: number | null

    do {
        endCursor = endCursor - 1
        endCursorValue = compactDiskMap[endCursor]
    } while (cursorValue === endCursorValue)

    const fileBlockSize = cursor - endCursor
    const insertIndex = findFreeSpaceOf(compactDiskMap, fileBlockSize, cursor)

    if (insertIndex !== -1) {
        const fileBlocks = compactDiskMap.splice(endCursor + 1, fileBlockSize)
        compactDiskMap.splice(insertIndex, fileBlocks.length, ...fileBlocks)

        // Set null block at previous pos
        compactDiskMap.splice(endCursor + 1, 0, ...fileBlocks.map((_) => null))
    }

    // console.log(compactDiskMap.map((v) => v == null ? "." : v).join(""))

    cursor -= fileBlockSize
} while (cursor > 0)

console.log(checksum(compactDiskMap))

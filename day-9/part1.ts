import * as path from "jsr:@std/path"
import { buildDiskMap, checksum } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const data = inputs.split("").map((v) => parseInt(v, 10))

const diskMap = buildDiskMap(data)

const tempDiskMap = [...diskMap]
const compactDiskMap: Array<number> = []

do {
    const firstValue = tempDiskMap.shift() ?? null
    if (firstValue != null) {
        compactDiskMap.push(firstValue)
    } else {
        let lastValue: number | null = null

        do {
            lastValue = tempDiskMap.pop() ?? null
        } while (lastValue == null && tempDiskMap.length > 0)

        if (lastValue !== null) {
            compactDiskMap.push(lastValue)
        }
    }
} while (tempDiskMap.length > 0)

// 6331212425418
console.log(checksum(compactDiskMap))

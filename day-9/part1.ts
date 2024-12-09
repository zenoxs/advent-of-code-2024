import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const data = inputs.split("").map((v) => parseInt(v, 10))

const diskMap: Array<null | number> = []

let currentID = 0
data.forEach((v, index) => {
    const isFile = index % 2 === 0

    for (let i = 0; i < v; i++) {
        if (!isFile) {
            // Free space
            diskMap.push(null)
            continue
        }
        diskMap.push(currentID)
    }

    if (isFile) {
        currentID++
    }
})

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

// console.log(compactDiskMap.map((v) => v == null ? "." : v).join(""))

const checkSum = compactDiskMap.reduce((total, fileId, index) => {
    return total + fileId * index
}, 0)

// 6331212425418
console.log(checkSum)

import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const lines = inputs.split("\n").map((l) => l.split("   ").map(parseFloat) as [number, number])

const orderedColumn1 = lines.flatMap((l) => l[0]).toSorted((a, b) => a - b)
const orderedColumn2 = lines.flatMap((l) => l[1]).toSorted((a, b) => a - b)

const totalDistance = orderedColumn1.reduce(
    (acc, val, index) => acc + Math.abs(val - orderedColumn2[index]),
    0,
)
// 1889772

console.log(totalDistance)

const similarityScore = orderedColumn1.reduce((acc, val) => {
    const occurrence = orderedColumn2.filter((v) => v === val).length
    const similarity = occurrence * val

    return similarity + acc
}, 0)

// 23228917
console.log(similarityScore)

import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const reports = inputs.split("\n").map((l) => l.split(" ").map(parseFloat))

const isMonotonic = (levels: number[], comparator: (diff: number) => boolean) =>
    levels.every((level, index) => {
        if (index === levels.length - 1) return true // Last number
        const diff = levels[index + 1] - level
        return comparator(diff)
    })

const toSlicedArray = (array: number[], indexToRemove: number) => {
    return [...array.slice(0, indexToRemove), ...array.slice(indexToRemove + 1)]
}

// Part 1
const safeReports = reports.filter((levels) => {
    return (
        isMonotonic(levels, (diff) => diff >= 1 && diff <= 3) || // Increasing
        isMonotonic(levels, (diff) => diff >= -3 && diff <= -1) // Decreasing
    )
})

// 680
console.log(safeReports.length)

// Part 2
const safeReportsWithTolerance = reports.filter((levels) => {
    const isMonotonic = (levels: number[], comparator: (diff: number) => boolean) =>
        levels.every((level, index) => {
            if (index === levels.length - 1) return true // Last number
            const diff = levels[index + 1] - level
            return comparator(diff)
        })

    const tolerantLevels: number[][] = []
    levels.forEach((_, index) => {
        // Construct every level possibility with one element removed
        tolerantLevels.push(toSlicedArray(levels, index))
    })

    return [levels, ...tolerantLevels].some((l) => (
        isMonotonic(l, (diff) => diff >= 1 && diff <= 3) || // Increasing
        isMonotonic(l, (diff) => diff >= -3 && diff <= -1) // Decreasing
    ))
})

// 710
console.log(safeReportsWithTolerance.length)

import * as path from "jsr:@std/path"
import { CellGrid, generateAllRotations, getOrInitializeCellGrid, mergeCellGrids } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const grid = inputs.split("\n").map((v) => v.split(""))

function discoverRegion(grid: string[][], x: number, y: number) {
    const height = grid.length - 1
    const width = grid[0].length - 1

    const neighbors = new Map<number, Set<number>>()

    function discover(x: number, y: number) {
        const cell = grid[y][x]

        getOrInitializeCellGrid(neighbors, y).add(x)

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue
                }

                if (Math.abs(dx) + Math.abs(dy) >= 2) {
                    continue
                }

                const testedX = x + dx
                const testedY = y + dy

                if (testedX < 0 || testedX > width || testedY < 0 || testedY > height) {
                    continue
                }

                if (neighbors.get(testedY)?.has(testedX) ?? false) {
                    continue
                }

                const testedCell = grid[testedY][testedX]

                if (testedCell === cell) {
                    discover(testedX, testedY)
                }
            }
        }
    }

    discover(x, y)

    return neighbors
}

function getRegionPerimeter(region: CellGrid) {
    const X = true
    const O = false
    const _ = null

    const cornerPatterns = ([
        // |
        [0, [
            [_, O, _],
            [X, X, X],
            [_, O, _],
        ]],
        [0, [
            [_, O, _],
            [X, X, X],
            [X, X, X],
        ]],
        [0, [
            [X, X, X],
            [X, X, X],
            [X, X, X],
        ]],
        [1, [
            [X, X, X],
            [O, X, X],
            [O, X, O],
        ]],
        [1, [
            [O, X, X],
            [O, X, X],
            [X, X, O],
        ]],
        [1, [
            [X, X, X],
            [X, X, X],
            [O, X, X],
        ]],
        [1, [
            [X, X, O],
            [X, X, O],
            [O, X, X],
        ]],
        [1, [
            [X, X, _],
            [X, X, O],
            [_, O, _],
        ]],
        [1, [
            [O, X, X],
            [X, X, _],
            [X, X, X],
        ]],
        [1, [
            [O, X, O],
            [X, X, O],
            [X, X, O],
        ]],
        [1, [
            [X, X, O],
            [X, X, O],
            [O, X, O],
        ]],
        [1, [
            [X, X, X],
            [X, X, O],
            [O, X, O],
        ]],
        [0, [
            [X, X, X],
            [O, X, O],
            [O, X, O],
        ]],
        [2, [
            [X, X, X],
            [X, X, X],
            [O, X, O],
        ]],
        [2, [
            [_, X, _],
            [O, X, O],
            [_, O, _],
        ]],
        [2, [
            [O, X, _],
            [X, X, O],
            [_, O, _],
        ]],
        [2, [
            [O, X, O],
            [X, X, X],
            [_, O, O],
        ]],
        [2, [
            [X, X, O],
            [X, X, X],
            [O, X, X],
        ]],
        // Middle center
        [4, [
            [_, O, _],
            [O, X, O],
            [_, O, _],
        ]],
    ] satisfies [number, [boolean | null, boolean | null, boolean | null][]][]).reduce<
        [number, [boolean | null, boolean | null, boolean | null][]][]
    >(
        (acc, pattern) => {
            const allRotations = generateAllRotations(pattern[1]).map(
                (v) => ([pattern[0], v] as [number, [boolean | null, boolean | null, boolean | null][]]),
            )

            return [...acc, ...allRotations]
        },
        [],
    )

    const countCellCorners = (x: number, y: number) => {
        for (const [count, pattern] of cornerPatterns) {
            let isValid = true
            for (const [dy, rows] of pattern.entries()) {
                for (const [dx, col] of rows.entries()) {
                    if (col == null) {
                        continue
                    }

                    const testedX = x + dx - 1
                    const testedY = y + dy - 1

                    const testedCell = region.get(testedY)?.has(testedX)

                    if ((col && testedCell !== col) || (!col && testedCell)) {
                        isValid = false
                    }
                }
            }

            if (isValid) {
                // if (grid[y][x] === "F") {
                //     console.log(`${x}:${y} = ${count}`)
                //     console.log(pattern)
                // }
                return count
            }
        }

        const demo: boolean[][] = []
        for (let dy = 0; dy <= 2; dy++) {
            demo[dy] = []
            for (let dx = 0; dx <= 2; dx++) {
                const testedX = x + dx - 1
                const testedY = y + dy - 1

                const testedCell = region.get(testedY)?.has(testedX) ?? false
                demo[dy][dx] = testedCell
            }
        }

        console.log(demo)

        throw Error("no pattern found")
    }

    let borders = 0

    region.entries().forEach(([y, cells]) => {
        cells.forEach((x) => {
            borders += countCellCorners(x, y)
        })
    })

    return borders
}

function getRegionArea(region: CellGrid) {
    return region.entries().reduce((acc, [, cells]) => {
        return acc + cells.size
    }, 0)
}

function buildRegions(grid: string[][]) {
    let addedCells: CellGrid = new Map()
    const regions = new Map<string, CellGrid>()
    let currentRegionId: string

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell !== currentRegionId) {
                // new region
                currentRegionId = cell
                let i = 0

                // Region name already exists
                while (regions.has(currentRegionId)) {
                    i++
                    currentRegionId = `${cell}-${i}`
                }
            }
            if (addedCells.get(y)?.has(x) ?? false) {
                // The cell is already part of a region
                return
            }
            const regionCells = discoverRegion(grid, x, y)

            // Add the cells region to the added cells
            addedCells = mergeCellGrids(addedCells, regionCells)

            regions.set(currentRegionId, regionCells)
        })
    })

    return regions
}

const totalPrice = buildRegions(grid).entries().reduce((acc, [regionId, cells]) => {
    const perimeter = getRegionPerimeter(cells)
    const area = getRegionArea(cells)

    console.log(`${regionId}, ${area} * ${perimeter} = ${area * perimeter}`)

    return acc + perimeter * area
}, 0)

console.log(totalPrice)

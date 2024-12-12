import * as path from "jsr:@std/path"
import { CellGrid, getOrInitializeCellGrid, mergeCellGrids } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const grid = inputs.split("\n").map((v) => v.split(""))
const height = grid.length - 1
const width = grid[0].length - 1

const discoveredCells: CellGrid = new Map()
function discoverRegion(grid: string[][], x: number, y: number) {
    const cell = grid[y][x]

    let neighbors = new Map<number, Set<number>>()
    getOrInitializeCellGrid(neighbors, y).add(x)
    getOrInitializeCellGrid(discoveredCells, y).add(x)

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

            if (discoveredCells.get(testedY)?.has(testedX) ?? false) {
                continue
            }

            const testedCell = grid[testedY][testedX]

            if (testedCell === cell) {
                neighbors = mergeCellGrids(neighbors, discoverRegion(grid, testedX, testedY))
            }
        }
    }

    return neighbors
}

function getRegionPerimeter(region: CellGrid) {
    const countCellNeighbors = (x: number, y: number) => {
        let total = 0
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

                if (region.get(testedY)?.has(testedX) ?? false) {
                    total++
                }
            }
        }

        return total
    }

    let borders = 0

    region.entries().forEach(([y, cells]) => {
        cells.forEach((x) => {
            const total = countCellNeighbors(x, y)
            borders += 4 - total
        })
    })

    return borders
}

function getRegionArea(region: CellGrid) {
    return region.entries().reduce((acc, [, cells]) => {
        return acc + cells.size
    }, 0)
}

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

console.log(regions)

const totalPrice = regions.entries().reduce((acc, [regionId, cells]) => {
    const perimeter = getRegionPerimeter(cells)
    const area = getRegionArea(cells)

    console.log(`${regionId}, A:${area}, P:${perimeter}`)

    return acc + perimeter * area
}, 0)

console.log(totalPrice)

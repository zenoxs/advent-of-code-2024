import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l.split(""))

type Direction = "top" | "right" | "bottom" | "left"

const symbolToDirectionDict: Record<string, Direction> = {
    "^": "top",
    ">": "right",
    "v": "bottom",
    "<": "left",
}

const directionToSymbolDict = Object.fromEntries(
    Object.entries(symbolToDirectionDict).map(([key, value]) => [value, key]),
) as Record<Direction, string>

function displayMapState(
    walls: boolean[][],
    guardPosition: [number, number],
    guardDirection: Direction,
    traversedCells: Map<number, Set<number>>,
) {
    walls.forEach((row, rowIndex) => {
        const displayedLine = row
            .map((isWall, columnIndex) => {
                if (guardPosition[0] === rowIndex && guardPosition[1] === columnIndex) {
                    return directionToSymbolDict[guardDirection]
                }

                if (traversedCells.get(rowIndex)?.has(columnIndex)) {
                    return "X"
                }

                if (isWall) {
                    return "#"
                }

                return "."
            })
            .join("")
        console.log(displayedLine)
    })
}

// Build a matrix where walls are located and find the guard's initial position
let guardPosition: [number, number] = [-1, -1]
let guardDirection: Direction = "top"

const walls: boolean[][] = rows.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
        if (cell === "^") {
            guardPosition = [rowIndex, columnIndex] // Track guard position
            guardDirection = symbolToDirectionDict[cell]
        }
        return cell === "#" // True if the cell is a wall
    })
)

console.log(displayMapState(walls, guardPosition, guardDirection, new Map()))

function computeGuardPath(
    walls: boolean[][],
    initialGuardPosition: [number, number],
    initialGuardDirection: Direction,
) {
    const maxY = walls.length - 1
    const maxX = walls[0].length - 1

    let currentPosition: [number, number] = [...initialGuardPosition]
    let currentDirection = initialGuardDirection

    const traversedCells = new Map<number, Set<number>>()

    function addTraversedCell([y, x]: [number, number]) {
        // Retrieve or initialize the set for `y`
        const row = traversedCells.get(y) ?? new Set<number>()
        row.add(x)
        traversedCells.set(y, row) // Update the map with the modified set
    }

    // Helper: Compute the next position based on direction
    function getNextPosition(position: [number, number], direction: Direction): [number, number] {
        const [row, col] = position
        switch (direction) {
            case "top":
                return [row - 1, col]
            case "bottom":
                return [row + 1, col]
            case "left":
                return [row, col - 1]
            case "right":
                return [row, col + 1]
        }
    }

    // Helper: Pivot to the next direction in clockwise order
    const getNextDirection = (direction: Direction): Direction => {
        switch (direction) {
            case "top":
                return "right"
            case "right":
                return "bottom"
            case "bottom":
                return "left"
            case "left":
                return "top"
        }
    }

    // Helper: Check if a position is within bounds
    const isOutOfBounds = ([row, col]: [number, number]): boolean => row < 0 || row > maxY || col < 0 || col > maxX

    // While the guard is still in the bounds of the map
    while (true) {
        // Add the position to the traversed cell
        addTraversedCell(currentPosition)

        let nextPosition = getNextPosition(currentPosition, currentDirection)

        // Stop if the next position is out of bounds
        if (isOutOfBounds(nextPosition)) {
            break
        }

        // Pivot until the next position is not a wall
        while (walls[nextPosition[0]][nextPosition[1]]) {
            currentDirection = getNextDirection(currentDirection)
            nextPosition = getNextPosition(currentPosition, currentDirection)
        }

        // Save the position
        currentPosition = nextPosition

        // Display map state
        // console.log("---------------------")
        // displayMapState(walls, currentPosition, currentDirection, traversedCells)
    }

    console.log("---------------------")
    displayMapState(walls, currentPosition, currentDirection, traversedCells)

    // Count distinct positions
    return traversedCells.values().reduce((acc, val) => {
        return acc + val.values().reduce((acc) => acc + 1, 0)
    }, 0)
}

console.log(computeGuardPath(walls, guardPosition, guardDirection))

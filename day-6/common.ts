export type Direction = "top" | "right" | "bottom" | "left"

export const symbolToDirectionDict: Record<string, Direction> = {
    "^": "top",
    ">": "right",
    "v": "bottom",
    "<": "left",
}

export const directionToSymbolDict = Object.fromEntries(
    Object.entries(symbolToDirectionDict).map(([key, value]) => [value, key]),
) as Record<Direction, string>

export function displayMapState(
    walls: boolean[][],
    guardPosition: [number, number],
    guardDirection: Direction,
    traversedCells: [number, number][],
) {
    console.log(walls[0].map(() => "-").join(""))
    walls.forEach((row, rowIndex) => {
        const displayedLine = row
            .map((isWall, columnIndex) => {
                if (guardPosition[0] === rowIndex && guardPosition[1] === columnIndex) {
                    return directionToSymbolDict[guardDirection]
                }

                if (traversedCells.some((c) => c[0] === rowIndex && c[1] === columnIndex)) {
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

export function getWallsAndGuardPositionDirection(rows: string[][]): [boolean[][], [number, number], Direction] {
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
    return [walls, guardPosition, guardDirection]
}

export function computeGuardPath(
    walls: boolean[][],
    initialGuardPosition: [number, number],
    initialGuardDirection: Direction,
): [[number, number][], boolean] {
    const maxY = walls.length - 1
    const maxX = walls[0].length - 1

    let currentPosition: [number, number] = [...initialGuardPosition]
    let currentDirection = initialGuardDirection

    const traversedCells: [number, number][] = []

    function addTraversedCell(pos: [number, number]) {
        if (!traversedCells.some((c) => c[0] === pos[0] && c[1] === pos[1])) {
            traversedCells.push(pos)
        }
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
    let isLoop = false
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

        // Stop if it's a loop
        const alreadyTraversedCellIndex = traversedCells.findIndex((cell) =>
            currentPosition[0] === cell[0] && currentPosition[1] === cell[1]
        )
        if (alreadyTraversedCellIndex !== 1 && alreadyTraversedCellIndex + 1 < traversedCells.length) {
            const nextCell = traversedCells[alreadyTraversedCellIndex + 1]
            if (nextCell[0] === nextPosition[0] && nextCell[1] === nextPosition[1]) {
                isLoop = true
                break
            }
        }

        // Save the position
        currentPosition = nextPosition

        // Display map state
        // displayMapState(walls, currentPosition, currentDirection, traversedCells)
    }

    // displayMapState(walls, currentPosition, currentDirection, traversedCells)

    // Count distinct positions
    return [traversedCells, isLoop]
}

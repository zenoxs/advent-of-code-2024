export type CellGrid = Map<number, Set<number>>

export function mergeCellGrids(cellGrid1: CellGrid, cellGrid2: CellGrid) {
    const mergedMap = new Map<number, Set<number>>()

    // Merge entries from set1
    for (const [key, valueSet] of cellGrid1.entries()) {
        mergedMap.set(key, new Set(valueSet)) // Clone the set to avoid mutations
    }

    // Merge entries from set2
    for (const [key, valueSet] of cellGrid2.entries()) {
        if (!mergedMap.has(key)) {
            // If key doesn't exist in mergedMap, add it
            mergedMap.set(key, new Set(valueSet))
        } else {
            // If key exists, merge the sets
            const existingSet = mergedMap.get(key)!
            valueSet.forEach((value) => existingSet.add(value))
        }
    }

    return mergedMap
}

export function getOrInitializeCellGrid(map: CellGrid, y: number): Set<number> {
    if (!map.has(y)) {
        map.set(y, new Set())
    }
    return map.get(y)!
}

function rotate90<T>(matrix: T[][]) {
    const n = matrix.length
    const rotated: T[][] = []
    for (let i = 0; i < n; i++) {
        rotated.push([])
        for (let j = 0; j < n; j++) {
            rotated[i][j] = matrix[n - j - 1][i]
        }
    }
    return rotated
}

// Function to generate all rotations
export function generateAllRotations<T>(matrix: T[][]) {
    const rotations: T[][][] = []
    let currentMatrix = matrix
    for (let i = 0; i < 4; i++) {
        rotations.push(currentMatrix)
        currentMatrix = rotate90(currentMatrix)
    }
    return rotations
}

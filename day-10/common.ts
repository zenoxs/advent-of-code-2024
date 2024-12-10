import { Vector } from "vecti"

export function areVectorsEqual(v1: Vector, v2: Vector): boolean {
    return v1.x === v2.x && v1.y === v2.y
}

export function arePathsEqual(path1: Vector[], path2: Vector[]): boolean {
    if (path1.length !== path2.length) return false
    return path1.every((vector, index) => areVectorsEqual(vector, path2[index]))
}

export function hasDuplicatePaths(validPaths: Vector[][]): boolean {
    for (let i = 0; i < validPaths.length; i++) {
        for (let j = i + 1; j < validPaths.length; j++) {
            if (arePathsEqual(validPaths[i], validPaths[j])) {
                return true // Duplicate found
            }
        }
    }
    return false // No duplicates
}

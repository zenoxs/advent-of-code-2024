export function splitIntoChunks(walls: boolean[][], chunkSize: number): boolean[][][] {
    const chunks = []
    for (let i = 0; i < walls.length; i += chunkSize) {
        chunks.push(walls.slice(i, i + chunkSize))
    }
    return chunks
}

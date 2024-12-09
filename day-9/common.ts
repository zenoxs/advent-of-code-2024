export function buildDiskMap(data: number[]) {
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

    return diskMap
}

export function checksum(diskMap: (number | null)[]) {
    return diskMap.reduce<number>((total, fileId, index) => {
        return total + (fileId ?? 0) * index
    }, 0)
}

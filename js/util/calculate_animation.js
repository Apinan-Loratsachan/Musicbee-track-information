function calculateAnimation(string, division) {
    const result = Math.round((string.length / division + Number.EPSILON) * 100) / 100
    if (result >= 4) {
        return result
    }
    else {
        return 4
    }
}
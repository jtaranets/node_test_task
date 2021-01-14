function clearEmpties(o: any) {
    Object.keys(o).forEach((key: string) => {
        if (!o[key] || typeof o[key] !== "object") {
            return;
        }
        clearEmpties(o[key]);
        if (Object.keys(o[key]).length === 0) {
            delete o[key];
        }
    })
    return o;
}

module.exports = {
    clearEmpties
}

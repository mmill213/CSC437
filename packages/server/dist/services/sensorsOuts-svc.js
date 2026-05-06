const zones = {
    "Zone 1": {
        name: "Zone 1",
        wateringLog: [27, 53, 71, 3],
        lastWatered: 27,
        moisture: 37,
        temperature: 47,
        shouldWater: "Yes"
    }
};
function get(name) {
    return zones[name];
}
export default { get };

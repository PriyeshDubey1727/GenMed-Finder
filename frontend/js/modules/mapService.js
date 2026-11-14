/* =================================
   GENMED FINDER - MAP SERVICE
==================================== */

let kendraMap = null;

export function initializeMap(latitude, longitude) {

    if (kendraMap !== null) {
        kendraMap.remove();
    }

    kendraMap = L.map("kendra-map").setView(
        [latitude, longitude],
        13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(kendraMap);

    return kendraMap;
}
export function addUserMarker(latitude, longitude) {

    if (kendraMap === null) {
        return;
    }

    const userMarker = L.circleMarker(
        [latitude, longitude],
        {
            radius: 9,
            color: "#ffffff",
            weight: 3,
            fillColor: "#2563eb",
            fillOpacity: 1
        }
    );

    userMarker.addTo(kendraMap);

    userMarker.bindPopup("Your Current Location");

}
export function addKendraMarkers(kendras) {

    if (kendraMap === null) {
        return;
    }

    kendras.forEach(function (kendra) {

        if (
            typeof kendra.latitude !== "number" ||
            typeof kendra.longitude !== "number"
        ) {
            return;
        }

        const marker = L.marker([
            kendra.latitude,
            kendra.longitude
        ]);

        marker.addTo(kendraMap);

        marker.bindPopup(`
            <strong>${kendra.name || "Jan Aushadhi Kendra"}</strong>
            <br>
            Store Code: ${kendra.storeCode || "Unavailable"}
            <br>
            Address: ${kendra.address || "Unavailable"}
        `);

    });
}
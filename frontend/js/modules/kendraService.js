
/* =================================
   KENDRA SERVICE
==================================== */

const KENDRA_DATA_URL = "../database/kendras/kendras.json";

// Load Kendra records

export async function loadKendras() {

    try {

        const response = await fetch(KENDRA_DATA_URL);

        if (!response.ok) {
            throw new Error("Unable to load Kendra data");
        }

        const data = await response.json();

        return data.kendras;

    } catch (error) {

        console.error("Kendra loading error:", error);

        return [];

    }
}

// Search Kendras by pincode, district or state

export function searchKendras(kendras, searchText) {

    const searchValue = searchText.trim().toLowerCase();

    if (searchValue === "") {
        return [];
    }

    const results = kendras.filter(function (kendra) {

        const pincode = (kendra.pincode || "").toString();
        const district = (kendra.district || "").toLowerCase();
        const state = (kendra.state || "").toLowerCase();

        return (
            pincode.includes(searchValue) ||
            district.includes(searchValue) ||
            state.includes(searchValue)
        );

    });

    return results;
}

/* =================================
   DISTANCE CALCULATION
==================================== */

// Calculate distance between two geographical points

export function calculateDistance(lat1, lon1, lat2, lon2) {

    const earthRadius = 6371;

    const latitudeDifference = (lat2 - lat1) * Math.PI / 180;
    const longitudeDifference = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const centralAngle = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    const distance = earthRadius * centralAngle;

    return Number(distance.toFixed(2));

}
export function findNearbyKendras(
    kendras,
    userLatitude,
    userLongitude,
    maxDistance = 10
) {
    const nearbyKendras = [];

    kendras.forEach(function (kendra) {
        if (
            typeof kendra.latitude !== "number" ||
            typeof kendra.longitude !== "number"
        ) {
            return;
        }

        const distance = calculateDistance(
            userLatitude,
            userLongitude,
            kendra.latitude,
            kendra.longitude
        );

        const nearbyKendra = {
            ...kendra,
            distance: distance
        };
        if (distance <= maxDistance) {
            nearbyKendras.push(nearbyKendra);
        }
    });

    nearbyKendras.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return nearbyKendras;
}
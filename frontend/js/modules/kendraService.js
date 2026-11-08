
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

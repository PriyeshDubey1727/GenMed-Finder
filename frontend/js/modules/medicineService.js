
/* =================================
   MEDICINE SERVICE
==================================== */

const MEDICINE_DATA_URL = "../database/medicines/medicines.json";

// Load medicine records

export async function loadMedicines() {

    try {

        const response = await fetch(MEDICINE_DATA_URL);

        if (!response.ok) {
            throw new Error("Unable to load medicine data");
        }

        const data = await response.json();

        return data.medicines;

    } catch (error) {

        console.error("Medicine loading error:", error);

        return [];

    }
}
// Search medicines by brand name, generic name or salt

export function searchMedicines(medicines, searchText) {

    const searchValue = searchText.toLowerCase().trim();

    if (searchValue === "") {
        return [];
    }

    const results = medicines.filter(function (medicine) {

        return (
            medicine.brandName.toLowerCase().includes(searchValue) ||
            medicine.genericName.toLowerCase().includes(searchValue) ||
            medicine.salt.toLowerCase().includes(searchValue)
        );

    });

    return results;
}
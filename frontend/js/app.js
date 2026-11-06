
import {
    loadMedicines,
    searchMedicines
} from "./modules/medicineService.js";

/* =================================
   GENMED FINDER - APPLICATION ENTRY
==================================== */

let medicines = [];

// Display search results

function displayMedicines(results) {

    const resultsContainer = document.getElementById("medicine-results");

    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.textContent = "No medicines found.";
        return;
    }

    results.forEach(function (medicine) {

        const card = document.createElement("div");
        card.classList.add("medicine-result-card");

        const name = document.createElement("h3");
        name.textContent = medicine.brandName;

        const generic = document.createElement("p");
        generic.textContent = "Generic Name: " + medicine.genericName;

        const strength = document.createElement("p");
        strength.textContent = "Strength: " + medicine.strength;

        const form = document.createElement("p");
        form.textContent = "Form: " + medicine.form;

        card.appendChild(name);
        card.appendChild(generic);
        card.appendChild(strength);
        card.appendChild(form);

        resultsContainer.appendChild(card);

    });
}

// Handle medicine search

function handleMedicineSearch() {

    const searchInput = document.getElementById("medicine-search");

    const searchText = searchInput.value.trim();

    if (searchText === "") {

        const resultsContainer = document.getElementById("medicine-results");

        resultsContainer.innerHTML = "";
        resultsContainer.textContent = "Please enter a medicine name to search.";

        return;
    }

    const results = searchMedicines(medicines, searchText);

    displayMedicines(results);
}
// Initialize application

async function initializeApp() {

    console.log("GenMed Finder Application Started");

    medicines = await loadMedicines();

    console.log("Medicines loaded:", medicines);

    const searchButton = document.getElementById("search-medicine-btn");

    searchButton.addEventListener("click", handleMedicineSearch);
    const searchInput = document.getElementById("medicine-search");

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        handleMedicineSearch();
    }

});

}

document.addEventListener("DOMContentLoaded", initializeApp);

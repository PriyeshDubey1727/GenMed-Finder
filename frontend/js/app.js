import {
    initializeMap,
    addKendraMarkers,
    addUserMarker
} from "./modules/mapService.js";
import {
    loadKendras,
    searchKendras,
    calculateDistance,
    findNearbyKendras
} from "./modules/kendraService.js";
import { calculateSavings } from "./modules/priceService.js";
import {
    loadMedicines,
    searchMedicines
} from "./modules/medicineService.js";

/* =================================
   GENMED FINDER - APPLICATION ENTRY
==================================== */

let medicines = [];
let kendras = [];
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

        const brandPrice = document.createElement("p");

        if (typeof medicine.brandPrice === "number") {
            brandPrice.textContent = "Branded Price: ₹" + medicine.brandPrice;
        } else {
            brandPrice.textContent = "Branded Price: Unavailable";
        }
        const genericPrice = document.createElement("p");

        if (typeof medicine.genericPrice === "number") {
            genericPrice.textContent = "Generic Price: ₹" + medicine.genericPrice;
        } else {
            genericPrice.textContent = "Generic Price: Unavailable";
        }

        const savings = calculateSavings(
            medicine.brandPrice,
            medicine.genericPrice
        );

        const savingsInfo = document.createElement("p");

        if (savings !== null) {

            savingsInfo.textContent =
                "You Save: ₹" + savings.savings +
                " (" + savings.savingsPercentage + "%)";

        } else {

            savingsInfo.textContent = "Price comparison unavailable.";

        }

        card.appendChild(name);
        card.appendChild(generic);
        card.appendChild(strength);
        card.appendChild(form);
        card.appendChild(brandPrice);
        card.appendChild(genericPrice);
        card.appendChild(savingsInfo);
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

/* Display Kendra search results */

function displayKendras(results) {

    const resultsContainer = document.getElementById("kendra-results");

    resultsContainer.innerHTML = "";

    if (results.length === 0) {

        resultsContainer.textContent = "No Jan Aushadhi Kendras found.";

        return;
    }

    results.forEach(function (kendra) {

        const card = document.createElement("div");
        card.classList.add("kendra-result-card");

        const name = document.createElement("h3");
        name.textContent = kendra.name || "Jan Aushadhi Kendra";

        const storeCode = document.createElement("p");
        storeCode.textContent = "Store Code: " + (kendra.storeCode || "Unavailable");

        const address = document.createElement("p");
        address.textContent = "Address: " + (kendra.address || "Unavailable");

        const district = document.createElement("p");
        district.textContent = "District: " + (kendra.district || "Unavailable");

        const state = document.createElement("p");
        state.textContent = "State: " + (kendra.state || "Unavailable");

        const pincode = document.createElement("p");
        pincode.textContent = "Pincode: " + (kendra.pincode || "Unavailable");
        if (typeof kendra.distance === "number") {
            const distance = document.createElement("p");
            distance.textContent = "Distance: " + kendra.distance + " km";
            card.appendChild(distance);
        }

        card.appendChild(name);
        card.appendChild(storeCode);
        card.appendChild(address);
        card.appendChild(district);
        card.appendChild(state);
        card.appendChild(pincode);

        resultsContainer.appendChild(card);

    });
}

/* Handle Kendra search */

function handleKendraSearch() {

    const searchInput = document.getElementById("kendra-search-input");

    const searchText = searchInput.value.trim();

    const resultsContainer = document.getElementById("kendra-results");

    if (searchText === "") {

        resultsContainer.innerHTML = "";
        resultsContainer.textContent = "Please enter a pincode, district or state.";

        return;
    }

    const results = searchKendras(kendras, searchText);
    displayKendras(results);

}

// Initialize application

async function initializeApp() {

    console.log("GenMed Finder Application Started");

    medicines = await loadMedicines();

    console.log("Medicines loaded:", medicines);


    kendras = await loadKendras();

    console.log("Kendras loaded:", kendras);
    const searchButton = document.getElementById("search-medicine-btn");

    searchButton.addEventListener("click", handleMedicineSearch);
    const kendraSearchButton = document.getElementById("search-kendra-btn");
    const locationButton = document.getElementById("use-location-btn");

    locationButton.addEventListener("click", function () {

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        locationButton.textContent = "Getting Location...";
        const locationStatus = document.getElementById("location-status");
        locationStatus.textContent = "Getting your location...";
        navigator.geolocation.getCurrentPosition(
            function (position) {

                const userLatitude = position.coords.latitude;
                const userLongitude = position.coords.longitude;
                initializeMap(userLatitude, userLongitude);
                addUserMarker(userLatitude, userLongitude);

                const distanceFilter = document.getElementById("distance-filter");
                const maxDistance = Number(distanceFilter.value);

                const nearbyKendras = findNearbyKendras(
                    kendras,
                    userLatitude,
                    userLongitude,
                    maxDistance
                );

                displayKendras(nearbyKendras);
                addKendraMarkers(nearbyKendras);
                if (nearbyKendras.length === 0) {
                    locationStatus.textContent =
                        "No Kendras found within the selected distance.";
                } else {
                    locationStatus.textContent =
                        nearbyKendras.length + " Kendra(s) found nearby.";
                }

                locationButton.textContent = "Use My Location";
            },

            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    locationStatus.textContent = "Location access denied. Please allow location permission.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    locationStatus.textContent = "Your location is currently unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    locationStatus.textContent = "Location request timed out. Please try again.";
                } else {
                    locationStatus.textContent = "Unable to retrieve your location.";
                }

                locationButton.textContent = "Use My Location";
            }
        );

    });

    kendraSearchButton.addEventListener("click", handleKendraSearch);
    const searchInput = document.getElementById("medicine-search");

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            handleMedicineSearch();
        }

    });

}

document.addEventListener("DOMContentLoaded", initializeApp);

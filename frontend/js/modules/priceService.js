
/* =================================
   PRICE SERVICE
==================================== */

// Calculate medicine price savings

export function calculateSavings(brandPrice, genericPrice) {

    if (
        typeof brandPrice !== "number" ||
        typeof genericPrice !== "number" ||
        brandPrice <= 0 ||
        genericPrice <= 0
    ) {
        return null;
    }

    const savings = brandPrice - genericPrice;

    const savingsPercentage = (savings / brandPrice) * 100;

    return {
        savings: Number(savings.toFixed(2)),
        savingsPercentage: Number(savingsPercentage.toFixed(2))
    };

}

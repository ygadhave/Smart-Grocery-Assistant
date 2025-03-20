export const processExtractedText = (text, setExtractedItems) => {
    const lines = text.split("\n");
    const groceryItems = [];
    let lastItem = { name: "", quantity: "1", unit: "pcs" };

    lines.forEach(line => {
        const itemMatch = line.match(/([A-Z0-9\s]+)\s+(RJ)?\s*([\d.]+)/);
        const weightMatch = line.match(/([\d.]+)\s*(kg|lb|g)/i);
        const priceWeightMatch = line.match(/([\d.]+)\s*kg\s*@\s*\$\d+\/kg/i);

        if (itemMatch) {
            let name = itemMatch[1].trim();
            let quantity = weightMatch ? weightMatch[1] : "1";
            let unit = weightMatch ? weightMatch[2].toLowerCase() : "pcs";

            if (lastItem.name && priceWeightMatch) {
                lastItem.quantity = priceWeightMatch[1];
                lastItem.unit = "kg";
                groceryItems.push({ ...lastItem });
                lastItem = { name: "", quantity: "1", unit: "pcs" };
            } else {
                lastItem = { name, quantity, unit };
            }

            const unwantedWords = ["SUBTOTAL", "TOTAL", "GST", "TRANSACTION", "REUSE BAG"];
            if (!unwantedWords.some(word => name.includes(word))) {
                groceryItems.push({ name, quantity, unit });
            }
        }
    });

    console.log("Extracted Grocery Items:", groceryItems);
    setExtractedItems(groceryItems);
};

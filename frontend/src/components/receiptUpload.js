import React, { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ReceiptUpload = ({ setExtractedItems }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) return;

        setUploadStatus("Processing...");
        Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) })
            .then(({ data: { text } }) => {
                processExtractedText(text);
                setUploadStatus("Extracted text successfully!");
            })
            .catch(error => {
                console.error("Error extracting text:", error);
                setUploadStatus("Error processing receipt.");
            });
    };

    const processExtractedText = (text) => {
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

        setExtractedItems(groceryItems);
    };

    const handleSaveToDB = async () => {
        if (!file || !setExtractedItems) return;

        const formData = new FormData();
        formData.append("receipt", file);
        formData.append("items", JSON.stringify(setExtractedItems));

        try {
            await axios.post(`${API_URL}/receipts`, formData);
            setUploadStatus("Saved to database!");
        } catch (error) {
            console.error("Error saving receipt:", error);
            setUploadStatus("Failed to save receipt.");
        }
    };

    return (
        <div>
            <h2>Upload a Receipt</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Extract Text</button>
            <button onClick={handleSaveToDB}>Save to Database</button>
            <p>{uploadStatus}</p>
        </div>
    );
};

export default ReceiptUpload;

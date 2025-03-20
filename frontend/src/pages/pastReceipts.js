import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_ENDPOINT; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const guest = localStorage.getItem("guest");
  return guest === "true" ? { "x-guest": "true" } : { Authorization: `Bearer ${token}` };
};

const PastReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [extractedItems, setExtractedItems] = useState([]);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await axios.get(`${API_URL}/receipts`, {
                headers: getAuthHeaders()
            });
            setReceipts(response.data);
        } catch (error) {
            console.error("Error fetching receipts:", error);
        }
    };

    const fetchExtractedItems = async (receiptId) => {
        try {
            const response = await axios.get(`${API_URL}/receipts/${receiptId}/items`, {
                headers: getAuthHeaders()
            });
            setExtractedItems(response.data);
            setSelectedReceipt(receiptId);
        } catch (error) {
            console.error("Error fetching extracted items:", error);
        }
    };

    const deleteReceipt = async (receiptId) => {
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            try {
                await axios.delete(`${API_URL}/receipts/${receiptId}`, {
                    headers: getAuthHeaders()
                });
                fetchReceipts();
                if (receiptId === selectedReceipt) {
                    setSelectedReceipt(null);
                    setExtractedItems([]);
                }
            } catch (error) {
                console.error("Error deleting receipt:", error);
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Past Receipts</h1>
            <div>
                <h2>Uploaded Receipts</h2>
                <ul>
                    {receipts.map((receipt) => (
                        <li key={receipt.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                            <button onClick={() => fetchExtractedItems(receipt.id)}>
                                View Receipt (Uploaded: {new Date(receipt.uploaded_at).toLocaleString()})
                            </button>
                            {" | "}
                            <a
                                href={`${API_URL.replace('/api', '')}/uploads/${receipt.filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Image
                            </a>
                            {" | "}
                            <button onClick={() => deleteReceipt(receipt.id)} style={{ color: "red" }}>
                                Delete Receipt
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedReceipt && extractedItems.length > 0 && (
                <div>
                    <h2>Extracted Items</h2>
                    <ul>
                        {extractedItems.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.quantity} {item.unit}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PastReceipts;

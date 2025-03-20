import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Link } from "react-router-dom";
import Tesseract from "tesseract.js";
import ReceiptUpload from "./components/receiptUpload";
import PastReceipts from "./pages/pastReceipts";
import { processExtractedText } from "./utils/receiptProcessor";

const API_URL = process.env.REACT_APP_API_ENDPOINT; 

function Home() {
    const [pantry, setPantry] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [extractedItems, setExtractedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      const guest = localStorage.getItem("guest");
      if (guest === "true") {
        return { "x-guest": "true" };
      }
      return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchPantry();
    }, []);

    const fetchPantry = () => {
        axios.get(`${API_URL}/pantry`, {
            headers: getAuthHeaders()
        })
        .then(response => setPantry(response.data))
        .catch(error => console.error("Error fetching pantry items:", error));
    };

    const addItem = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/pantry`, { name, quantity, unit }, {
            headers: getAuthHeaders()
        })
        .then(() => {
            fetchPantry();
            setName(""); 
            setQuantity(""); 
            setUnit("");
        })
        .catch(error => console.error("Error adding item:", error));
    };

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) })
                .then(({ data: { text } }) => {
                    processExtractedText(text, setExtractedItems);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error extracting text:", error);
                    setLoading(false);
                });
        }
    };

    const handleExtractedItem = (item) => {
        setName(item.name);
        setQuantity(item.quantity);
        setUnit(item.unit);
    };

    return (
        <div>
            <h1>Smart Grocery Assistant</h1>
            <ReceiptUpload setExtractedItems={setExtractedItems} />

            <h2>Pantry Items</h2>
            <ul>
                {pantry.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.quantity} {item.unit} 
                        <button onClick={() => setEditingId(item.id)}>Edit</button>
                        <button onClick={() => {
                            axios.delete(`${API_URL}/pantry/${item.id}`, {
                                headers: getAuthHeaders()
                            })
                            .then(fetchPantry);
                        }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={addItem}>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Unit (e.g., pieces, kg)"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    required
                />
                <button type="submit">Add to Pantry</button>
            </form>

            {loading && <p>Extracting items from receipt, please wait...</p>}

            {extractedItems.length > 0 && (
                <div>
                    <h3>Extracted Items:</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {extractedItems.map((item, index) => (
                            <div key={index} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                <strong>{item.name}</strong>
                                <p>{item.quantity} {item.unit}</p>
                                <button onClick={() => handleExtractedItem(item)}>Use This</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link> | <Link to="/past-receipts">Past Receipts</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/past-receipts" element={<PastReceipts />} />
            </Routes>
        </>
    );
}

export default App;

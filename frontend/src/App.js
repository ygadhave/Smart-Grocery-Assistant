import React, { useEffect, useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import ReceiptUpload from "./components/receiptUpload";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

function App() {
    const [pantry, setPantry] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);
    const [extractedItems, setExtractedItems] = useState([]);

  

    useEffect(() => {
        fetchPantry();
    }, []);

    const fetchPantry = () => {
        axios.get(`${API_URL}/pantry`)
            .then(response => setPantry(response.data))
            .catch(error => console.error("Error fetching pantry items:", error));
    };

    const addItem = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/pantry`, { name, quantity, unit })
            .then(() => {
                fetchPantry();
                setName(""); setQuantity(""); setUnit("");
            })
            .catch(error => console.error("Error adding item:", error));
    };

    const handleReceiptUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          setReceiptImage(file); 
  
          Tesseract.recognize(
              file,
              "eng",
              { logger: (m) => console.log(m) }
          ).then(({ data: { text } }) => {
              processExtractedText(text);
          }).catch(error => {
              console.error("Error extracting text:", error);
          });
      }
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
  
      console.log("Extracted Grocery Items:", groceryItems);
      setExtractedItems(groceryItems);
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
                        <button onClick={() => setEditingId(item.id)}>Edit this item</button>
                        <button onClick={() => axios.delete(`${API_URL}/pantry/${item.id}`).then(fetchPantry)}>Remove from pantry</button>
                    </li>
                ))}
            </ul>

            <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={addItem}>
                <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                <input type="text" placeholder="Unit (e.g., pieces, kg)" value={unit} onChange={e => setUnit(e.target.value)} required />
                <button type="submit">Add to Pantry</button>
            </form>

            {extractedItems.length > 0 && (
                <div>
                    <h3>Extracted Items:</h3>
                    <ul>
                        {extractedItems.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.quantity} {item.unit}
                                <button onClick={() => handleExtractedItem(item)}>Use This</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;

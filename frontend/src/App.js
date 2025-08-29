// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Route, Routes, Link } from "react-router-dom";
// import Tesseract from "tesseract.js";
// import ReceiptUpload from "./components/receiptUpload";
// import PastReceipts from "./pages/pastReceipts";
// import { processExtractedText } from "./utils/receiptProcessor";

// const API_URL = process.env.REACT_APP_API_ENDPOINT; 

// function Home() {
//     const [pantry, setPantry] = useState([]);
//     const [name, setName] = useState("");
//     const [quantity, setQuantity] = useState("");
//     const [unit, setUnit] = useState("");
//     const [editingId, setEditingId] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const getAuthHeaders = () => {
//       const token = localStorage.getItem("token");
//       const guest = localStorage.getItem("guest");
//       if (guest === "true") {
//         return { "x-guest": "true" };
//       }
//       return { Authorization: `Bearer ${token}` };
//     };

//     useEffect(() => {
//         fetchPantry();
//     }, []);

//     const fetchPantry = () => {
//         axios.get(`${API_URL}/pantry`, {
//             headers: getAuthHeaders()
//         })
//         .then(response => setPantry(response.data))
//         .catch(error => console.error("Error fetching pantry items:", error));
//     };

//     const addItem = (e) => {
//         e.preventDefault();
//         axios.post(`${API_URL}/pantry`, { name, quantity, unit }, {
//             headers: getAuthHeaders()
//         })
//         .then(() => {
//             fetchPantry();
//             setName(""); 
//             setQuantity(""); 
//             setUnit("");
//         })
//         .catch(error => console.error("Error adding item:", error));
//     };

//     const handleReceiptUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setLoading(true);
//             Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) })
//                 .then(({ data: { text } }) => {
//                     processExtractedText(text, setExtractedItems);
//                     setLoading(false);
//                 })
//                 .catch(error => {
//                     console.error("Error extracting text:", error);
//                     setLoading(false);
//                 });
//         }
//     };

//     const handleExtractedItem = (item) => {
//         setName(item.name);
//         setQuantity(item.quantity);
//         setUnit(item.unit);
//     };

//     return (
//         <div>
//             <h1>Smart Grocery Assistant</h1>
//             <ReceiptUpload setExtractedItems={setExtractedItems} />

//             <h2>Pantry Items</h2>
//             <ul>
//                 {pantry.map(item => (
//                     <li key={item.id}>
//                         {item.name} - {item.quantity} {item.unit} 
//                         <button onClick={() => setEditingId(item.id)}>Edit</button>
//                         <button onClick={() => {
//                             axios.delete(`${API_URL}/pantry/${item.id}`, {
//                                 headers: getAuthHeaders()
//                             })
//                             .then(fetchPantry);
//                         }}>
//                             Remove
//                         </button>
//                     </li>
//                 ))}
//             </ul>

//             <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
//             <form onSubmit={addItem}>
//                 <input
//                     type="text"
//                     placeholder="Item Name"
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={quantity}
//                     onChange={e => setQuantity(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="text"
//                     placeholder="Unit (e.g., pieces, kg)"
//                     value={unit}
//                     onChange={e => setUnit(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Add to Pantry</button>
//             </form>

//             {loading && <p>Extracting items from receipt, please wait...</p>}

//             {extractedItems.length > 0 && (
//                 <div>
//                     <h3>Extracted Items:</h3>
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
//                         {extractedItems.map((item, index) => (
//                             <div key={index} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
//                                 <strong>{item.name}</strong>
//                                 <p>{item.quantity} {item.unit}</p>
//                                 <button onClick={() => handleExtractedItem(item)}>Use This</button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function App() {
//     return (
//         <>
//             <nav>
//                 <Link to="/">Home</Link> | <Link to="/past-receipts">Past Receipts</Link>
//             </nav>

//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/past-receipts" element={<PastReceipts />} />
//             </Routes>
//         </>
//     );
// }

// export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import ReceiptUpload from "./components/receiptUpload";
import PastReceipts from "./pages/pastReceipts";
import { processExtractedText } from "./utils/receiptProcessor";
import { ShoppingBasket, Plus, Edit2, Trash2, Receipt, LogOut } from "lucide-react";

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
    return guest === "true"
      ? { "x-guest": "true" }
      : { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = () => {
    axios
      .get(`${API_URL}/pantry`, { headers: getAuthHeaders() })
      .then((response) => setPantry(response.data))
      .catch((error) => console.error("Error fetching pantry items:", error));
  };

  const addItem = (e) => {
    e.preventDefault();
    axios
      .post(
        `${API_URL}/pantry`,
        { name, quantity, unit },
        { headers: getAuthHeaders() }
      )
      .then(() => {
        fetchPantry();
        setName("");
        setQuantity("");
        setUnit("");
      })
      .catch((error) => console.error("Error adding item:", error));
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
        .catch((error) => {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <ShoppingBasket className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Smart Grocery Assistant
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full p-2 border rounded"
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-field w-full p-2 border rounded"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input-field w-full p-2 border rounded"
                  placeholder="e.g., pieces, kg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center space-x-2 bg-emerald-600 text-white rounded-lg px-4 py-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add to Pantry</span>
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Pantry Items</h2>
          <div className="space-y-2">
            {pantry.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600 ml-2">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      axios
                        .delete(`${API_URL}/pantry/${item.id}`, {
                          headers: getAuthHeaders(),
                        })
                        .then(fetchPantry);
                    }}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {pantry.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items in pantry
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ReceiptUpload setExtractedItems={setExtractedItems} />

        {loading && (
          <div className="text-center py-4 text-gray-600">
            Extracting items from receipt, please wait...
          </div>
        )}

        {extractedItems.length > 0 && (
          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-4">Extracted Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {extractedItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-800 mb-2">
                    {item.name}
                  </div>
                  <div className="text-gray-600 mb-3">
                    {item.quantity} {item.unit}
                  </div>
                  <button
                    onClick={() => handleExtractedItem(item)}
                    className="w-full btn-secondary bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors duration-200"
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
    navigate("/");
  };

  return (
    <div className="min-h-screen app-container">
      <nav className="bg-white shadow-sm w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/home"
              className="flex items-center space-x-2 text-gray-800 hover:text-emerald-600"
            >
              <ShoppingBasket className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/past-receipts"
              className="flex items-center space-x-2 text-gray-800 hover:text-emerald-600"
            >
              <Receipt className="w-5 h-5" />
              <span>Past Receipts</span>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-800 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/past-receipts" element={<PastReceipts />} />
      </Routes>
    </div>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_ENDPOINT; 

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   const guest = localStorage.getItem("guest");
//   return guest === "true" ? { "x-guest": "true" } : { Authorization: `Bearer ${token}` };
// };

// const PastReceipts = () => {
//     const [receipts, setReceipts] = useState([]);
//     const [selectedReceipt, setSelectedReceipt] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);

//     useEffect(() => {
//         fetchReceipts();
//     }, []);

//     const fetchReceipts = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/receipts`, {
//                 headers: getAuthHeaders()
//             });
//             setReceipts(response.data);
//         } catch (error) {
//             console.error("Error fetching receipts:", error);
//         }
//     };

//     const fetchExtractedItems = async (receiptId) => {
//         try {
//             const response = await axios.get(`${API_URL}/receipts/${receiptId}/items`, {
//                 headers: getAuthHeaders()
//             });
//             setExtractedItems(response.data);
//             setSelectedReceipt(receiptId);
//         } catch (error) {
//             console.error("Error fetching extracted items:", error);
//         }
//     };

//     const deleteReceipt = async (receiptId) => {
//         if (window.confirm("Are you sure you want to delete this receipt?")) {
//             try {
//                 await axios.delete(`${API_URL}/receipts/${receiptId}`, {
//                     headers: getAuthHeaders()
//                 });
//                 fetchReceipts();
//                 if (receiptId === selectedReceipt) {
//                     setSelectedReceipt(null);
//                     setExtractedItems([]);
//                 }
//             } catch (error) {
//                 console.error("Error deleting receipt:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: "20px" }}>
//             <h1>Past Receipts</h1>
//             <div>
//                 <h2>Uploaded Receipts</h2>
//                 <ul>
//                     {receipts.map((receipt) => (
//                         <li key={receipt.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
//                             <button onClick={() => fetchExtractedItems(receipt.id)}>
//                                 View Receipt (Uploaded: {new Date(receipt.uploaded_at).toLocaleString()})
//                             </button>
//                             {" | "}
//                             <a
//                                 href={`${API_URL.replace('/api', '')}/uploads/${receipt.filename}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >
//                                 View Image
//                             </a>
//                             {" | "}
//                             <button onClick={() => deleteReceipt(receipt.id)} style={{ color: "red" }}>
//                                 Delete Receipt
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {selectedReceipt && extractedItems.length > 0 && (
//                 <div>
//                     <h2>Extracted Items</h2>
//                     <ul>
//                         {extractedItems.map((item) => (
//                             <li key={item.id}>
//                                 {item.name} - {item.quantity} {item.unit}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PastReceipts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Eye, Image, Trash2, Receipt, Package } from "lucide-react";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const guest = localStorage.getItem("guest");
  return guest === "true"
    ? { "x-guest": "true" }
    : { Authorization: `Bearer ${token}` };
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
        headers: getAuthHeaders(),
      });
      setReceipts(response.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  };

  const fetchExtractedItems = async (receiptId) => {
    try {
      const response = await axios.get(`${API_URL}/receipts/${receiptId}/items`, {
        headers: getAuthHeaders(),
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
          headers: getAuthHeaders(),
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Receipt className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-800">Past Receipts</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
            Uploaded Receipts
          </h2>

          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Uploaded: {new Date(receipt.uploaded_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => fetchExtractedItems(receipt.id)}
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Items</span>
                  </button>

                  <a
                    href={`${API_URL.replace("/api", "")}/uploads/${receipt.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Image className="w-4 h-4" />
                    <span>View Image</span>
                  </a>

                  <button
                    onClick={() => deleteReceipt(receipt.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {receipts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No receipts uploaded yet
              </div>
            )}
          </div>
        </div>

        {/* Extracted Items Card */}
        {selectedReceipt && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-emerald-600" />
              Extracted Items
            </h2>

            <div className="space-y-2">
              {extractedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}

              {extractedItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items found in this receipt
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastReceipts;

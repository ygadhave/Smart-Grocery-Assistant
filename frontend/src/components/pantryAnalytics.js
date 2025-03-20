import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const PantryAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pantry/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3 style={{ marginBottom: "10px" }}>Pantry Analytics</h3>
      {analytics.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Category</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Item Count</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Average Quantity</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((data, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{data.category || "Uncategorized"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{data.count}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{parseFloat(data.avg_quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No analytics available.</p>
      )}
    </div>
  );
};

export default PantryAnalytics;

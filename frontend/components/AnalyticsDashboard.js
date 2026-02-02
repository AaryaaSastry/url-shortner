import { useState } from "react";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [shortCode, setShortCode] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setAnalytics(null);

    if (!shortCode) return setError("Enter short code");

    try {
      const res = await axios.get(
        `http://localhost:3000/analytics/${shortCode}`
      );
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <input
        type="text"
        placeholder="Enter short code"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
      />
      <button onClick={handleFetch}>Get Analytics</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analytics && (
        <div>
          <p>Original URL: {analytics.originalUrl}</p>
          <p>Short Code: {analytics.shortCode}</p>
          <p>Total Clicks: {analytics.totalClicks}</p>
          <p>Created At: {new Date(analytics.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

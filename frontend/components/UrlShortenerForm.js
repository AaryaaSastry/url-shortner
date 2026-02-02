import { useState } from "react";
import axios from "axios";

const UrlShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!originalUrl) return setError("Please enter a URL");

    try {
      const res = await axios.post("http://localhost:3000/shorten", {
        originalUrl,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </div>
  );
};

export default UrlShortenerForm;

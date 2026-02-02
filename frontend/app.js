import UrlShortenerForm from "./components/UrlShortenerForm";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <UrlShortenerForm />
      <hr />
      <AnalyticsDashboard />
    </div>
  );
}

export default App;

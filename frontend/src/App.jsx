import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EventFeed from "./pages/EventFeed";
import EventDetail from "./pages/EventDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/events" element={<EventFeed />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/profiles/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

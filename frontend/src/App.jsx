import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EventFeed from "./pages/EventFeed";
import EventDetail from "./pages/EventDetail";

// Volunteer Pages
import { VolunteerDashboard, Notifications } from "./pages/volunteer";

// Manager Pages
import {
  ManagerDashboard,
  EventManagement,
  ParticipantManagement,
  EventForm,
} from "./pages/manager";

// Admin Pages
import {
  AdminDashboard,
  AdminEventManagement,
  UserManagement,
  DataExport,
} from "./pages/admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />

        {/* Volunteer Routes */}
        <Route path="/dashboard" element={<VolunteerDashboard />} />
        <Route path="/events" element={<EventFeed />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profiles/:username" element={<Profile />} />

        {/* Manager Routes */}
        <Route path="/manage" element={<ManagerDashboard />} />
        <Route path="/manage/events" element={<EventManagement />} />
        <Route path="/manage/events/new" element={<EventForm />} />
        <Route path="/manage/events/:eventId/edit" element={<EventForm />} />
        <Route path="/manage/events/:eventId/participants" element={<ParticipantManagement />} />
        <Route path="/manage/participants" element={<ParticipantManagement />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEventManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/export" element={<DataExport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


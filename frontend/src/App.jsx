import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EventFeed from "./pages/EventFeed";
import EventDetail from "./pages/EventDetail";

// Volunteer Pages
import { VolunteerDashboard, Notifications } from "./pages/volunteer";

// Settings Pages
import { Settings, ChangePassword, ProfileSettings } from "./pages/settings";

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/signin" element={<Auth />} />
          <Route path="/explore" element={<EventFeed />} />
          <Route path="/events/:eventId" element={<EventDetail />} />


          {/* Protected Volunteer Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/profiles/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Settings Routes */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/settings/profile" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/settings/change-password" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />


          {/* Protected Manager Routes */}
          <Route path="/manage" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manage/events" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <EventManagement />
            </ProtectedRoute>
          } />
          <Route path="/manage/events/new" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/manage/events/:eventId/edit" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/manage/events/:eventId/participants" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <ParticipantManagement />
            </ProtectedRoute>
          } />
          <Route path="/manage/participants" element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
              <ParticipantManagement />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminEventManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/export" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <DataExport />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;




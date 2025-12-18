import { useState } from "react";
import { Box } from "@mui/material";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Sidebar from "./Sidebar";
import { mockUsers } from "../../../data/mockData";

/**
 * AppLayout component - main layout wrapper
 * @param {string} variant - "public" | "app" | "dashboard"
 * @param {string} role - "guest" | "volunteer" | "manager" | "admin"
 * @param {object} user - User object or null for guests
 */
const AppLayout = ({
  children,
  variant = "app",
  role = "volunteer",
  user = mockUsers[0],
  showSearch = true,
  searchQuery = "",
  onSearchChange,
  showSidebar = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Determine if user is authenticated
  const isAuthenticated = !!user;
  const effectiveRole = isAuthenticated ? role : "guest";

  // Public layout (landing pages - no sidebar)
  if (variant === "public") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppHeader
          user={null}
          showSearch={false}
        />
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
        <AppFooter variant="full" />
      </Box>
    );
  }

  // Dashboard layout (with sidebar)
  if (variant === "dashboard") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppHeader
          user={user}
          showSearch={showSearch}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <Box sx={{ display: "flex", flex: 1 }}>
          <Sidebar role={effectiveRole} user={user} open={sidebarOpen && showSidebar} />
          <Box
            component="main"
            sx={{
              flex: 1,
              backgroundColor: "#f5f7fa",
              minHeight: "calc(100vh - 70px)",
              p: 3,
              transition: "margin 0.3s ease",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    );
  }

  // App layout (with sidebar for event browsing etc.)
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader
        user={user}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <Box sx={{ display: "flex", flex: 1 }}>
        {showSidebar && (
          <Sidebar role={effectiveRole} user={user} open={sidebarOpen} />
        )}
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: "#f5f7fa",
          }}
        >
          {children}
        </Box>
      </Box>
      <AppFooter variant="minimal" />
    </Box>
  );
};

export default AppLayout;

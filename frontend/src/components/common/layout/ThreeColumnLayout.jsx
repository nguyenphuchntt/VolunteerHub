import { useState } from "react";
import { Box, Drawer, IconButton, useMediaQuery, useTheme, AppBar, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import LeftNav from "./LeftNav";
import RightSidebar from "./RightSidebar";

const DRAWER_WIDTH = 280;

/**
 * X-style 3-column layout extended for Responsiveness
 * - Desktop (lg+): Left (280px) | Center (flexible) | Right (350px)
 * - Tablet (md): Left (280px) | Center (flexible)
 * - Mobile (xs/sm): Drawer (LeftNav) | Center (flexible)
 */
const ThreeColumnLayout = ({
  children,
  user = null,
  role = "guest",
  showRightSidebar = true,
  showSearch = true,
  searchQuery = "",
  onSearchChange,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // > 1200px
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900px - 1200px
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Content for the drawer (LeftNav)
  const drawerContent = (
    <LeftNav user={user} role={role} isMobile={true} />
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: 1440, // Increased max width for better large screen use
        mx: "auto",
        flexDirection: isMobile ? "column" : "row", // Stack on mobile
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            backgroundColor: "white", 
            borderBottom: "1px solid", 
            borderColor: "grey.200",
            color: "text.primary" 
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
              <Typography variant="h6" fontWeight={700} color="primary">
                VolunteerHub
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Left Navigation */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" } // Hide on mobile, show on md+
        }}
      >
        <LeftNav user={user} role={role} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Center Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0, // Prevent flex item from overflowing
          borderRight: (showRightSidebar && isDesktop) ? "1px solid" : "none",
          borderColor: "grey.200",
          p: 0, // Padding usually handled by children, but check standard
        }}
      >
        {children}
      </Box>

      {/* Right Sidebar - Desktop Only */}
      {showRightSidebar && isDesktop && (
        <RightSidebar
          showSearch={showSearch}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      )}
    </Box>
  );
};

export default ThreeColumnLayout;

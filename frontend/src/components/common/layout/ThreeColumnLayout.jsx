import { Box } from "@mui/material";
import LeftNav from "./LeftNav";
import RightSidebar from "./RightSidebar";

/**
 * X-style 3-column layout
 * - Left: Navigation (280px)
 * - Center: Content (flexible)
 * - Right: Sidebar (350px)
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
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: 1280,
        mx: "auto",
      }}
    >
      {/* Left Navigation */}
      <LeftNav user={user} role={role} />

      {/* Center Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          borderRight: showRightSidebar ? "1px solid" : "none",
          borderColor: "grey.200",
        }}
      >
        {children}
      </Box>

      {/* Right Sidebar */}
      {showRightSidebar && (
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

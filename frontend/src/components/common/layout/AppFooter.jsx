import { Box, Typography, Link, Container, Grid, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

/**
 * Unified AppFooter component with two variants:
 * - "full": Complete footer with links for landing pages
 * - "minimal": Simple footer for app pages
 */
const AppFooter = ({ variant = "minimal" }) => {
  const currentYear = new Date().getFullYear();

  // Minimal variant - simple footer for app pages
  if (variant === "minimal") {
    return (
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 4,
          mt: 4,
          borderTop: "1px solid",
          borderColor: "grey.200",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
          <Link href="#about" underline="hover" color="text.secondary" fontSize={14}>
            Giới thiệu
          </Link>
          <Typography color="text.secondary" fontSize={14}>•</Typography>
          <Link href="#help" underline="hover" color="text.secondary" fontSize={14}>
            Trợ giúp
          </Link>
          <Typography color="text.secondary" fontSize={14}>•</Typography>
          <Link href="#privacy" underline="hover" color="text.secondary" fontSize={14}>
            Chính sách & Điều khoản
          </Link>
        </Box>
        <Typography variant="caption" color="text.secondary">
          © {currentYear} VolunteerHub. All rights reserved.
        </Typography>
      </Box>
    );
  }

  // Full variant - complete footer for landing pages
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a2e1a",
        color: "#fff",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "primary.light", mb: 1 }}
            >
              VolunteerHub
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
              Nhiệt huyết tình nguyện viên
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{ color: "grey.400", "&:hover": { color: "primary.light" } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "grey.400", "&:hover": { color: "primary.light" } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "grey.400", "&:hover": { color: "primary.light" } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "grey.400", "&:hover": { color: "primary.light" } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* About Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Về Chúng Tôi
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#about" underline="hover" color="grey.400" fontSize={14}>
                Giới thiệu
              </Link>
              <Link href="#mission" underline="hover" color="grey.400" fontSize={14}>
                Sứ mệnh
              </Link>
              <Link href="#team" underline="hover" color="grey.400" fontSize={14}>
                Đội ngũ
              </Link>
              <Link href="#contact" underline="hover" color="grey.400" fontSize={14}>
                Liên hệ
              </Link>
            </Box>
          </Grid>

          {/* Activity Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Hoạt Động
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/events" underline="hover" color="grey.400" fontSize={14}>
                Sự kiện
              </Link>
              <Link href="#campaigns" underline="hover" color="grey.400" fontSize={14}>
                Chiến dịch
              </Link>
              <Link href="#projects" underline="hover" color="grey.400" fontSize={14}>
                Dự án
              </Link>
              <Link href="#volunteer" underline="hover" color="grey.400" fontSize={14}>
                Tình nguyện
              </Link>
            </Box>
          </Grid>

          {/* Resources Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Tài Nguyên
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#blog" underline="hover" color="grey.400" fontSize={14}>
                Blog
              </Link>
              <Link href="#news" underline="hover" color="grey.400" fontSize={14}>
                Tin tức
              </Link>
              <Link href="#gallery" underline="hover" color="grey.400" fontSize={14}>
                Thư viện
              </Link>
              <Link href="#faq" underline="hover" color="grey.400" fontSize={14}>
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Hỗ Trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#help" underline="hover" color="grey.400" fontSize={14}>
                Trung tâm hỗ trợ
              </Link>
              <Link href="#privacy" underline="hover" color="grey.400" fontSize={14}>
                Chính sách bảo mật
              </Link>
              <Link href="#terms" underline="hover" color="grey.400" fontSize={14}>
                Điều khoản sử dụng
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "rgba(255,255,255,0.1)",
            mt: 6,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="caption" color="grey.500">
            © {currentYear} VolunteerHub. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#privacy" underline="hover" color="grey.500" fontSize={12}>
              Chính sách bảo mật
            </Link>
            <Link href="#terms" underline="hover" color="grey.500" fontSize={12}>
              Điều khoản sử dụng
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;

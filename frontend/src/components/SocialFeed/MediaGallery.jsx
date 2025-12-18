import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

/**
 * MediaGallery - FB-style image gallery with lightbox
 * - 1 image: full width
 * - 2 images: side by side
 * - 3 images: 1 large + 2 small stacked
 * - 4+ images: 2x2 grid with "+X" overlay on last
 */
const MediaGallery = ({ items = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const getImageUrl = (item) => {
    return item.url || `/api/media/download/${item.filename}`;
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") closeLightbox();
  };

  // Grid layouts based on number of images
  const renderGrid = () => {
    const count = items.length;
    const maxDisplay = 4;
    const displayItems = items.slice(0, maxDisplay);
    const remaining = count - maxDisplay;

    // Single image
    if (count === 1) {
      return (
        <Box
          onClick={() => openLightbox(0)}
          sx={{
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <Box
            component="img"
            src={getImageUrl(items[0])}
            alt="Media"
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      );
    }

    // Two images - side by side
    if (count === 2) {
      return (
        <Box sx={{ display: "flex", gap: 0.5, borderRadius: "8px", overflow: "hidden" }}>
          {displayItems.map((item, idx) => (
            <Box
              key={item.id || idx}
              onClick={() => openLightbox(idx)}
              sx={{
                flex: 1,
                cursor: "pointer",
                height: 250,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={getImageUrl(item)}
                alt="Media"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      );
    }

    // Three images - 1 large left, 2 stacked right
    if (count === 3) {
      return (
        <Box sx={{ display: "flex", gap: 0.5, borderRadius: "8px", overflow: "hidden", height: 300 }}>
          <Box
            onClick={() => openLightbox(0)}
            sx={{ flex: 2, cursor: "pointer", overflow: "hidden" }}
          >
            <Box
              component="img"
              src={getImageUrl(items[0])}
              alt="Media"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
            {[1, 2].map((idx) => (
              <Box
                key={idx}
                onClick={() => openLightbox(idx)}
                sx={{ flex: 1, cursor: "pointer", overflow: "hidden" }}
              >
                <Box
                  component="img"
                  src={getImageUrl(items[idx])}
                  alt="Media"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    // 4+ images - 2x2 grid with overlay on last
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.5,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {displayItems.map((item, idx) => (
          <Box
            key={item.id || idx}
            onClick={() => openLightbox(idx)}
            sx={{
              position: "relative",
              cursor: "pointer",
              height: 180,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={getImageUrl(item)}
              alt="Media"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Show +X overlay on last item if more images exist */}
            {idx === maxDisplay - 1 && remaining > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
                  +{remaining}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <>
      {/* Gallery Grid */}
      <Box sx={{ px: 2, pb: 1 }}>{renderGrid()}</Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        maxWidth="lg"
        fullWidth
        onKeyDown={handleKeyDown}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.95)",
            boxShadow: "none",
            maxHeight: "95vh",
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={closeLightbox}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            zIndex: 10,
          }}
        >
          <Close />
        </IconButton>

        {/* Image container */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            position: "relative",
          }}
        >
          {/* Previous button */}
          {items.length > 1 && (
            <IconButton
              onClick={goPrev}
              sx={{
                position: "absolute",
                left: 8,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>
          )}

          {/* Current image */}
          <Box
            component="img"
            src={getImageUrl(items[currentIndex])}
            alt={`Media ${currentIndex + 1}`}
            sx={{
              maxWidth: "90%",
              maxHeight: "85vh",
              objectFit: "contain",
            }}
          />

          {/* Next button */}
          {items.length > 1 && (
            <IconButton
              onClick={goNext}
              sx={{
                position: "absolute",
                right: 8,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          )}
        </Box>

        {/* Image counter */}
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            {currentIndex + 1} / {items.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

MediaGallery.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      filename: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default MediaGallery;

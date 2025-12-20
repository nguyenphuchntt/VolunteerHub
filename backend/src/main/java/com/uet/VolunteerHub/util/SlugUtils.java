package com.uet.VolunteerHub.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Utility class for generating URL-friendly slugs from text.
 * Handles Vietnamese characters by removing diacritics.
 */
public class SlugUtils {
    
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern MULTIDASH = Pattern.compile("-+");

    /**
     * Generates a URL-friendly slug from the given text.
     * 
     * @param text The input text to convert to a slug
     * @return A lowercase, hyphenated slug with no special characters
     */
    public static String generateSlug(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        
        // Remove Vietnamese diacritics
        String slug = removeVietnameseDiacritics(text);
        
        // Convert to lowercase
        slug = slug.toLowerCase();
        
        // Replace whitespace with hyphens
        slug = WHITESPACE.matcher(slug).replaceAll("-");
        
        // Remove non-latin characters except hyphens
        slug = NONLATIN.matcher(slug).replaceAll("");
        
        // Replace multiple hyphens with single hyphen
        slug = MULTIDASH.matcher(slug).replaceAll("-");
        
        // Remove leading and trailing hyphens
        slug = slug.replaceAll("^-|-$", "");
        
        return slug;
    }

    /**
     * Removes Vietnamese diacritics from text.
     * Converts characters like "ấ" to "a", "ệ" to "e", etc.
     */
    private static String removeVietnameseDiacritics(String text) {
        // Handle special Vietnamese characters first
        text = text.replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a");
        text = text.replaceAll("[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]", "A");
        text = text.replaceAll("[èéẹẻẽêềếệểễ]", "e");
        text = text.replaceAll("[ÈÉẸẺẼÊỀẾỆỂỄ]", "E");
        text = text.replaceAll("[ìíịỉĩ]", "i");
        text = text.replaceAll("[ÌÍỊỈĨ]", "I");
        text = text.replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o");
        text = text.replaceAll("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]", "O");
        text = text.replaceAll("[ùúụủũưừứựửữ]", "u");
        text = text.replaceAll("[ÙÚỤỦŨƯỪỨỰỬỮ]", "U");
        text = text.replaceAll("[ỳýỵỷỹ]", "y");
        text = text.replaceAll("[ỲÝỴỶỸ]", "Y");
        text = text.replaceAll("[đ]", "d");
        text = text.replaceAll("[Đ]", "D");
        
        // Use Java normalizer for any remaining diacritics
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

    /**
     * Builds a full event URL path with slug and ID.
     * Format: {slug}-{eventId}
     * 
     * @param title The event title
     * @param eventId The event ID
     * @return URL path segment like "chuong-trinh-tinh-nguyen-123"
     */
    public static String buildEventSlugWithId(String title, Long eventId) {
        String slug = generateSlug(title);
        if (slug.isEmpty()) {
            return String.valueOf(eventId);
        }
        return slug + "-" + eventId;
    }

    /**
     * Extracts the event ID from a slug-id string.
     * Handles both "slug-123" format and plain "123" format.
     * 
     * @param identifier The slug-id string
     * @return The extracted event ID, or null if not found
     */
    public static Long extractEventIdFromSlug(String identifier) {
        if (identifier == null || identifier.isEmpty()) {
            return null;
        }
        
        // Try to parse as plain number first
        try {
            return Long.parseLong(identifier);
        } catch (NumberFormatException e) {
            // Not a plain number, try to extract from slug-id format
        }
        
        // Extract ID from "slug-123" format
        int lastDashIndex = identifier.lastIndexOf('-');
        if (lastDashIndex != -1 && lastDashIndex < identifier.length() - 1) {
            try {
                return Long.parseLong(identifier.substring(lastDashIndex + 1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        
        return null;
    }
}

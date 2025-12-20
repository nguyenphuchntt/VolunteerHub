package com.uet.VolunteerHub.dto.Event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO for search suggestions/autocomplete.
 * Contains only essential fields for display in dropdown.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSuggestionDTO {
    private Long eventId;
    private String title;
    private String category;
    private String coverImageUrl;
}

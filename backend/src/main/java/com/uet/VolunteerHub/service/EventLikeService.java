package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Event.EventLikeDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventLike;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.EventLikeRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventLikeService {
    private final EventLikeRepository eventLikeRepository;
    private final EventRepository eventRepository;

    @Autowired
    public EventLikeService(EventLikeRepository eventLikeRepository, EventRepository eventRepository) {
        this.eventLikeRepository = eventLikeRepository;
        this.eventRepository = eventRepository;
    }

//    private EventSearchDTO mapToEventSearchDTO (Event event, Account account, UserInfo userInfo) {
//        var builder = EventSearchDTO.builder()
//                .eventId(event.getEventId())
//                .title(event.getTitle())
//                .description(event.getDescription())
//                .status(event.getStatus())
//                .attendeeCount(event.getAttendeeCount())
//                .createAt(event.getCreateAt())
//                .startAt(event.getStartAt())
//                .endAt(event.getEndAt())
//                .category(event.getCategory())
//                .location(event.getLocation())
//                .likeCount(event.getLikeCount());
//        if (account != null) {
//            builder.accountId(account.getAccountId());
//        }
//        return builder.build();
//    }

    private EventLikeDTO mapToEventLikeDTO(UUID accountId, long eventId, int likeCount, boolean liked) {
        EventLikeDTO eventLikeDTO = new EventLikeDTO();
        eventLikeDTO.setAccountId(accountId);
        eventLikeDTO.setEventId(eventId);
        eventLikeDTO.setLikesCount(likeCount);
        eventLikeDTO.setLiked(liked);
        return eventLikeDTO;
    }

    @Transactional
    public Optional<EventLikeDTO> toggleLikeEvent(Account account, long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new ResourceNotFoundException("Event with eventId" + eventId + "not found")
        );
        int likeCount = event.getLikeCount();

        if (eventLikeRepository.existsByEventIdAndAccountId(eventId, account.getAccountId())) {
            eventLikeRepository.deleteByEventIdAndAccountId(eventId, account.getAccountId());
            event.setLikeCount(likeCount - 1);
            eventRepository.save(event);
            return Optional.of(mapToEventLikeDTO(account.getAccountId(), eventId, likeCount - 1, false));
        } else {
            EventLike like = new EventLike();
            like.setAccountId(account.getAccountId());
            like.setEventId(eventId);
            like.setAccount(account);
            like.setEvent(event);
            eventLikeRepository.save(like);
            event.setLikeCount(likeCount + 1);
            eventRepository.save(event);
            return Optional.of(mapToEventLikeDTO(account.getAccountId(), eventId, likeCount + 1, true));
        }

    }

}

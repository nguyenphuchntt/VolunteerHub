package com.uet.VolunteerHub.mapper;

import com.uet.VolunteerHub.dto.NotificationReadDTO;
import com.uet.VolunteerHub.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(source = "notificationType", target = "type")
    @Mapping(source = "senderAccount.accountId", target = "senderAccountId")
    @Mapping(source = "senderAccount.username", target = "senderUsername")
    @Mapping(source = "receiverAccount.accountId", target = "receiverAccountId")
    @Mapping(source = "createdAt", target = "createdAt")
    NotificationReadDTO toDTO(Notification notification);

    @Mapping(source = "type", target = "notificationType")
    @Mapping(source = "senderAccountId", target = "senderAccount.accountId")
    @Mapping(source = "receiverAccountId", target = "receiverAccount.accountId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(target = "notificationId", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Notification toEntity(NotificationReadDTO dto);
}
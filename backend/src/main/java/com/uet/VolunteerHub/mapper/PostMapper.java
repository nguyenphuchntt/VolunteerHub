package com.uet.VolunteerHub.mapper;

import com.uet.VolunteerHub.dto.Post.PostCreateDTO;
import com.uet.VolunteerHub.dto.Post.PostReadDTO;
import com.uet.VolunteerHub.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PostMapper {

    PostMapper INSTANCE = Mappers.getMapper(PostMapper.class);

    @Mapping(source = "event.title", target = "eventTitle")
    @Mapping(source = "createdByAccount.username", target = "ownerUsername")
    @Mapping(source = "createdByAccount.userInfo.firstName", target = "ownerFirstName")
    @Mapping(source = "createdByAccount.userInfo.lastName", target = "ownerLastName")
    PostReadDTO toPostReadDTO(Post post);

    @Mapping(target = "postId", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "createdByAccount", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    Post toPostEntity(PostCreateDTO postDTO);
}

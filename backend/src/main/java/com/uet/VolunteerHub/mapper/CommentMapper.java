package com.uet.VolunteerHub.mapper;

import com.uet.VolunteerHub.dto.CommentReadDTO;
import com.uet.VolunteerHub.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "post.postId", target = "postId")
    @Mapping(source = "parentComment.commentId", target = "parentCommentId")
    @Mapping(source = "createdByAccount.username", target = "ownerUsername")
    @Mapping(source = "createdByAccount.userInfo.firstName", target = "ownerFirstName")
    @Mapping(source = "createdByAccount.userInfo.lastName", target = "ownerLastName")
    CommentReadDTO toCommentReadDTO(Comment comment);

//    @Mapping(source = "postId", target = "post.postId")
//    @Mapping(source = "createdByAccountId", target = "createdByAccount.accountId")
//    @Mapping(source = "parentCommentId", target = "parentComment.commentId")
//    @Mapping(target = "commentId", ignore = true)
//    @Mapping(target = "createAt", ignore = true)
//    @Mapping(target = "replies", ignore = true)
//    Comment toCommentEntity(CommentReadDTO commentReadDTO);
}

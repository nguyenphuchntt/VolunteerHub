package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.entity.Comment;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class CommentSpecification {

    public Specification<Comment> nonParentComment() {
        return (Root<Comment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            return criteriaBuilder.isNull(root.get("parentComment"));
        };
    }

    public Specification<Comment> commentsOfPost(Long postId) {
        return (Root<Comment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            if (postId == null) {
                return null;
            }
            return criteriaBuilder.equal(
                    root.get("post").get("postId"),
                    postId
            );
        };
    }
}

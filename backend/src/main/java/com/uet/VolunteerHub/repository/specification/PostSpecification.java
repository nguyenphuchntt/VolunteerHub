package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.entity.Post;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class PostSpecification {

    public Specification<Post> contentLike(String content) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(content)) {
                return null;
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("content")), "%" + content.toLowerCase() + "%"
            );
        };
    }

    public Specification<Post> hasOwner(String ownerUsername) {
        return (root, query, criteriaBuilder) -> {
            if (ownerUsername == null) {
                return null;
            }
            return criteriaBuilder.equal(
                    root.get("createdByAccount").get("username"),
                    ownerUsername
            );
        };
    }
}

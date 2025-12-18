package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID>, JpaSpecificationExecutor<Account> {

    @Override
    @EntityGraph(attributePaths = {"userInfo"})
    Page<Account> findAll(Specification<Account> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"userInfo"})
    Optional<Account> findById(UUID accountId);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"userInfo"})
    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);

    @EntityGraph(attributePaths = {"userInfo"})
    Optional<Account> findByUsernameOrEmail(String username, String email);


    long countByRole(UserRole role);

    long countByAccountStatus(AccountStatus status);

    long countByCreateAtBetween(OffsetDateTime start, OffsetDateTime end);

    @Query(value = "SELECT CAST(a.account_id AS CHAR) as account_id, a.username, a.email, " +
            "(COALESCE((SELECT COUNT(*) FROM comment c WHERE c.created_by_account_id = a.account_id), 0) + " +
            " COALESCE((SELECT COUNT(*) FROM post_like pl WHERE pl.account_id = a.account_id), 0) + " +
            " COALESCE((SELECT COUNT(*) FROM event_like el WHERE el.account_id = a.account_id), 0)) as score " +
            "FROM account a " +
            "ORDER BY score DESC " +
            "LIMIT 5", nativeQuery = true)
    List<Object[]> findTopInteractiveUsers();

    @Query("SELECT DATE(a.createAt) as date, COUNT(a) as count FROM Account a WHERE a.createAt >= :startDate GROUP BY DATE(a.createAt) ORDER BY date ASC")
    List<Object[]> countNewUsersByDate(java.time.OffsetDateTime startDate);

    List<Account> findAllByRoleNot(UserRole role);
}

package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Request;
import com.uet.VolunteerHub.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    // Tìm tất cả requests của một user
    Page<Request> findByAccount(Account account, Pageable pageable);

    // Tìm requests theo status
    Page<Request> findByStatus(RequestStatus status, Pageable pageable);

    // Tìm requests của một user theo status
    Page<Request> findByAccountAndStatus(Account account, RequestStatus status, Pageable pageable);

    // Kiểm tra xem user có request đang pending không
    @Query("SELECT r FROM Request r WHERE r.account = :account AND r.status = :status")
    Optional<Request> findByAccountAndStatus(@Param("account") Account account, @Param("status") RequestStatus status);

    // Đếm số lượng requests theo status
    long countByStatus(RequestStatus status);

    // Kiểm tra user có pending request không
    boolean existsByAccountAndStatus(Account account, RequestStatus status);
}

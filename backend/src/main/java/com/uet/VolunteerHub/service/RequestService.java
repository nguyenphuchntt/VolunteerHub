package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Request.RequestCreateDTO;
import com.uet.VolunteerHub.dto.Request.RequestReadDTO;
import com.uet.VolunteerHub.dto.Request.RequestReviewDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Request;
import com.uet.VolunteerHub.enums.RequestStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.exception.ResourceAlreadyExistsException;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.RequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public RequestService(RequestRepository requestRepository, AccountRepository accountRepository) {
        this.requestRepository = requestRepository;
        this.accountRepository = accountRepository;
    }

    private RequestReadDTO mapToRequestReadDTO(Request request) {
        return RequestReadDTO.builder()
                .requestId(request.getRequestId())
                .accountId(request.getAccount().getAccountId())
                .username(request.getAccount().getUsername())
                .email(request.getAccount().getEmail())
                .status(request.getStatus())
                .reason(request.getReason())
                .adminResponse(request.getAdminResponse())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    @Transactional
    public RequestReadDTO createRequest(Account account, RequestCreateDTO requestCreateDTO) {
        if (account.getRole() == UserRole.MANAGER || account.getRole() == UserRole.ADMIN) {
            throw new IllegalArgumentException("You already have manager or admin privileges");
        }
        if (requestRepository.existsByAccountAndStatus(account, RequestStatus.WAITING)) {
            throw new ResourceAlreadyExistsException("You already have a pending request");
        }

        Request request = Request.builder()
                .account(account)
                .status(RequestStatus.WAITING)
                .reason(requestCreateDTO.getReason())
                .build();

        request = requestRepository.save(request);
        return mapToRequestReadDTO(request);
    }

    @Transactional
    public RequestReadDTO reviewRequest(Long requestId, Account admin, RequestReviewDTO requestReviewDTO) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request with ID " + requestId + " not found"));
        if (request.getStatus() != RequestStatus.WAITING) {
            throw new IllegalArgumentException("This request has already been reviewed");
        }
        if (requestReviewDTO.getStatus() == RequestStatus.WAITING) {
            throw new IllegalArgumentException("Cannot set status to WAITING");
        }
        request.setStatus(requestReviewDTO.getStatus());
        request.setAdminResponse(requestReviewDTO.getAdminResponse());
        if (requestReviewDTO.getStatus() == RequestStatus.APPROVED) {
            Account userAccount = request.getAccount();
            userAccount.setRole(UserRole.MANAGER);
            accountRepository.save(userAccount);
        }
        request = requestRepository.save(request);
        return mapToRequestReadDTO(request);
    }

    @Transactional
    public void cancelRequest(Long requestId, Account account) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request with ID " + requestId + " not found"));
        if (!request.getAccount().getAccountId().equals(account.getAccountId())) {
            throw new IllegalArgumentException("You can only cancel your own requests");
        }
        if (request.getStatus() != RequestStatus.WAITING) {
            throw new IllegalArgumentException("You can only cancel pending requests");
        }
        requestRepository.delete(request);
    }

    @Transactional
    public Page<RequestReadDTO> getAllRequests(Pageable pageable) {
        Page<Request> requests = requestRepository.findAll(pageable);
        return requests.map(this::mapToRequestReadDTO);
    }

    @Transactional
    public Page<RequestReadDTO> getRequestsByStatus(RequestStatus status, Pageable pageable) {
        Page<Request> requests = requestRepository.findByStatus(status, pageable);
        return requests.map(this::mapToRequestReadDTO);
    }

    @Transactional
    public Page<RequestReadDTO> getMyRequests(Account account, Pageable pageable) {
        Page<Request> requests = requestRepository.findByAccount(account, pageable);
        return requests.map(this::mapToRequestReadDTO);
    }

    @Transactional
    public RequestReadDTO getRequestById(Long requestId, Account account) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request with ID " + requestId + " not found"));
        
        // Kiểm tra quyền sở hữu: chỉ người tạo request mới được xem
        if (!request.getAccount().getAccountId().equals(account.getAccountId())) {
            throw new IllegalArgumentException("You can only view your own requests");
        }
        
        return mapToRequestReadDTO(request);
    }

    @Transactional
    public RequestReadDTO getRequestByIdForAdmin(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request with ID " + requestId + " not found"));
        return mapToRequestReadDTO(request);
    }

    @Transactional
    public long countPendingRequests() {
        return requestRepository.countByStatus(RequestStatus.WAITING);
    }
}

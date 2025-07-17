package com.securepay.repository;

import com.securepay.entity.PaymentLink;
import com.securepay.entity.PaymentLinkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentLinkRepository extends JpaRepository<PaymentLink, Long> {
    Optional<PaymentLink> findByLinkId(String linkId);
    List<PaymentLink> findByMerchantId(String merchantId);
    Page<PaymentLink> findByMerchantId(String merchantId, Pageable pageable);
    Page<PaymentLink> findByStatus(PaymentLinkStatus status, Pageable pageable);
}

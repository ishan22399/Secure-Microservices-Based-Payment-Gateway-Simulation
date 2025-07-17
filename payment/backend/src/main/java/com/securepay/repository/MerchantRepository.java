package com.securepay.repository;

import com.securepay.entity.Merchant;
import com.securepay.entity.MerchantStatus;
import com.securepay.entity.RiskLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    Optional<Merchant> findByMerchantId(String merchantId);
    Page<Merchant> findByStatus(MerchantStatus status, Pageable pageable);
    Page<Merchant> findByRiskLevel(RiskLevel riskLevel, Pageable pageable);
    Page<Merchant> findByBusinessType(String businessType, Pageable pageable);
    long countByStatus(MerchantStatus status);

    @Query("SELECT SUM(m.monthlyVolume) FROM Merchant m")
    BigDecimal getTotalMonthlyVolume();
}

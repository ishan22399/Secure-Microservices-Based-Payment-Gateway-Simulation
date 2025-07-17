package com.securepay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchants")
public class Merchant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "merchant_id", unique = true)
    private String merchantId;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String phone;
    private String address;

    @Column(name = "business_type")
    private String businessType;

    @Enumerated(EnumType.STRING)
    private MerchantStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    @Column(name = "monthly_volume", precision = 19, scale = 2)
    private BigDecimal monthlyVolume;

    @Column(name = "transaction_count")
    private Long transactionCount;

    @Column(name = "processing_fee", precision = 5, scale = 2)
    private BigDecimal processingFee;

    @Column(name = "settlement_period")
    private String settlementPeriod;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Merchant() {}

    public Merchant(String merchantId, String name, String email) {
        this.merchantId = merchantId;
        this.name = name;
        this.email = email;
        this.status = MerchantStatus.PENDING;
        this.riskLevel = RiskLevel.MEDIUM;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public MerchantStatus getStatus() { return status; }
    public void setStatus(MerchantStatus status) { this.status = status; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public BigDecimal getMonthlyVolume() { return monthlyVolume; }
    public void setMonthlyVolume(BigDecimal monthlyVolume) { this.monthlyVolume = monthlyVolume; }

    public Long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Long transactionCount) { this.transactionCount = transactionCount; }

    public BigDecimal getProcessingFee() { return processingFee; }
    public void setProcessingFee(BigDecimal processingFee) { this.processingFee = processingFee; }

    public String getSettlementPeriod() { return settlementPeriod; }
    public void setSettlementPeriod(String settlementPeriod) { this.settlementPeriod = settlementPeriod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

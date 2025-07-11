package com.example.paymentgateway.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_user", columnList = "user_id"),
    @Index(name = "idx_transaction_merchant", columnList = "merchant_id"),
    @Index(name = "idx_transaction_bank", columnList = "bank_id"),
    @Index(name = "idx_transaction_reference", columnList = "reference")
})
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Column(nullable = false, length = 20)
    private String status; // e.g., PENDING, SUCCESS, FAILED

    @Column(nullable = false)
    private LocalDateTime timestamp;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Multi-tenant: direct linkage for merchant or bank context (optional, for reporting or admin)
    @Column(name = "merchant_id", length = 36)
    private String merchantId;

    @Column(name = "bank_id", length = 36)
    private String bankId;

    @Column(length = 100)
    private String reference;


    // Business logic methods
    public boolean isPending() {
        return "PENDING".equalsIgnoreCase(status);
    }

    public boolean isSuccessful() {
        return "SUCCESS".equalsIgnoreCase(status);
    }

    public boolean isFailed() {
        return "FAILED".equalsIgnoreCase(status);
    }

    public boolean isTenantMatch(String tenantId) {
        if (merchantId != null && merchantId.equals(tenantId)) return true;
        if (bankId != null && bankId.equals(tenantId)) return true;
        return false;
    }

    public void markSuccess() {
        this.status = "SUCCESS";
    }

    public void markFailed() {
        this.status = "FAILED";
    }

    public void markPending() {
        this.status = "PENDING";
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getBankId() { return bankId; }
    public void setBankId(String bankId) { this.bankId = bankId; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}

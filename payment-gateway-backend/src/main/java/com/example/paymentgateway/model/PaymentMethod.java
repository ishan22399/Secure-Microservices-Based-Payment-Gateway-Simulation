package com.example.paymentgateway.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "payment_methods", indexes = {
    @Index(name = "idx_payment_method_user", columnList = "user_id"),
    @Index(name = "idx_payment_method_merchant", columnList = "merchant_id"),
    @Index(name = "idx_payment_method_bank", columnList = "bank_id")
})
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String type; // e.g., CREDIT_CARD, BANK_TRANSFER

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String details; // e.g., masked card number

    @Column(nullable = false)
    private boolean active = true; // Business rule: only active methods can be used

    @Column(nullable = false)
    private boolean verified = false; // Business rule: must be verified before use

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Each payment method belongs to a user (tenant context)

    // Multi-tenant: direct linkage for merchant or bank context (optional, for reporting or admin)
    @Column(name = "merchant_id", length = 36)
    private String merchantId;

    @Column(name = "bank_id", length = 36)
    private String bankId;

    // Business logic methods
    public boolean canBeUsedForPayment() {
        // Only active and verified payment methods can be used
        return active && verified;
    }

    public boolean isTenantMatch(String tenantId) {
        // Checks if this payment method belongs to the given tenant (merchant or bank)
        if (merchantId != null && merchantId.equals(tenantId)) return true;
        if (bankId != null && bankId.equals(tenantId)) return true;
        return false;
    }

    public void deactivate() {
        this.active = false;
    }

    public void verify() {
        this.verified = true;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getBankId() { return bankId; }
    public void setBankId(String bankId) { this.bankId = bankId; }
}

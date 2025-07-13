package com.example.paymentgateway.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_merchant", columnList = "merchant_id"),
    @Index(name = "idx_user_bank", columnList = "bank_id"),
    @Index(name = "idx_user_username", columnList = "username", unique = true)
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 4, max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank
    @Size(min = 8)
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();


    // Multi-tenant: direct linkage for merchant or bank context (optional, for reporting or admin)
    @Column(name = "merchant_id", length = 36)
    private String merchantId;

    @Column(name = "bank_id", length = 36)
    private String bankId;

    // Auditing fields
    @Column(nullable = false)
    private boolean enabled = true;


    // Business logic methods
    public boolean isAdmin() {
        return roles != null && roles.contains("ROLE_ADMIN");
    }

    public boolean isMerchant() {
        return roles != null && roles.contains("ROLE_MERCHANT");
    }

    public boolean isCustomer() {
        return roles != null && roles.contains("ROLE_CUSTOMER");
    }

    public boolean isTenantMatch(String tenantId) {
        if (merchantId != null && merchantId.equals(tenantId)) return true;
        if (bankId != null && bankId.equals(tenantId)) return true;
        return false;
    }

    public void disable() {
        this.enabled = false;
    }

    public void enable() {
        this.enabled = true;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getBankId() { return bankId; }
    public void setBankId(String bankId) { this.bankId = bankId; }
}

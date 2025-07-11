package com.example.paymentgateway.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String action;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Business logic methods
    public boolean isSecurityEvent() {
        return action != null && (action.toLowerCase().contains("login") || action.toLowerCase().contains("failed") || action.toLowerCase().contains("unauthorized"));
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

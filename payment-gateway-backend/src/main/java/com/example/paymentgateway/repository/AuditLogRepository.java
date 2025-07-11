package com.example.paymentgateway.repository;

import com.example.paymentgateway.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUsername(String username);
}

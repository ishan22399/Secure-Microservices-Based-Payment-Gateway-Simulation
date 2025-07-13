package com.example.paymentgateway.service;

import com.example.paymentgateway.model.AuditLog;
import com.example.paymentgateway.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String username, String action) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}

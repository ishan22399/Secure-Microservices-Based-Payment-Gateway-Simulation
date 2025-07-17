package com.securepay.service;

import com.securepay.entity.TransactionStatus;
import com.securepay.repository.TransactionRepository;
import com.securepay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getSystemAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        
        LocalDateTime startDate = getStartDateForPeriod(period);
        
        // Transaction stats
        analytics.put("totalTransactions", transactionRepository.count());
        analytics.put("completedTransactions", transactionRepository.countByStatus(TransactionStatus.COMPLETED));
        analytics.put("pendingTransactions", transactionRepository.countByStatus(TransactionStatus.PENDING));
        analytics.put("failedTransactions", transactionRepository.countByStatus(TransactionStatus.FAILED));
        
        // Revenue stats
        BigDecimal totalRevenue = transactionRepository.getTotalCompletedAmount();
        BigDecimal periodRevenue = transactionRepository.getTotalAmountSince(startDate);
        
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        analytics.put("periodRevenue", periodRevenue != null ? periodRevenue : BigDecimal.ZERO);
        
        // User stats
        analytics.put("totalUsers", userRepository.count());
        
        // Period stats
        analytics.put("periodTransactions", transactionRepository.countTransactionsSince(startDate));
        
        return analytics;
    }

    public Map<String, Object> getMerchantAnalytics(String merchantId, String period) {
        Map<String, Object> analytics = new HashMap<>();
        
        // This would be implemented with merchant-specific queries
        // For now, returning mock data structure
        analytics.put("revenue", Map.of(
            "current", 125000,
            "previous", 98000,
            "change", 27.6
        ));
        
        analytics.put("transactions", Map.of(
            "current", 1247,
            "previous", 1089,
            "change", 14.5
        ));
        
        return analytics;
    }

    private LocalDateTime getStartDateForPeriod(String period) {
        LocalDateTime now = LocalDateTime.now();
        switch (period) {
            case "7d":
                return now.minusDays(7);
            case "30d":
                return now.minusDays(30);
            case "90d":
                return now.minusDays(90);
            case "1y":
                return now.minusYears(1);
            default:
                return now.minusDays(30);
        }
    }
}

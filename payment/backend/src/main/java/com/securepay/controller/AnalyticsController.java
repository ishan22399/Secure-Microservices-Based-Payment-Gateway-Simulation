package com.securepay.controller;

import com.securepay.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<?> getAnalytics(
            @RequestParam(required = false) String merchantId,
            @RequestParam(defaultValue = "30d") String timeRange) {
        try {
            Map<String, Object> analytics;
            if (merchantId != null) {
                analytics = analyticsService.getMerchantAnalytics(merchantId, timeRange);
            } else {
                analytics = analyticsService.getSystemAnalytics(timeRange);
            }
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch analytics"));
        }
    }
}

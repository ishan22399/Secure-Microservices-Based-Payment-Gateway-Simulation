package com.securepay.controller;

import com.securepay.entity.Merchant;
import com.securepay.entity.MerchantStatus;
import com.securepay.entity.RiskLevel;
import com.securepay.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/merchants")
@CrossOrigin(origins = "http://localhost:3000")
public class MerchantController {

    @Autowired
    private MerchantRepository merchantRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMerchants(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String businessType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {

        Pageable pageable = PageRequest.of(offset / limit, limit, Sort.by("createdAt").descending());
        Page<Merchant> merchants;

        // Apply filters (simplified for demo)
        if (status != null) {
            merchants = merchantRepository.findByStatus(MerchantStatus.valueOf(status.toUpperCase()), pageable);
        } else if (riskLevel != null) {
            merchants = merchantRepository.findByRiskLevel(RiskLevel.valueOf(riskLevel.toUpperCase()), pageable);
        } else if (businessType != null) {
            merchants = merchantRepository.findByBusinessType(businessType, pageable);
        } else {
            merchants = merchantRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("merchants", merchants.getContent());
        response.put("total", merchants.getTotalElements());
        response.put("hasMore", merchants.hasNext());

        // Summary statistics
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMerchants", merchantRepository.count());
        summary.put("activeMerchants", merchantRepository.countByStatus(MerchantStatus.ACTIVE));
        summary.put("totalVolume", merchantRepository.getTotalMonthlyVolume());
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMerchant(@PathVariable String id) {
        Optional<Merchant> merchant = merchantRepository.findByMerchantId(id);
        
        if (merchant.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("merchant", merchant.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createMerchant(@RequestBody Map<String, Object> merchantData) {
        Merchant merchant = new Merchant();
        merchant.setMerchantId("MERCH_" + System.currentTimeMillis());
        merchant.setName((String) merchantData.get("name"));
        merchant.setEmail((String) merchantData.get("email"));
        merchant.setBusinessType((String) merchantData.get("businessType"));
        merchant.setStatus(MerchantStatus.PENDING);
        merchant.setRiskLevel(RiskLevel.MEDIUM);
        merchant.setMonthlyVolume(BigDecimal.ZERO);
        merchant.setTransactionCount(0L);
        merchant.setProcessingFee(new BigDecimal("2.9"));
        merchant.setSettlementPeriod("daily");

        merchant = merchantRepository.save(merchant);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Merchant created successfully");
        response.put("merchant", merchant);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateMerchant(
            @PathVariable String id, 
            @RequestBody Map<String, Object> merchantData) {
        
        Optional<Merchant> optionalMerchant = merchantRepository.findByMerchantId(id);
        
        if (optionalMerchant.isPresent()) {
            Merchant merchant = optionalMerchant.get();
            
            // Update fields
            if (merchantData.containsKey("name")) {
                merchant.setName((String) merchantData.get("name"));
            }
            if (merchantData.containsKey("email")) {
                merchant.setEmail((String) merchantData.get("email"));
            }
            if (merchantData.containsKey("status")) {
                merchant.setStatus(MerchantStatus.valueOf(((String) merchantData.get("status")).toUpperCase()));
            }
            
            merchantRepository.save(merchant);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant updated successfully");
            response.put("merchantId", id);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

package com.securepay.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.securepay.entity.PaymentLink;
import com.securepay.service.PaymentLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment-links")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentLinkController {

    @Autowired
    private PaymentLinkService paymentLinkService;

    @GetMapping
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<?> getPaymentLinks(
            @RequestParam(required = false) String merchantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (page == 0 && size == 20) {
                // Return all payment links
                List<PaymentLink> paymentLinks = paymentLinkService.getPaymentLinksByMerchantId(merchantId);
                return ResponseEntity.ok(Map.of(
                    "paymentLinks", paymentLinks,
                    "total", paymentLinks.size()
                ));
            } else {
                // Return paginated results
                Pageable pageable = PageRequest.of(page, size);
                Page<PaymentLink> paymentLinks = paymentLinkService.getPaymentLinksByMerchantId(merchantId, pageable);
                return ResponseEntity.ok(Map.of(
                    "paymentLinks", paymentLinks.getContent(),
                    "totalElements", paymentLinks.getTotalElements(),
                    "totalPages", paymentLinks.getTotalPages(),
                    "currentPage", paymentLinks.getNumber()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch payment links"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> paymentLinkData) {
        try {
            PaymentLink paymentLink = new PaymentLink();
            paymentLink.setMerchantId((String) paymentLinkData.get("merchantId"));
            paymentLink.setTitle((String) paymentLinkData.get("title"));
            paymentLink.setDescription((String) paymentLinkData.get("description"));
            paymentLink.setAmount(new BigDecimal(paymentLinkData.get("amount").toString()));
            paymentLink.setCurrency((String) paymentLinkData.get("currency"));
            
            if (paymentLinkData.containsKey("maxUsage")) {
                paymentLink.setMaxUsage((Integer) paymentLinkData.get("maxUsage"));
            }
            
            if (paymentLinkData.containsKey("expiresAt") && paymentLinkData.get("expiresAt") != null) {
                paymentLink.setExpiresAt(LocalDateTime.parse((String) paymentLinkData.get("expiresAt")));
            }

            PaymentLink savedLink = paymentLinkService.createPaymentLink(paymentLink);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment link created successfully",
                "paymentLink", savedLink
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Failed to create payment link"));
        }
    }

    @GetMapping("/{linkId}")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<?> getPaymentLink(@PathVariable String linkId) {
        try {
            return paymentLinkService.getPaymentLinkById(linkId)
                .map(link -> ResponseEntity.ok(link))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch payment link"));
        }
    }

    @PutMapping("/{linkId}")
    public ResponseEntity<?> updatePaymentLink(
            @PathVariable String linkId,
            @RequestBody Map<String, Object> updates) {
        try {
            PaymentLink updatedLink = paymentLinkService.updatePaymentLink(linkId, updates);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment link updated successfully",
                "paymentLink", updatedLink
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<?> deletePaymentLink(@PathVariable String linkId) {
        try {
            paymentLinkService.deletePaymentLink(linkId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment link deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}

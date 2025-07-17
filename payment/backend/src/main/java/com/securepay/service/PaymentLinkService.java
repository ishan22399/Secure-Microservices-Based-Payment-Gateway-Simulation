package com.securepay.service;

import com.securepay.entity.PaymentLink;
import com.securepay.entity.PaymentLinkStatus;
import com.securepay.repository.PaymentLinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentLinkService {

    @Autowired
    private PaymentLinkRepository paymentLinkRepository;

    public List<PaymentLink> getPaymentLinksByMerchantId(String merchantId) {
        return paymentLinkRepository.findByMerchantId(merchantId);
    }

    public Page<PaymentLink> getPaymentLinksByMerchantId(String merchantId, Pageable pageable) {
        return paymentLinkRepository.findByMerchantId(merchantId, pageable);
    }

    public PaymentLink createPaymentLink(PaymentLink paymentLink) {
        // Generate URL
        String baseUrl = "https://pay.securegateway.com/";
        paymentLink.setUrl(baseUrl + paymentLink.getLinkId());
        
        return paymentLinkRepository.save(paymentLink);
    }

    public Optional<PaymentLink> getPaymentLinkById(String linkId) {
        return paymentLinkRepository.findByLinkId(linkId);
    }

    public PaymentLink updatePaymentLink(String linkId, Map<String, Object> updates) {
        Optional<PaymentLink> linkOpt = paymentLinkRepository.findByLinkId(linkId);
        if (linkOpt.isPresent()) {
            PaymentLink link = linkOpt.get();
            
            if (updates.containsKey("title")) {
                link.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("description")) {
                link.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("status")) {
                link.setStatus(PaymentLinkStatus.valueOf((String) updates.get("status")));
            }
            
            return paymentLinkRepository.save(link);
        }
        throw new RuntimeException("Payment link not found");
    }

    public void deletePaymentLink(String linkId) {
        Optional<PaymentLink> linkOpt = paymentLinkRepository.findByLinkId(linkId);
        if (linkOpt.isPresent()) {
            paymentLinkRepository.delete(linkOpt.get());
        } else {
            throw new RuntimeException("Payment link not found");
        }
    }

    public void incrementUsageCount(String linkId) {
        Optional<PaymentLink> linkOpt = paymentLinkRepository.findByLinkId(linkId);
        if (linkOpt.isPresent()) {
            PaymentLink link = linkOpt.get();
            link.setUsageCount(link.getUsageCount() + 1);
            
            // Check if max usage reached
            if (link.getMaxUsage() != null && link.getUsageCount() >= link.getMaxUsage()) {
                link.setStatus(PaymentLinkStatus.INACTIVE);
            }
            
            paymentLinkRepository.save(link);
        }
    }
}

package com.example.paymentgateway.service;

import com.example.paymentgateway.model.PaymentMethod;
import com.example.paymentgateway.model.User;
import com.example.paymentgateway.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentMethodService {
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Transactional
    public PaymentMethod addPaymentMethod(User user, PaymentMethod paymentMethod) {
        // Business rule: only enabled users can add payment methods
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }
        // Business rule: type must be supported
        if (!isSupportedType(paymentMethod.getType())) {
            throw new IllegalArgumentException("Unsupported payment method type");
        }
        paymentMethod.setUser(user);
        paymentMethod.setMerchantId(user.getMerchantId());
        paymentMethod.setBankId(user.getBankId());
        return paymentMethodRepository.save(paymentMethod);
    }

    private boolean isSupportedType(String type) {
        return type != null && (type.equalsIgnoreCase("CREDIT_CARD") || type.equalsIgnoreCase("BANK_TRANSFER"));
    }

    public List<PaymentMethod> getUserPaymentMethods(User user) {
        if (user.getMerchantId() != null) {
            return paymentMethodRepository.findByUserIdAndMerchantId(user.getId(), user.getMerchantId());
        } else if (user.getBankId() != null) {
            return paymentMethodRepository.findByUserIdAndBankId(user.getId(), user.getBankId());
        } else {
            return paymentMethodRepository.findByUserId(user.getId());
        }
    }
}

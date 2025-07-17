package com.securepay.service;

import com.securepay.entity.PaymentMethod;
import com.securepay.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public List<PaymentMethod> getPaymentMethodsByUserId(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public List<PaymentMethod> getActivePaymentMethodsByUserId(Long userId) {
        return paymentMethodRepository.findByUserIdAndIsActive(userId, true);
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        // If this is set as default, unset other defaults for this user
        if (paymentMethod.getIsDefault()) {
            List<PaymentMethod> userMethods = paymentMethodRepository.findByUserId(paymentMethod.getUserId());
            for (PaymentMethod method : userMethods) {
                if (method.getIsDefault()) {
                    method.setIsDefault(false);
                    paymentMethodRepository.save(method);
                }
            }
        }
        
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(Long id, Map<String, Object> updates) {
        Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(id);
        if (methodOpt.isPresent()) {
            PaymentMethod method = methodOpt.get();
            
            if (updates.containsKey("isDefault") && (Boolean) updates.get("isDefault")) {
                // Unset other defaults for this user
                List<PaymentMethod> userMethods = paymentMethodRepository.findByUserId(method.getUserId());
                for (PaymentMethod userMethod : userMethods) {
                    if (userMethod.getIsDefault()) {
                        userMethod.setIsDefault(false);
                        paymentMethodRepository.save(userMethod);
                    }
                }
                method.setIsDefault(true);
            }
            
            if (updates.containsKey("isActive")) {
                method.setIsActive((Boolean) updates.get("isActive"));
            }
            
            return paymentMethodRepository.save(method);
        }
        throw new RuntimeException("Payment method not found");
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}

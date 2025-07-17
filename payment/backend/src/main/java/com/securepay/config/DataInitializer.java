package com.securepay.config;

import com.securepay.entity.*;
import com.securepay.repository.UserRepository;
import com.securepay.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create demo users if they don't exist
        createDemoUsers();
        createDemoTransactions();
    }

    private void createDemoUsers() {
        // Customer
        if (!userRepository.existsByEmail("customer@demo.com")) {
            User customer = new User();
            customer.setEmail("customer@demo.com");
            customer.setPassword("demo123");
            customer.setName("Demo Customer");
            customer.setRole(UserRole.CUSTOMER);
            customer.setPermissions(Arrays.asList(Permission.VIEW_TRANSACTIONS, Permission.MAKE_PAYMENTS));
            userRepository.save(customer);
        }

        // Merchant
        if (!userRepository.existsByEmail("merchant@demo.com")) {
            User merchant = new User();
            merchant.setEmail("merchant@demo.com");
            merchant.setPassword("demo123");
            merchant.setName("Demo Merchant");
            merchant.setRole(UserRole.MERCHANT);
            merchant.setCompanyName("Demo Store Inc.");
            merchant.setMerchantId("MERCH_DEMO_001");
            merchant.setPermissions(Arrays.asList(Permission.VIEW_TRANSACTIONS, Permission.MANAGE_PAYMENTS, Permission.VIEW_ANALYTICS));
            userRepository.save(merchant);
        }

        // Admin
        if (!userRepository.existsByEmail("admin@demo.com")) {
            User admin = new User();
            admin.setEmail("admin@demo.com");
            admin.setPassword("demo123");
            admin.setName("Demo Admin");
            admin.setRole(UserRole.BANK_ADMIN);
            admin.setCompanyName("SecurePay Bank");
            admin.setBankId("BANK_DEMO_001");
            admin.setPermissions(Arrays.asList(Permission.FULL_ACCESS, Permission.MANAGE_USERS, Permission.SYSTEM_ADMIN));
            userRepository.save(admin);
        }
    }

    private void createDemoTransactions() {
        if (transactionRepository.count() == 0) {
            Optional<User> customerOpt = userRepository.findByEmail("customer@demo.com");
            if (customerOpt.isPresent()) {
                User customer = customerOpt.get();
                // Create some demo transactions
                Transaction tx1 = new Transaction();
                tx1.setTransactionId("TXN-DEMO-001");
                tx1.setUserId(customer.getId());
                tx1.setMerchantId("MERCH_DEMO_001");
                tx1.setMerchantName("Demo Store");
                tx1.setAmount(new BigDecimal("99.99"));
                tx1.setCurrency("USD");
                tx1.setStatus(TransactionStatus.COMPLETED);
                tx1.setPaymentMethod("Credit Card");
                tx1.setDescription("Demo purchase");
                tx1.setCategory("Shopping");
                transactionRepository.save(tx1);

                Transaction tx2 = new Transaction();
                tx2.setTransactionId("TXN-DEMO-002");
                tx2.setUserId(customer.getId());
                tx2.setMerchantId("MERCH_DEMO_001");
                tx2.setMerchantName("Demo Store");
                tx2.setAmount(new BigDecimal("49.99"));
                tx2.setCurrency("USD");
                tx2.setStatus(TransactionStatus.PENDING);
                tx2.setPaymentMethod("Debit Card");
                tx2.setDescription("Another demo purchase");
                tx2.setCategory("Electronics");
                transactionRepository.save(tx2);

                Transaction tx3 = new Transaction();
                tx3.setTransactionId("TXN-DEMO-003");
                tx3.setUserId(customer.getId());
                tx3.setMerchantId("MERCH_DEMO_001");
                tx3.setMerchantName("Demo Store");
                tx3.setAmount(new BigDecimal("25.50"));
                tx3.setCurrency("USD");
                tx3.setStatus(TransactionStatus.FAILED);
                tx3.setPaymentMethod("Credit Card");
                tx3.setDescription("Failed demo transaction");
                tx3.setCategory("Food");
                tx3.setFailureReason("Insufficient funds");
                transactionRepository.save(tx3);
            }
        }
    }
}

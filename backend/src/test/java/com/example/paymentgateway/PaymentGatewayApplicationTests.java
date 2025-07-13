package com.example.paymentgateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PaymentGatewayApplicationTests {

    @Test
    void contextLoads() {
        // Basic context load test
    }

    // Example: Test user repository bean loads
    @org.springframework.beans.factory.annotation.Autowired
    private com.example.paymentgateway.repository.UserRepository userRepository;

    @Test
    void userRepositoryLoads() {
        org.assertj.core.api.Assertions.assertThat(userRepository).isNotNull();
    }

    // Example: Test transaction service bean loads
    @org.springframework.beans.factory.annotation.Autowired
    private com.example.paymentgateway.service.TransactionService transactionService;

    @Test
    void transactionServiceLoads() {
        org.assertj.core.api.Assertions.assertThat(transactionService).isNotNull();
    }

    // Example: Test Kafka producer bean loads
    @org.springframework.beans.factory.annotation.Autowired
    private com.example.paymentgateway.kafka.KafkaProducerService kafkaProducerService;

    @Test
    void kafkaProducerServiceLoads() {
        org.assertj.core.api.Assertions.assertThat(kafkaProducerService).isNotNull();
    }

    // Example: Test security config bean loads
    @org.springframework.beans.factory.annotation.Autowired
    private com.example.paymentgateway.config.SecurityConfig securityConfig;

    @Test
    void securityConfigLoads() {
        org.assertj.core.api.Assertions.assertThat(securityConfig).isNotNull();
    }
}

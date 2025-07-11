package com.example.paymentgateway.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    @KafkaListener(topics = "transactions", groupId = "payment-gateway-group")
    public void listenTransactionEvents(ConsumerRecord<String, String> record) {
        // Process transaction event (e.g., for saga orchestration, audit, etc.)
        System.out.println("Received Kafka event: " + record.value());
    }
}

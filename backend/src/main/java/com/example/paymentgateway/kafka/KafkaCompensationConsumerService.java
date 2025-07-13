package com.example.paymentgateway.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaCompensationConsumerService {
    @KafkaListener(topics = "compensation-events", groupId = "payment-gateway-group")
    public void listenCompensationEvents(ConsumerRecord<String, String> record) {
        // Process compensation event (e.g., rollback, refund, etc.)
        System.out.println("Received COMPENSATION event: " + record.value());
    }
}

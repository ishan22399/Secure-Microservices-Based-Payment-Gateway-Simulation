package com.example.paymentgateway.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaSagaConsumerService {
    @KafkaListener(topics = "saga-events", groupId = "payment-gateway-group")
    public void listenSagaEvents(ConsumerRecord<String, String> record) {
        // Process saga event (e.g., orchestrate distributed transaction steps)
        System.out.println("Received SAGA event: " + record.value());
    }
}

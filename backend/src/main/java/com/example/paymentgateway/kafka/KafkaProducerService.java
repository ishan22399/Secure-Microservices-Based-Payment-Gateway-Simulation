package com.example.paymentgateway.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private static final String TOPIC = "transactions";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendTransactionEvent(String message) {
        kafkaTemplate.send(TOPIC, message);
    }
}

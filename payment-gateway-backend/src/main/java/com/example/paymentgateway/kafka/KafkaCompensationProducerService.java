package com.example.paymentgateway.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KafkaCompensationProducerService {
    private static final String COMPENSATION_TOPIC = "compensation-events";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendCompensationEvent(String message) {
        kafkaTemplate.send(COMPENSATION_TOPIC, message);
    }
}

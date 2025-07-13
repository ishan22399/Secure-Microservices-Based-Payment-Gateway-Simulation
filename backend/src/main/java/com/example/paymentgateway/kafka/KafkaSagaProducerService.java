package com.example.paymentgateway.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KafkaSagaProducerService {
    private static final String SAGA_TOPIC = "saga-events";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendSagaEvent(String message) {
        kafkaTemplate.send(SAGA_TOPIC, message);
    }
}

package com.example.paymentgateway.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/notifications")
public class NotificationStreamController {
    @GetMapping("/stream")
    public SseEmitter streamNotifications() {
        SseEmitter emitter = new SseEmitter();
        // For demonstration, send a notification every 2 seconds, 5 times
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(new Runnable() {
            int count = 0;
            @Override
            public void run() {
                try {
                    if (count < 5) {
                        emitter.send(SseEmitter.event()
                                .name("notification")
                                .data("Notification message #" + (count + 1)));
                        count++;
                    } else {
                        emitter.complete();
                    }
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        }, 0, 2, TimeUnit.SECONDS);
        return emitter;
    }
}

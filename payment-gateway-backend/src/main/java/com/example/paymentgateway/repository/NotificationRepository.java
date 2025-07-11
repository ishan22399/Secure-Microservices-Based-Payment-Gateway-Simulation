package com.example.paymentgateway.repository;

import com.example.paymentgateway.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUsername(String username);
}

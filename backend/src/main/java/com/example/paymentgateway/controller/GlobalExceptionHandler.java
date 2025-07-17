package com.example.paymentgateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex, HttpServletRequest request) {
        System.out.println("[GLOBAL EXCEPTION HANDLER] Exception: " + ex.getClass().getName() + ": " + ex.getMessage());
        ex.printStackTrace();
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("error", ex.getClass().getSimpleName());
        errorBody.put("message", ex.getMessage());
        errorBody.put("path", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .contentType(MediaType.APPLICATION_JSON)
                .body(errorBody);
    }
}

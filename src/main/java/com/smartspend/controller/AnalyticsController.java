package com.smartspend.controller;

import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // Overall analytics
    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                analyticsService.getUserAnalytics(userId)
        );
    }

    // Category-wise expense analytics
    @GetMapping("/user/{userId}/category-wise")
    public ResponseEntity<Map<String, Double>> getCategoryWiseExpenses(
            @PathVariable Long userId) {
        Map<String, Double> result = analyticsService.getCategoryWiseExpenses(userId);
        return ResponseEntity.ok(result);
    }
}
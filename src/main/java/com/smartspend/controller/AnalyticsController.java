package com.smartspend.controller;

import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                analyticsService.getUserAnalytics(userId)
        );
    }
    @GetMapping("/user/{userId}/category-wise")
    public ResponseEntity<java.util.Map<Long, Double>>
    getCategoryWiseExpenses(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                analyticsService.getCategoryWiseExpenses(userId)
        );
    }
}
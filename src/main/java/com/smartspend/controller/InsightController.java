package com.smartspend.controller;

import com.smartspend.dto.InsightResponse;
import com.smartspend.service.InsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<InsightResponse> getUserInsights(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                insightService.getUserInsights(userId)
        );
    }
}
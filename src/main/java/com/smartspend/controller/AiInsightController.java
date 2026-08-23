package com.smartspend.controller;

import com.smartspend.entity.AiInsight;
import com.smartspend.service.AiInsightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-insights")
public class AiInsightController {

    private final AiInsightService aiInsightService;

    public AiInsightController(AiInsightService aiInsightService) {
        this.aiInsightService = aiInsightService;
    }

    // Create AI insight
    @PostMapping
    public ResponseEntity<AiInsight> createInsight(
            @RequestBody AiInsight insight) {

        return new ResponseEntity<>(
                aiInsightService.createInsight(insight),
                HttpStatus.CREATED
        );
    }

    // Get insight by ID
    @GetMapping("/{id}")
    public ResponseEntity<AiInsight> getInsightById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                aiInsightService.getInsightById(id)
        );
    }

    // Get all insights of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AiInsight>> getInsightsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                aiInsightService.getInsightsByUserId(userId)
        );
    }

    // Get all insights
    @GetMapping
    public ResponseEntity<List<AiInsight>> getAllInsights() {

        return ResponseEntity.ok(
                aiInsightService.getAllInsights()
        );
    }

    // Delete insight
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInsight(
            @PathVariable Long id) {

        aiInsightService.deleteInsight(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate/{userId}")
    public ResponseEntity<AiInsight> generatespendinginsight(@PathVariable Long userId){
        return ResponseEntity.ok(aiInsightService.generateSpendingInsight(userId));
    }
}

package com.smartspend.controller;

import com.smartspend.entity.SavingsGoal;
import com.smartspend.service.SavingsGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    // Create savings goal
    @PostMapping
    public ResponseEntity<SavingsGoal> createSavingsGoal(
            @RequestBody SavingsGoal savingsGoal) {

        return ResponseEntity.ok(
                savingsGoalService.createSavingsGoal(savingsGoal)
        );
    }

    // Get savings goal by ID
    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoal> getSavingsGoalById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                savingsGoalService.getSavingsGoalById(id)
        );
    }

    // Get savings goals of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingsGoal>> getSavingsGoalsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                savingsGoalService.getSavingsGoalsByUser(userId)
        );
    }

    // Update savings goal
    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> updateSavingsGoal(
            @PathVariable Long id,
            @RequestBody SavingsGoal savingsGoal) {

        return ResponseEntity.ok(
                savingsGoalService.updateSavingsGoal(id, savingsGoal)
        );
    }

    // Delete savings goal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavingsGoal(
            @PathVariable Long id) {

        savingsGoalService.deleteSavingsGoal(id);

        return ResponseEntity.noContent().build();
    }
}
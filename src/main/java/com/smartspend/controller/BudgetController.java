package com.smartspend.controller;

import com.smartspend.entity.Budget;
import com.smartspend.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // Create Budget
    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @RequestBody Budget budget) {

        return ResponseEntity.ok(
                budgetService.createBudget(budget)
        );
    }

    // Get all Budgets
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {

        return ResponseEntity.ok(
                budgetService.getAllBudgets()
        );
    }

    // Get Budgets by User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                budgetService.getBudgetsByUser(userId)
        );
    }

    // Get Budget by ID
    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService.getBudgetById(id)
        );
    }

    // Update Budget
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget) {

        return ResponseEntity.ok(
                budgetService.updateBudget(id, budget)
        );
    }

    // Delete Budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }
}
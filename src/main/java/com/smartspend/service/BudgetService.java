package com.smartspend.service;

import com.smartspend.entity.Budget;
import com.smartspend.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    // Create budget
    public Budget createBudget(Budget budget) {
        LocalDateTime now = LocalDateTime.now();

        budget.setCreatedAt(now);
        budget.setUpdatedAt(now);

        return budgetRepository.save(budget);
    }

    // Get all budgets
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    // Get budgets by user
    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    // Get budget by ID
    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
    }

    // Update budget
    public Budget updateBudget(Long id, Budget budgetDetails) {

        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        existingBudget.setUserId(budgetDetails.getUserId());
        existingBudget.setCategoryId(budgetDetails.getCategoryId());
        existingBudget.setAmount(budgetDetails.getAmount());
        existingBudget.setPeriod(budgetDetails.getPeriod());
        existingBudget.setStartDate(budgetDetails.getStartDate());
        existingBudget.setEndDate(budgetDetails.getEndDate());

        existingBudget.setUpdatedAt(LocalDateTime.now());

        return budgetRepository.save(existingBudget);
    }

    // Delete budget
    public void deleteBudget(Long id) {

        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found with id: " + id);
        }

        budgetRepository.deleteById(id);
    }
}
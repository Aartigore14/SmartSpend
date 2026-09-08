package com.smartspend.service;

import com.smartspend.entity.Budget;
import com.smartspend.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import com.smartspend.dto.BudgetAnalysisResponse;
import com.smartspend.entity.Category;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.CategoryRepository;
import com.smartspend.repository.TransactionRepository;
import java.util.ArrayList;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    public BudgetService(BudgetRepository budgetRepository, TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
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
    public List<BudgetAnalysisResponse> getBudgetAnalysis(Long userId) {

        List<Budget> budgets =
                budgetRepository.findByUserId(userId);

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        List<BudgetAnalysisResponse> results =
                new ArrayList<>();

        for (Budget budget : budgets) {

            double budgetAmount =
                    budget.getAmount().doubleValue();

            double spentAmount = 0.0;

            for (Transaction transaction : transactions) {

                if ("EXPENSE".equalsIgnoreCase(transaction.getType())
                        && transaction.getCategoryId().equals(budget.getCategoryId())
                        && !transaction.getTransactionDate().isBefore(budget.getStartDate())
                        && !transaction.getTransactionDate().isAfter(budget.getEndDate())) {

                    spentAmount += transaction.getAmount();
                }
            }

            double remainingAmount =
                    budgetAmount - spentAmount;

            double percentageUsed = 0.0;

            if (budgetAmount > 0) {
                percentageUsed =
                        (spentAmount / budgetAmount) * 100;
            }

            String status;

            if (spentAmount > budgetAmount) {
                status = "EXCEEDED";
            }
            else if (percentageUsed >= 80) {
                status = "WARNING";
            }
            else {
                status = "ON_TRACK";
            }

            Category category =
                    categoryRepository.findById(
                            budget.getCategoryId()
                    ).orElse(null);

            String categoryName =
                    category != null
                            ? category.getName()
                            : "Unknown";

            results.add(
                    new BudgetAnalysisResponse(
                            categoryName,
                            budgetAmount,
                            spentAmount,
                            remainingAmount,
                            percentageUsed,
                            status
                    )
            );
        }

        return results;
    }
}
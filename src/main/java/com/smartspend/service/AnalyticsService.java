package com.smartspend.service;

import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import com.smartspend.entity.Category;
import com.smartspend.repository.CategoryRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public AnalyticsService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public AnalyticsResponse getUserAnalytics(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        double totalIncome = 0.0;
        double totalExpense = 0.0;

        for (Transaction transaction : transactions) {

            if ("INCOME".equalsIgnoreCase(transaction.getType())) {
                totalIncome += transaction.getAmount();
            }

            else if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {
                totalExpense += transaction.getAmount();
            }
        }

        double balance = totalIncome - totalExpense;

        double savingsRate = 0.0;

        if (totalIncome > 0) {
            savingsRate =
                    (balance / totalIncome) * 100;
        }

        return new AnalyticsResponse(
                totalIncome,
                totalExpense,
                balance,
                savingsRate,
                transactions.size()
        );
    }
    public Map<String, Double> getCategoryWiseExpenses(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        Map<String, Double> categoryExpenses =
                new HashMap<>();

        for (Transaction transaction : transactions) {

            if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {

                Long categoryId = transaction.getCategoryId();

                Category category = categoryRepository
                        .findById(categoryId)
                        .orElse(null);

                if (category != null) {

                    String categoryName = category.getName();

                    categoryExpenses.put(
                            categoryName,
                            categoryExpenses.getOrDefault(categoryName, 0.0)
                                    + transaction.getAmount()
                    );
                }
            }
        }

        return categoryExpenses;
    }
}

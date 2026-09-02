package com.smartspend.service;

import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;

    public AnalyticsService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
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
    public java.util.Map<Long, Double> getCategoryWiseExpenses(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        java.util.Map<Long, Double> categoryExpenses =
                new java.util.HashMap<>();

        for (Transaction transaction : transactions) {

            if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {

                Long categoryId = transaction.getCategoryId();

                categoryExpenses.put(
                        categoryId,
                        categoryExpenses.getOrDefault(categoryId, 0.0)
                                + transaction.getAmount()
                );
            }
        }

        return categoryExpenses;
    }
}

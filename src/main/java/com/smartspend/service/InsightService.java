package com.smartspend.service;

import com.smartspend.dto.InsightResponse;
import com.smartspend.entity.Category;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.CategoryRepository;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InsightService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public InsightService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository) {

        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public InsightResponse getUserInsights(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        double totalIncome = 0.0;
        double totalExpense = 0.0;

        Map<Long, Double> categoryExpenses = new HashMap<>();

        for (Transaction transaction : transactions) {

            if ("INCOME".equalsIgnoreCase(transaction.getType())) {

                totalIncome += transaction.getAmount();

            } else if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {

                totalExpense += transaction.getAmount();

                Long categoryId = transaction.getCategoryId();

                categoryExpenses.put(
                        categoryId,
                        categoryExpenses.getOrDefault(categoryId, 0.0)
                                + transaction.getAmount()
                );
            }
        }

        double balance = totalIncome - totalExpense;

        // Find highest spending category
        Long topCategoryId = null;
        double topCategoryAmount = 0.0;

        for (Map.Entry<Long, Double> entry : categoryExpenses.entrySet()) {

            if (entry.getValue() > topCategoryAmount) {

                topCategoryId = entry.getKey();
                topCategoryAmount = entry.getValue();
            }
        }

        // Find category name
        String topCategoryName = "No expenses";

        if (topCategoryId != null) {

            Category category =
                    categoryRepository.findById(topCategoryId).orElse(null);

            if (category != null) {
                topCategoryName = category.getName();
            }
        }

        // Generate intelligent insight
        String insight;
        String suggestion;

        if (totalIncome == 0 && totalExpense > 0) {

            insight = "You have recorded expenses but no income yet.";

            suggestion =
                    "Add your income transactions to get a more accurate view of your financial health.";

        } else if (totalExpense == 0) {

            insight = "You have no recorded expenses yet.";

            suggestion =
                    "Start tracking your expenses to understand your spending patterns.";

        } else if (balance < 0) {

            insight =
                    "Your expenses are currently higher than your income.";

            suggestion =
                    "Review your highest spending category and consider reducing non-essential expenses.";

        } else if (topCategoryAmount > totalExpense * 0.50) {

            insight =
                    "More than 50% of your expenses are concentrated in "
                            + topCategoryName + ".";

            suggestion =
                    "Consider reviewing your " + topCategoryName
                            + " expenses and look for opportunities to reduce them.";

        } else {

            insight =
                    "Your spending is distributed across multiple categories.";

            suggestion =
                    "Continue tracking your expenses and maintain a consistent savings habit.";
        }

        return new InsightResponse(
                totalExpense,
                totalIncome,
                balance,
                topCategoryName,
                topCategoryAmount,
                insight,
                suggestion
        );
    }
}
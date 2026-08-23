package com.smartspend.service;
import com.smartspend.entity.Category;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.CategoryRepository;
import com.smartspend.repository.TransactionRepository;
import java.util.HashMap;
import java.util.Map;
import com.smartspend.entity.AiInsight;
import com.smartspend.repository.AiInsightRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AiInsightService {

    private final AiInsightRepository aiInsightRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    public AiInsightService(AiInsightRepository aiInsightRepository, TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.aiInsightRepository = aiInsightRepository;
        this.transactionRepository= transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public AiInsight getInsightById(Long id) {
        return aiInsightRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "AI insight not found with id: " + id
                ));
    }

    public List<AiInsight> getInsightsByUserId(Long userId) {
        return aiInsightRepository.findByUserId(userId);
    }

    public List<AiInsight> getAllInsights() {
        return aiInsightRepository.findAll();
    }

    public void deleteInsight(Long id) {
        if (!aiInsightRepository.existsById(id)) {
            throw new RuntimeException(
                    "AI insight not found with id: " + id
            );
        }

        aiInsightRepository.deleteById(id);
    }

    public AiInsight generateSpendingInsight(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUserId(userId);

        if (transactions.isEmpty()) {
            throw new RuntimeException(
                    "No transactions found for user: " + userId
            );
        }

        Map<Long, Double> categoryTotals = new HashMap<>();

        for (Transaction transaction : transactions) {

            // Analyze only expenses
            if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {

                Long categoryId = transaction.getCategoryId();

                categoryTotals.put(
                        categoryId,
                        categoryTotals.getOrDefault(categoryId, 0.0)
                                + transaction.getAmount()
                );
            }
        }

        if (categoryTotals.isEmpty()) {
            throw new RuntimeException(
                    "No expense transactions found for user: " + userId
            );
        }

        // Find highest spending category
        Long highestCategoryId = null;
        Double highestAmount = 0.0;

        for (Map.Entry<Long, Double> entry : categoryTotals.entrySet()) {

            if (entry.getValue() > highestAmount) {
                highestAmount = entry.getValue();
                highestCategoryId = entry.getKey();
            }
        }

        final Long categoryId = highestCategoryId;
        Category category = categoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: " + categoryId)
                );

        String content =
                "Your highest spending category is "
                        + category.getName()
                        + " with total spending of ₹"
                        + String.format("%.2f", highestAmount)
                        + ". Consider setting a monthly "
                        + category.getName().toLowerCase()
                        + " budget to control your expenses.";

        AiInsight insight = new AiInsight();

        insight.setUserId(userId);
        insight.setInsightType("SPENDING_ANALYSIS");
        insight.setContent(content);

        return aiInsightRepository.save(insight);
    }
    public AiInsight createInsight(AiInsight insight) {
        return aiInsightRepository.save(insight);
    }
}

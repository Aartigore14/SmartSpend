package com.smartspend.service;

import com.smartspend.entity.RecurringTransaction;
import com.smartspend.entity.Transaction;
import com.smartspend.repository.RecurringTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionService transactionService;

    public RecurringTransactionService(
            RecurringTransactionRepository recurringTransactionRepository,
            TransactionService transactionService) {

        this.recurringTransactionRepository = recurringTransactionRepository;
        this.transactionService = transactionService;
    }


    // Create recurring transaction
    public RecurringTransaction createRecurringTransaction(
            RecurringTransaction recurringTransaction) {

        LocalDateTime now = LocalDateTime.now();

        recurringTransaction.setCreatedAt(now);
        recurringTransaction.setUpdatedAt(now);

        // First transaction will be due on start date
        recurringTransaction.setNextDueDate(
                recurringTransaction.getStartDate()
        );

        recurringTransaction.setActive(true);

        return recurringTransactionRepository.save(recurringTransaction);
    }


    // Get all recurring transactions of a user
    public List<RecurringTransaction> getRecurringTransactionsByUser(
            Long userId) {

        return recurringTransactionRepository.findByUserId(userId);
    }


    // Get recurring transaction by ID
    public RecurringTransaction getRecurringTransactionById(Long id) {

        return recurringTransactionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException( HttpStatus.NOT_FOUND,
                                "Recurring transaction not found"
                        ));
    }


    // Update recurring transaction
    public RecurringTransaction updateRecurringTransaction(
            Long id,
            RecurringTransaction updatedTransaction) {

        RecurringTransaction existing =
                recurringTransactionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND,
                                        "Recurring transaction not found"
                                ));

        existing.setCategoryId(updatedTransaction.getCategoryId());
        existing.setType(updatedTransaction.getType());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setFrequency(updatedTransaction.getFrequency());
        existing.setStartDate(updatedTransaction.getStartDate());
        existing.setEndDate(updatedTransaction.getEndDate());
        existing.setDescription(updatedTransaction.getDescription());
        existing.setStatus(updatedTransaction.getStatus());
        existing.setActive(updatedTransaction.getActive());
        existing.setUpdatedAt(LocalDateTime.now());

        return recurringTransactionRepository.save(existing);
    }


    // Delete recurring transaction
    public void deleteRecurringTransaction(Long id) {

        if (!recurringTransactionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Recurring transaction not found"
            );
        }

        recurringTransactionRepository.deleteById(id);
    }


    // Generate transactions that are due
    public void processDueTransactions() {

        LocalDate today = LocalDate.now();

        List<RecurringTransaction> dueTransactions =
                recurringTransactionRepository
                        .findByActiveTrueAndNextDueDateLessThanEqual(today);

        for (RecurringTransaction recurring : dueTransactions) {

            // Create normal transaction
            Transaction transaction = new Transaction();

            transaction.setUserId(recurring.getUserId());
            transaction.setCategoryId(recurring.getCategoryId());
            transaction.setType(recurring.getType());
            transaction.setAmount(recurring.getAmount());
            transaction.setDescription(recurring.getDescription());
            transaction.setTransactionDate(recurring.getNextDueDate());

            transactionService.createTransaction(transaction);


            // Calculate next due date
            LocalDate nextDate = calculateNextDueDate(
                    recurring.getNextDueDate(),
                    recurring.getFrequency()
            );


            // Stop recurrence if end date is reached
            if (recurring.getEndDate() != null
                    && nextDate.isAfter(recurring.getEndDate())) {

                recurring.setActive(false);

            } else {

                recurring.setNextDueDate(nextDate);
            }

            recurring.setUpdatedAt(LocalDateTime.now());

            recurringTransactionRepository.save(recurring);
        }
    }


    // Calculate next occurrence
    private LocalDate calculateNextDueDate(
            LocalDate currentDate,
            String frequency) {

        switch (frequency.toUpperCase()) {

            case "DAILY":
                return currentDate.plusDays(1);

            case "WEEKLY":
                return currentDate.plusWeeks(1);

            case "MONTHLY":
                return currentDate.plusMonths(1);

            case "YEARLY":
                return currentDate.plusYears(1);

            default:
                throw new RuntimeException(
                        "Invalid frequency: " + frequency
                );
        }
    }
}
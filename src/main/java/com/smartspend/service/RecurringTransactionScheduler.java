package com.smartspend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RecurringTransactionScheduler {

    private final RecurringTransactionService
            recurringTransactionService;

    public RecurringTransactionScheduler(
            RecurringTransactionService recurringTransactionService) {

        this.recurringTransactionService =
                recurringTransactionService;
    }


    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void processRecurringTransactions() {

        recurringTransactionService.processDueTransactions();
    }
}
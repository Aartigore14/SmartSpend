package com.smartspend.controller;

import com.smartspend.entity.RecurringTransaction;
import com.smartspend.service.RecurringTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {

    private final RecurringTransactionService
            recurringTransactionService;

    public RecurringTransactionController(
            RecurringTransactionService recurringTransactionService) {

        this.recurringTransactionService =
                recurringTransactionService;
    }


    // Create recurring transaction
    @PostMapping
    public ResponseEntity<RecurringTransaction>
    createRecurringTransaction(
            @RequestBody RecurringTransaction recurringTransaction) {

        return ResponseEntity.ok(
                recurringTransactionService
                        .createRecurringTransaction(recurringTransaction)
        );
    }


    // Get recurring transactions by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecurringTransaction>>
    getRecurringTransactionsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                recurringTransactionService
                        .getRecurringTransactionsByUser(userId)
        );
    }


    // Get recurring transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<RecurringTransaction>
    getRecurringTransactionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                recurringTransactionService
                        .getRecurringTransactionById(id)
        );
    }


    // Update recurring transaction
    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransaction>
    updateRecurringTransaction(
            @PathVariable Long id,
            @RequestBody RecurringTransaction recurringTransaction) {

        return ResponseEntity.ok(
                recurringTransactionService
                        .updateRecurringTransaction(
                                id,
                                recurringTransaction
                        )
        );
    }

    @PostMapping("/process-due")
    public ResponseEntity<String> processDueTransactions(){
        recurringTransactionService.processDueTransactions();
        return ResponseEntity.ok("Due recurring transactions processed");
    }


    // Delete recurring transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringTransaction(
            @PathVariable Long id) {

        recurringTransactionService
                .deleteRecurringTransaction(id);

        return ResponseEntity.noContent().build();
    }
}
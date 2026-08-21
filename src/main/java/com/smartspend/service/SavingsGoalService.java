package com.smartspend.service;

import com.smartspend.entity.SavingsGoal;
import com.smartspend.repository.SavingsGoalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    // Create savings goal
    public SavingsGoal createSavingsGoal(SavingsGoal savingsGoal) {
        return savingsGoalRepository.save(savingsGoal);
    }

    // Get savings goal by ID
    public SavingsGoal getSavingsGoalById(Long id) {
        return savingsGoalRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,"Savings goal not found with id: " + id));
    }

    // Get all savings goals of a user
    public List<SavingsGoal> getSavingsGoalsByUser(Long userId) {
        return savingsGoalRepository.findByUserId(userId);
    }

    // Update savings goal
    public SavingsGoal updateSavingsGoal(Long id, SavingsGoal updatedGoal) {

        SavingsGoal existingGoal = getSavingsGoalById(id);

        existingGoal.setUserId(updatedGoal.getUserId());
        existingGoal.setName(updatedGoal.getName());
        existingGoal.setTargetAmount(updatedGoal.getTargetAmount());
        existingGoal.setCurrentAmount(updatedGoal.getCurrentAmount());
        existingGoal.setTargetDate(updatedGoal.getTargetDate());
        existingGoal.setStatus(updatedGoal.getStatus());

        return savingsGoalRepository.save(existingGoal);
    }

    // Delete savings goal
    public void deleteSavingsGoal(Long id) {
        SavingsGoal existingGoal = getSavingsGoalById(id);
        savingsGoalRepository.delete(existingGoal);
    }
}
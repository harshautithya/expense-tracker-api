package com.harsh.expense_tracker.service;

import com.harsh.expense_tracker.entity.Expense;
import com.harsh.expense_tracker.exception.ExpenseNotFoundException;
import com.harsh.expense_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    public Expense createExpense(Expense expense){
        return expenseRepository.save(expense);
    }
    public List<Expense> getAllExpenses(){
        return expenseRepository.findAll();
    }
    public Expense getExpenseById(Long id){
        return expenseRepository.findById(id).orElseThrow(() -> new ExpenseNotFoundException(id));
    }
    public Expense updateExpense(Long id,Expense expense){
        Expense existingExpense=expenseRepository.findById(id).
                orElseThrow(() -> new ExpenseNotFoundException(id));
        existingExpense.setTitle(expense.getTitle());
        existingExpense.setAmount(expense.getAmount());
        return expenseRepository.save(existingExpense);
    }
    public void deleteExpense(Long id){
        Expense expense = expenseRepository.findById(id).
                orElseThrow(() -> new ExpenseNotFoundException(id));
        expenseRepository.delete(expense);
    }
}

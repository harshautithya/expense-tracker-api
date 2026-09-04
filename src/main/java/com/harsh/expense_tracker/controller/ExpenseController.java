package com.harsh.expense_tracker.controller;

import com.harsh.expense_tracker.entity.Expense;
import com.harsh.expense_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExpenseController {
   private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {

        this.expenseService = expenseService;
    }
    @PostMapping("/expenses")
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense){
        Expense createdExpense=expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }
    @GetMapping ("/expenses")
    public List<Expense> getAllExpenses(){
        return expenseService.getAllExpenses();
    }
    @GetMapping ("/expenses/{id}")
    public Expense getExpenseById(@PathVariable Long id){
        return expenseService.getExpenseById(id);
    }
    @PutMapping ("/expenses/{id}")
    public Expense updateExpense(@PathVariable Long id,@Valid @RequestBody Expense expense){
        return expenseService.updateExpense(id,expense);

    }
    @DeleteMapping ("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id){
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();

    }
}

package com.smartspend.service;

import com.smartspend.entity.Category;
import com.smartspend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getCategoriesByUser(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category updateCategory(Long id, Category updatedCategory) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(updatedCategory.getName());
        category.setType(updatedCategory.getType());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
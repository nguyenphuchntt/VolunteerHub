package com.uet.VolunteerHub.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;

public class ValidEventCategoryValidator implements ConstraintValidator<ValidEventCategory, String> {

    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "Environment",
            "Community Service",
            "Education",
            "Health & Wellness",
            "Animal Welfare",
            "Other");

    @Override
    public void initialize(ValidEventCategory constraintAnnotation) {

    }

    @Override
    public boolean isValid(String category, ConstraintValidatorContext context) {
        if (category == null || category.isBlank()) {
            return false;
        }
        return ALLOWED_CATEGORIES.contains(category);
    }
}

package com.uet.VolunteerHub.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validation annotation to ensure event category is one of the allowed values.
 */
@Documented
@Constraint(validatedBy = ValidEventCategoryValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEventCategory {
    String message() default "Category must be one of: Environment, Community Service, Education, Health & Wellness, Animal Welfare, Other";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

package com.andersonguse.sddemployeelist.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EmployeeRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email address is required")
        @Email(message = "Email address must be valid")
        String email,

        @NotBlank(message = "Phone number is required")
        @Size(min = 7, max = 30, message = "Phone number must be between 7 and 30 characters")
        @Pattern(regexp = "^\\+?[0-9 .()\\-]+$", message = "Phone number contains unsupported characters")
        String phoneNumber
) {
}

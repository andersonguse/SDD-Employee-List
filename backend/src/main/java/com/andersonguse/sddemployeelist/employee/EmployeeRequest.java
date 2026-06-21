package com.andersonguse.sddemployeelist.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EmployeeRequest(
        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[A-Za-z ]+$", message = "Name may contain English letters and spaces only")
        String name,

        @NotBlank(message = "Email address is required")
        @Email(message = "Email address must be valid")
        String email,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\d{3}-\\d{3}-\\d{4}$", message = "Phone number must be in 123-456-7890 format")
        String phoneNumber
) {
}

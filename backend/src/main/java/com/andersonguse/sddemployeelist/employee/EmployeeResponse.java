package com.andersonguse.sddemployeelist.employee;

public record EmployeeResponse(
        Long id,
        String name,
        String email,
        String phoneNumber
) {
    static EmployeeResponse from(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhoneNumber()
        );
    }
}

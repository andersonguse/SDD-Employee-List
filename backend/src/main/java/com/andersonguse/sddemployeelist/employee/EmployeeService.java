package com.andersonguse.sddemployeelist.employee;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andersonguse.sddemployeelist.shared.DuplicateEmailException;
import com.andersonguse.sddemployeelist.shared.NotFoundException;

@Service
public class EmployeeService {

    private static final String PHONE_FORMAT_PATTERN = "\\d{3}-\\d{3}-\\d{4}";
    private static final String PHONE_FORMAT_MESSAGE = "Phone number must be in 123-456-7890 format";
    private static final String NAME_FORMAT_PATTERN = "[A-Za-z ]+";
    private static final String NAME_FORMAT_MESSAGE = "Name may contain English letters and spaces only";
    private static final String DUPLICATE_EMAIL_MESSAGE = "Cannot use existing email";

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        String name = normalizeName(request.name());
        String email = normalizeEmail(request.email());
        String phoneNumber = normalizePhoneNumber(request.phoneNumber());

        if (employeeRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateEmailException("email", DUPLICATE_EMAIL_MESSAGE);
        }

        Employee employee = new Employee(name, email, phoneNumber);
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> listEmployees() {
        return employeeRepository.findAllByOrderByIdAsc()
                .stream()
                .map(EmployeeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployee(Long id) {
        return EmployeeResponse.from(findEmployee(id));
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = findEmployee(id);
        String name = normalizeName(request.name());
        String email = normalizeEmail(request.email());
        String phoneNumber = normalizePhoneNumber(request.phoneNumber());

        if (employeeRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new DuplicateEmailException("email", DUPLICATE_EMAIL_MESSAGE);
        }

        employee.setName(name);
        employee.setEmail(email);
        employee.setPhoneNumber(phoneNumber);
        return EmployeeResponse.from(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = findEmployee(id);
        employeeRepository.delete(employee);
    }

    private Employee findEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found"));
    }

    private String normalizeEmail(String value) {
        return normalizeRequired(value).toLowerCase();
    }

    private String normalizeName(String value) {
        String normalized = normalizeRequired(value);
        if (!normalized.matches(NAME_FORMAT_PATTERN)) {
            throw new IllegalArgumentException(NAME_FORMAT_MESSAGE);
        }
        return normalized;
    }

    private String normalizePhoneNumber(String value) {
        String normalized = normalizeRequired(value);
        if (!normalized.matches(PHONE_FORMAT_PATTERN)) {
            throw new IllegalArgumentException(PHONE_FORMAT_MESSAGE);
        }
        return normalized;
    }

    private String normalizeRequired(String value) {
        return value == null ? "" : value.trim();
    }
}

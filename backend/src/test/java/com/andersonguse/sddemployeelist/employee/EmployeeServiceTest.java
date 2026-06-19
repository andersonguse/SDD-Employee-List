package com.andersonguse.sddemployeelist.employee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.andersonguse.sddemployeelist.shared.DuplicateEmailException;
import com.andersonguse.sddemployeelist.shared.NotFoundException;
import com.andersonguse.sddemployeelist.support.PostgresIntegrationTest;

class EmployeeServiceTest extends PostgresIntegrationTest {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void resetDatabase() {
        employeeRepository.deleteAll();
    }

    @Test
    void createsEmployeeWithNormalizedValues() {
        EmployeeResponse response = employeeService.createEmployee(
                new EmployeeRequest(" Ada Lovelace ", " ADA@Example.COM ", " 555-010-0100 "));

        assertThat(response.id()).isPositive();
        assertThat(response.name()).isEqualTo("Ada Lovelace");
        assertThat(response.email()).isEqualTo("ada@example.com");
        assertThat(response.phoneNumber()).isEqualTo("555-010-0100");
    }

    @Test
    void rejectsInvalidPhoneOnCreate() {
        assertThatThrownBy(() -> employeeService.createEmployee(
                new EmployeeRequest("Ada Lovelace", "ada@example.com", "555-0100")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Phone number must be in 123-456-7890 format");
    }

    @Test
    void rejectsDuplicateEmailOnCreate() {
        employeeService.createEmployee(new EmployeeRequest("Ada Lovelace", "ada@example.com", "555-010-0100"));

        assertThatThrownBy(() -> employeeService.createEmployee(
                new EmployeeRequest("Grace Hopper", "ADA@example.com", "555-010-0101")))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("already used");
    }

    @Test
    void listsEmployeesOrderedById() {
        EmployeeResponse first = employeeService.createEmployee(new EmployeeRequest("Ada", "ada@example.com", "555-010-0100"));
        EmployeeResponse second = employeeService.createEmployee(new EmployeeRequest("Grace", "grace@example.com", "555-010-0101"));

        List<EmployeeResponse> employees = employeeService.listEmployees();

        assertThat(employees).extracting(EmployeeResponse::id).containsExactly(first.id(), second.id());
    }

    @Test
    void returnsEmptyListWhenNoEmployeesExist() {
        assertThat(employeeService.listEmployees()).isEmpty();
    }

    @Test
    void updatesEmployeeAndPreservesId() {
        EmployeeResponse created = employeeService.createEmployee(new EmployeeRequest("Ada", "ada@example.com", "555-010-0100"));

        EmployeeResponse updated = employeeService.updateEmployee(
                created.id(),
                new EmployeeRequest("Ada Byron", "ada.byron@example.com", "555-020-0200"));

        assertThat(updated.id()).isEqualTo(created.id());
        assertThat(updated.name()).isEqualTo("Ada Byron");
        assertThat(updated.email()).isEqualTo("ada.byron@example.com");
        assertThat(updated.phoneNumber()).isEqualTo("555-020-0200");
    }

    @Test
    void rejectsInvalidPhoneOnUpdateAndKeepsExistingValues() {
        EmployeeResponse created = employeeService.createEmployee(new EmployeeRequest("Ada", "ada@example.com", "555-010-0100"));

        assertThatThrownBy(() -> employeeService.updateEmployee(
                created.id(),
                new EmployeeRequest("Ada Byron", "ada.byron@example.com", "555-0200")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Phone number must be in 123-456-7890 format");

        EmployeeResponse unchanged = employeeService.getEmployee(created.id());
        assertThat(unchanged.name()).isEqualTo("Ada");
        assertThat(unchanged.email()).isEqualTo("ada@example.com");
        assertThat(unchanged.phoneNumber()).isEqualTo("555-010-0100");
    }

    @Test
    void rejectsDuplicateEmailOnUpdateAndKeepsExistingValues() {
        employeeService.createEmployee(new EmployeeRequest("Ada", "ada@example.com", "555-010-0100"));
        EmployeeResponse grace = employeeService.createEmployee(new EmployeeRequest("Grace", "grace@example.com", "555-010-0101"));

        assertThatThrownBy(() -> employeeService.updateEmployee(
                grace.id(),
                new EmployeeRequest("Grace Hopper", "ada@example.com", "555-222-2222")))
                .isInstanceOf(DuplicateEmailException.class);

        EmployeeResponse unchanged = employeeService.getEmployee(grace.id());
        assertThat(unchanged.name()).isEqualTo("Grace");
        assertThat(unchanged.email()).isEqualTo("grace@example.com");
        assertThat(unchanged.phoneNumber()).isEqualTo("555-010-0101");
    }

    @Test
    void updateMissingEmployeeFails() {
        assertThatThrownBy(() -> employeeService.updateEmployee(
                999L,
                new EmployeeRequest("Missing", "missing@example.com", "555-999-9999")))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deletesExistingEmployee() {
        EmployeeResponse created = employeeService.createEmployee(new EmployeeRequest("Ada", "ada@example.com", "555-010-0100"));

        employeeService.deleteEmployee(created.id());

        assertThat(employeeService.listEmployees()).isEmpty();
    }

    @Test
    void deleteMissingEmployeeFails() {
        assertThatThrownBy(() -> employeeService.deleteEmployee(999L))
                .isInstanceOf(NotFoundException.class);
    }
}

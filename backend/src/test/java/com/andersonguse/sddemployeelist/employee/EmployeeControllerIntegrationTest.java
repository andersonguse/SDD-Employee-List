package com.andersonguse.sddemployeelist.employee;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import com.andersonguse.sddemployeelist.support.PostgresIntegrationTest;

@AutoConfigureMockMvc
class EmployeeControllerIntegrationTest extends PostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void resetDatabase() {
        employeeRepository.deleteAll();
    }

    @Test
    void createsEmployee() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada Lovelace","email":"ada@example.com","phoneNumber":"555-010-0100"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Ada Lovelace"))
                .andExpect(jsonPath("$.email").value("ada@example.com"))
                .andExpect(jsonPath("$.phoneNumber").value("555-010-0100"));
    }

    @Test
    void rejectsInvalidCreate() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","email":"not-an-email","phoneNumber":"abc"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").exists());
    }

    @Test
    void rejectsCreateWithSevenDigitPhone() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada Lovelace","email":"ada@example.com","phoneNumber":"555-0100"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").exists());
    }

    @Test
    void rejectsDuplicateCreate() throws Exception {
        saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada Byron","email":"ADA@example.com","phoneNumber":"555-010-0101"}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    void listsEmployees() throws Exception {
        saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Ada Lovelace"));
    }

    @Test
    void listsEmptyEmployees() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void updatesEmployee() throws Exception {
        Employee employee = saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(put("/api/employees/{id}", employee.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada Byron","email":"ada.byron@example.com","phoneNumber":"555-020-0200"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(employee.getId()))
                .andExpect(jsonPath("$.name").value("Ada Byron"))
                .andExpect(jsonPath("$.email").value("ada.byron@example.com"))
                .andExpect(jsonPath("$.phoneNumber").value("555-020-0200"));
    }

    @Test
    void rejectsInvalidUpdate() throws Exception {
        Employee employee = saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(put("/api/employees/{id}", employee.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","email":"not-an-email","phoneNumber":"abc"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").exists());
    }

    @Test
    void rejectsUpdateWithSevenDigitPhone() throws Exception {
        Employee employee = saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(put("/api/employees/{id}", employee.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada Byron","email":"ada.byron@example.com","phoneNumber":"555-0100"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").exists());
    }

    @Test
    void returnsNotFoundForMissingUpdate() throws Exception {
        mockMvc.perform(put("/api/employees/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Missing","email":"missing@example.com","phoneNumber":"555-999-9999"}
                                """))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsDuplicateUpdate() throws Exception {
        saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");
        Employee grace = saveEmployee("Grace Hopper", "grace@example.com", "555-010-0101");

        mockMvc.perform(put("/api/employees/{id}", grace.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Grace Hopper","email":"ada@example.com","phoneNumber":"555-222-2222"}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    void deletesEmployee() throws Exception {
        Employee employee = saveEmployee("Ada Lovelace", "ada@example.com", "555-010-0100");

        mockMvc.perform(delete("/api/employees/{id}", employee.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void returnsNotFoundForMissingDelete() throws Exception {
        mockMvc.perform(delete("/api/employees/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    private Employee saveEmployee(String name, String email, String phoneNumber) {
        return employeeRepository.save(new Employee(name, email, phoneNumber));
    }
}

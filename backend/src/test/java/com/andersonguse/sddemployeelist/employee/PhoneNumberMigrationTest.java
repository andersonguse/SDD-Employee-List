package com.andersonguse.sddemployeelist.employee;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

class PhoneNumberMigrationTest {

    @Test
    void normalizesExistingSevenAndTenDigitPhoneNumbers() throws Exception {
        String url = "jdbc:h2:mem:phone_migration_" + UUID.randomUUID()
                + ";MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE";

        Flyway.configure()
                .dataSource(url, "sa", "")
                .locations("classpath:db/migration")
                .target("1")
                .load()
                .migrate();

        try (var connection = DriverManager.getConnection(url, "sa", "");
             var statement = connection.createStatement()) {
            statement.executeUpdate("""
                    INSERT INTO employees (name, email, phone_number)
                    VALUES
                        ('Seven Digit', 'seven@example.com', '555-0100'),
                        ('Ten Digit', 'ten@example.com', '(404) 555-1212'),
                        ('Already Valid', 'valid@example.com', '111-222-3333')
                    """);
        }

        Flyway.configure()
                .dataSource(url, "sa", "")
                .locations("classpath:db/migration")
                .load()
                .migrate();

        List<String> phoneNumbers = new ArrayList<>();
        try (var connection = DriverManager.getConnection(url, "sa", "");
             var statement = connection.createStatement();
             var resultSet = statement.executeQuery("SELECT phone_number FROM employees ORDER BY email")) {
            while (resultSet.next()) {
                phoneNumbers.add(resultSet.getString("phone_number"));
            }
        }

        assertThat(phoneNumbers).containsExactly("770-555-0100", "404-555-1212", "111-222-3333");
    }
}

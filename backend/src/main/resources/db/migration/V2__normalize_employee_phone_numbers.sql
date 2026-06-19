UPDATE employees
SET phone_number = CASE
    WHEN LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', '')) = 7
        THEN '770-'
            || SUBSTRING(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', ''), 1, 3)
            || '-'
            || SUBSTRING(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', ''), 4, 4)
    WHEN LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', '')) = 10
        THEN SUBSTRING(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', ''), 1, 3)
            || '-'
            || SUBSTRING(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', ''), 4, 3)
            || '-'
            || SUBSTRING(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', ''), 7, 4)
    ELSE phone_number
END
WHERE LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), ' ', ''), '(', ''), ')', ''), '.', ''), '+', '')) IN (7, 10);

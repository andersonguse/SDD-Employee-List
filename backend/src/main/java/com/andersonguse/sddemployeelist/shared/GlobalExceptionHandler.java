package com.andersonguse.sddemployeelist.shared;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String DUPLICATE_EMAIL_MESSAGE = "Cannot use existing email";
    private static final String VALIDATION_MESSAGE = "Please correct the highlighted fields";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest()
                .body(new ApiError(VALIDATION_MESSAGE, fieldErrors));
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiError> handleDuplicateEmail(DuplicateEmailException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiError.field(exception.getMessage(), exception.getField(), exception.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        if (isEmailUniquenessViolation(exception)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiError.field(DUPLICATE_EMAIL_MESSAGE, "email", DUPLICATE_EMAIL_MESSAGE));
        }

        return ResponseEntity.badRequest().body(ApiError.message(VALIDATION_MESSAGE));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException exception) {
        String message = exception.getMessage();
        if (message != null && message.contains("Name may contain")) {
            return ResponseEntity.badRequest().body(ApiError.field(VALIDATION_MESSAGE, "name", message));
        }
        if (message != null && message.contains("Phone number")) {
            return ResponseEntity.badRequest().body(ApiError.field(VALIDATION_MESSAGE, "phoneNumber", message));
        }

        return ResponseEntity.badRequest().body(ApiError.message(VALIDATION_MESSAGE));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiError.message(exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.message("Something went wrong. Please try again."));
    }

    private boolean isEmailUniquenessViolation(Throwable exception) {
        Throwable current = exception;
        while (current != null) {
            String message = current.getMessage();
            if (message != null && message.toLowerCase().contains("email")) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}

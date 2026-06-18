package com.andersonguse.sddemployeelist.shared;

public class DuplicateEmailException extends RuntimeException {

    private final String field;

    public DuplicateEmailException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}

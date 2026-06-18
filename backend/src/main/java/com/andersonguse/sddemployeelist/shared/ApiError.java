package com.andersonguse.sddemployeelist.shared;

import java.util.Map;

public record ApiError(
        String message,
        Map<String, String> fieldErrors
) {
    public static ApiError message(String message) {
        return new ApiError(message, Map.of());
    }

    public static ApiError field(String message, String field, String fieldMessage) {
        return new ApiError(message, Map.of(field, fieldMessage));
    }
}

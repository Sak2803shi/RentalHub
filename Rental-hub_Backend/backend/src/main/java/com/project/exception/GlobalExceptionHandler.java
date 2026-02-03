package com.project.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.dto.ErrorResponseDTO;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= NOT FOUND =================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        return buildError(ex.getMessage(), "NOT_FOUND", HttpStatus.NOT_FOUND, request);
    }

    // ================= DUPLICATE =================
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponseDTO> handleDuplicate(
            DuplicateResourceException ex,
            HttpServletRequest request) {

        return buildError(ex.getMessage(), "DUPLICATE_RESOURCE", HttpStatus.CONFLICT, request);
    }

    // ================= ACCESS DENIED (Spring Security) =================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {

        return buildError("You are not allowed to perform this action", 
                          "ACCESS_DENIED", HttpStatus.FORBIDDEN, request);
    }

    // ================= VALIDATION ERRORS =================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return buildError(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST, request);
    }

    // ================= ILLEGAL ARGUMENT =================
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {

        return buildError(ex.getMessage(), "INVALID_INPUT", HttpStatus.BAD_REQUEST, request);
    }

    // ================= GENERIC =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        ex.printStackTrace(); // log for debugging

        return buildError("Something went wrong. Please try again later.",
                "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // ================= COMMON BUILDER =================
    private ResponseEntity<ErrorResponseDTO> buildError(
            String message,
            String errorCode,
            HttpStatus status,
            HttpServletRequest request) {

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                status.value(),
                errorCode,
                message,
                request.getRequestURI()
        );

        return new ResponseEntity<>(error, status);
    }
}

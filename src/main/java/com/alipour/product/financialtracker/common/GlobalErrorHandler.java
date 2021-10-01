package com.alipour.product.financialtracker.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Response<String>> businessException(BusinessException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage());
        return ResponseEntity.badRequest().body(error.build());

    }

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<Response<String>> badRequest(BadRequestException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage());
        return ResponseEntity.badRequest().body(error.build());
    }

    @ExceptionHandler({NullPointerException.class})
    public ResponseEntity<Response<String>> badRequest(NullPointerException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message("خطا در سیستم:  NullPointerException ");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.build());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Response<String>> notFound(NotFoundException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.build());

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Response.ResponseBuilder<Map<String, String>> error = Response.builder();
        error.status(HttpStatus.BAD_REQUEST)
                .message(String.join("\n", errors.values()));
        return ResponseEntity.badRequest().body(error.build());
    }
}

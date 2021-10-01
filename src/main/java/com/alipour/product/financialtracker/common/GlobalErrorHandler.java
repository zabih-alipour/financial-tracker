package com.alipour.product.financialtracker.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

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

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Response<String>> notFound(NotFoundException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.build());

    }
}

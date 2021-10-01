package com.alipour.product.financialtracker.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalErrorHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Response<String> businessException(BusinessException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage());
        return error.build();

    }

    @ExceptionHandler(NotFoundException.class)
    public Response<String> notFound(NotFoundException ex, WebRequest request) {
        Response.ResponseBuilder<String> error = Response.builder();
        error.status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage());
        return error.build();

    }
}

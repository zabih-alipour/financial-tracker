package com.alipour.product.financialtracker.common;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@Builder
public class Response<T> {

    private HttpStatus status;
    private T data;
    private String message;
}

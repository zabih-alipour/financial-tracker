package com.alipour.product.financialtracker.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "sjjsjsjjsj")
public class NotFoundException extends RuntimeException {
    private final HttpStatus status = HttpStatus.NOT_FOUND;

    public NotFoundException() {
        super("رکورد مورد نظر یافت نشد");
    }
}

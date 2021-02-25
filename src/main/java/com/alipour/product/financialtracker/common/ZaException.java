package com.alipour.product.financialtracker.common;


import org.springframework.http.HttpStatus;

/**
 * Created by saeed on 11/16/14.
 */
public abstract class ZaException extends RuntimeException {
    private String title = "بروز خطا در سیستم";
    private String description;
    private HttpStatus httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    public ZaException(String title, String description, HttpStatus httpStatusCode) {
        this(title, description, httpStatusCode, null);
    }

    public ZaException(String title, String description, HttpStatus httpStatusCode, Throwable throwable) {
        super(description, throwable);
        this.title = title;
        this.description = description;
        this.httpStatusCode = httpStatusCode;
    }

    public ZaException(String title, String description) {
        this(title, description, HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    public ZaException(String title, String description, Throwable throwable) {
        this(title, description, HttpStatus.INTERNAL_SERVER_ERROR, throwable);
    }


    public ZaException(String title, HttpStatus httpStatusCode) {
        this(title, null, httpStatusCode, null);

    }

    public ZaException(String title, HttpStatus httpStatusCode, Throwable throwable) {
        this(title, null, httpStatusCode, throwable);

    }

    public ZaException(String title, Throwable throwable) {
        this(title, null, HttpStatus.INTERNAL_SERVER_ERROR, throwable);
    }

    public ZaException(String title) {
        this(title, null, HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public HttpStatus getHttpStatusCode() {
        return httpStatusCode;
    }
}

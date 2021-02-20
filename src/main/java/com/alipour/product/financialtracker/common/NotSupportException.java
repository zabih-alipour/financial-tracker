package com.alipour.product.financialtracker.common;

public class NotSupportException extends RuntimeException {
    public NotSupportException() {
        super("امکان انجام عملیات مورد نطر وجود ندارد");
    }

    public NotSupportException(String s) {
        super(s);
    }
}

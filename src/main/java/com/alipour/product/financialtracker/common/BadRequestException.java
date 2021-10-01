package com.alipour.product.financialtracker.common;


public class BadRequestException extends RuntimeException {

    public static final String INVALID_REQUEST_STRUCTURE = "در خواست ارسال شده معتبر نمی باشد.";
    public static final String EDIT_SYSTEMIC_DATA_NOT_ALLOWED = "ویرایش داده های سیستمی مجاز نمی باشد";
    public static final String DELETE_SYSTEMIC_DATA_NOT_ALLOWED = "حذف داده های سیستمی مجاز نمی باشد";
    public static final String ADD_SYSTEMIC_DATA_NOT_ALLOWED = "ایجاد داده های سیستمی مجاز نمی باشد";
    public static final String PARENT_KEY_NOT_FOUND_1 = "مقدار انتخاب شده برای فیلد ";
    public static final String PARENT_KEY_NOT_FOUND_2 = " در حال حاضر وجود ندارد.";
    public static final String PRICE_NOT_ALLOW_HAS_DECIMAL_PART = "مقادیر ریالی نمیتواند بصورت اعشاری باشد";
    public static final String DELETE_DATA_NOT_ALLOWED_1 = "در ";
    public static final String DELETE_DATA_NOT_ALLOWED_2 = " به عنوان ";
    public static final String DELETE_DATA_NOT_ALLOWED_3 = " استفاده شده است.";

    public static final String COUNT_OF_COLUMN_1 = "تعداد کاراکتر برای فیلد ";
    public static final String COUNT_OF_COLUMN_2 = " بیش از حد مجاز است.";

    public BadRequestException(String description) {
        this(description, null);
    }

    public BadRequestException(String description, Throwable e) {
        super(description, e);
    }

}

package com.alipour.product.financialtracker.utils;

import java.security.SecureRandom;

public class Utils {

    private static final SecureRandom random = new SecureRandom();

    public static String generateCode() {
        return String.format("%d", random.nextInt(999999));
    }
}

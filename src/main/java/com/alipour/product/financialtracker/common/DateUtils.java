package com.alipour.product.financialtracker.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by mohsen on 4/15/15.
 */
public class DateUtils {


    public static final String BAD_DATE_FORMAT = "فرمت تاریخ صحیح نمی باشد";
    public static final String BAD_TIME_FORMAT = "فرمت زمان صحیح نمی باشد";
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static final int[] g_days_in_month = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    public static final int[] j_days_in_month = {31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29};

    public static final String GEORGIAN_DATE_REGEX = "^\\d{4}/(1[012]|0[1-9])/(3[01]|[12]\\d|0[0-9])$";

    public static String getGregorianDate(String jalaiDate) {
        if (jalaiDate == null || jalaiDate.isEmpty())
            return null;
        ///
        int j_y = Integer.parseInt(jalaiDate.substring(0, 4));
        int j_m = Integer.parseInt(jalaiDate.substring(5, 7));
        int j_d = Integer.parseInt(jalaiDate.substring(8));
        ///
        int gy, gm, gd;
        int jy, jm, jd;
        long g_day_no, j_day_no;
        int leap;

        int i;

        jy = j_y - 979;
        jm = j_m - 1;
        jd = j_d - 1;

        j_day_no = 365L * jy + (jy / 33) * 8 + (jy % 33 + 3) / 4;
        for (i = 0; i < jm; ++i)
            j_day_no += j_days_in_month[i];

        j_day_no += jd;

        g_day_no = j_day_no + 79;

        gy = (int) (1600 + 400 * (g_day_no / 146097)); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        g_day_no = g_day_no % 146097;

        leap = 1;
        if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
            g_day_no--;
            gy += 100 * (g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
            g_day_no = g_day_no % 36524;

            if (g_day_no >= 365)
                g_day_no++;
            else
                leap = 0;
        }

        gy += 4 * (g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
        g_day_no %= 1461;

        if (g_day_no >= 366) {
            leap = 0;

            g_day_no--;
            gy += g_day_no / 365;
            g_day_no = g_day_no % 365;
        }

        for (i = 0; g_day_no >= g_days_in_month[i] + ((i == 1 && leap == 1) ? 1 : 0); i++)
            g_day_no -= g_days_in_month[i] + ((i == 1 && leap == 1) ? 1 : 0);
        gm = i + 1;
        gd = (int) g_day_no + 1;

//        return gy + "-" + gm + "-" + gd;
        return gy + "-" + (gm < 10 ? "0" + gm : "" + gm) + "-" + (gd < 10 ? "0" + gd : "" + gd);
    }

    public static long getGregorianDateDiff(String startDate, String endDate) {
        LocalDate endGregorianDate = LocalDate.parse(endDate, DATE_FORMATTER);

        LocalDate startGregorianDate = LocalDate.parse(startDate, DATE_FORMATTER);

        return endGregorianDate.toEpochDay() - startGregorianDate.toEpochDay();
    }

    public static long getJalaliDateDiff(String startDateJalali, String endDateJalali) {
        checkValidDate(startDateJalali);
        checkValidDate(endDateJalali);
        String fDate = getGregorianDate(endDateJalali);
        LocalDate fGregorianDate = LocalDate.parse(fDate, DATE_FORMATTER);

        String sDate = getGregorianDate(startDateJalali);
        LocalDate sGregorianDate = LocalDate.parse(sDate, DATE_FORMATTER);

        return fGregorianDate.toEpochDay() - sGregorianDate.toEpochDay();

    }

    public static String getJalaliDate(LocalDate localDate) {
        return getJalaliDate(localDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
    }

    public static String getJalaliDate(String gregorianDate) {
        if (gregorianDate == null || gregorianDate.isEmpty())
            return null;
        ///
        int g_y = Integer.parseInt(gregorianDate.substring(0, 4));
        int g_m = Integer.parseInt(gregorianDate.substring(5, 7));
        int g_d = Integer.parseInt(gregorianDate.substring(8));
        ///
        int gy, gm, gd;
        int jy, jm, jd;
        long g_day_no, j_day_no;
        int j_np;

        int i;
        gy = g_y - 1600;
        gm = g_m - 1;
        gd = g_d - 1;

        g_day_no = 365L * gy + (gy + 3) / 4 - (gy + 99) / 100 + (gy + 399) / 400;
        for (i = 0; i < gm; ++i)
            g_day_no += g_days_in_month[i];
        if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
      /* leap and after Feb */
            ++g_day_no;
        g_day_no += gd;

        j_day_no = g_day_no - 79;

        j_np = (int) j_day_no / 12053;

        j_day_no %= 12053;

        jy = (int) (979 + 33 * j_np + 4 * (j_day_no / 1461));
        j_day_no %= 1461;

        if (j_day_no >= 366) {
            jy += (j_day_no - 1) / 365;
            j_day_no = (j_day_no - 1) % 365;
        }

        for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
            j_day_no -= j_days_in_month[i];
        }
        jm = i + 1;
        jd = (int) j_day_no + 1;

        return jy + "/" + (jm < 10 ? "0" + jm : "" + jm) + "/" + (jd < 10 ? "0" + jd : "" + jd);
    }

    public static String getTodayJalali() {
        return getJalaliDate(LocalDate.now().format(DATE_FORMATTER));
    }

    public static String getDayAfter(String jalaliDate, int days) {
        checkValidDate(jalaliDate);
        String date = getGregorianDate(jalaliDate);
        LocalDate fGregorianDate = LocalDate.parse(date, DATE_FORMATTER);
        return getJalaliDate(LocalDate.ofEpochDay(fGregorianDate.toEpochDay() + days).format(DATE_FORMATTER));
    }

    public static String getCurrentTime() {
        return LocalTime.now().format(TIME_FORMATTER);
    }

    public static boolean isDateValid(String jalaliDate) {
        if (jalaliDate == null || jalaliDate.isEmpty())
            return false;

        String datePattern31Days = "((13|14)\\d\\d)/(0?[1-6])/(0?[1-9]|[12][0-9]|3[01])";
        String datePattern30Days = "((13|14)\\d\\d)/(0?[7-9]|1[012])/(0?[1-9]|[12][0-9]|30)";

        return Pattern.compile(datePattern30Days).matcher(jalaliDate).matches() ||
                Pattern.compile(datePattern31Days).matcher(jalaliDate).matches();
    }

    public static boolean isTimeValid(String time) {
        if (time == null || time.isEmpty())
            return false;
        String time24hours_pattern = "([01]?[0-9]|2[0-3]):[0-5][0-9]";
        String time24hoursWithSecond_pattern = "([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]";
        return Pattern.compile(time24hours_pattern).matcher(time).matches() ||
                Pattern.compile(time24hoursWithSecond_pattern).matcher(time).matches();
    }

    public static void checkValidDate(String date) {
        if (!isDateValid(date))
            throw new BadRequestException(BAD_DATE_FORMAT);
    }

    public static void checkValidTime(String time) {
        if (!isTimeValid(time))
            throw new BadRequestException(BAD_TIME_FORMAT);
    }

    public static LocalTime stringToTime(String timeString) {
        checkValidTime(timeString);
        List<Integer> times = Stream.of(timeString.split(":")).map(Integer::parseInt).collect(Collectors.toList());
        return times.size() == 2
                ? LocalTime.of(times.get(0), times.get(1))
                : LocalTime.of(times.get(0), times.get(1), times.get(2));
    }

    public static LocalDate shamsiStringToDate(String dateString) {
        checkValidDate(dateString);
        String fDate = getGregorianDate(dateString);
        return LocalDate.parse(fDate, DATE_FORMATTER);
    }

    public static LocalDateTime shamsiDateTimeToDateTime(String dateTime) {
        final String[] split = dateTime.split(" - ");
        final LocalDate localDate = Optional.ofNullable(split[0]).map(DateUtils::shamsiStringToDate).orElse(null);
        final LocalTime localTime = Optional.ofNullable(split[1]).map(DateUtils::stringToTime).orElse(null);
        return LocalDateTime.of(localDate, localTime);
    }

    /**
     * Check String for valid format: yyyy/MM/dd (2012/08/16).
     * @param date String must be validation.
     * @exception BadRequestException if date not be valid
     */
    public static void checkValidGeorgianDate (String date) {
        if(!isValidGeorgianDate(date))
            throw new BadRequestException(BAD_DATE_FORMAT);

    }

    /**
     * Check String for valid format: yyyy/MM/dd (2012/08/16)
     * @param date String must be validation
     * @return <b>true</b> if date valid, otherwise <b>false</b>
     */
    public static boolean isValidGeorgianDate (String date) {
        return date.matches(GEORGIAN_DATE_REGEX);
    }
}

package com.alipour.product.financialtracker.common;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Created by alipour on 9/10/16.
 */
public class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {
    @Override
    public void serialize(LocalDateTime localDateTime, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        final String date = DateUtils.getJalaliDate(localDateTime.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        final String time = localDateTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        jsonGenerator.writeString(date.concat(" - ").concat(time));
    }
}

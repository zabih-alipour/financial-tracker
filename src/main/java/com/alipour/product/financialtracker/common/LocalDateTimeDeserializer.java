package com.alipour.product.financialtracker.common;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Created by alipour on 9/10/16.
 */
public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    @Override
    public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        ObjectCodec mapper = jsonParser.getCodec();
        JsonNode node = mapper.readTree(jsonParser);
        return DateUtils.shamsiDateTimeToDateTime(node.asText());
    }
}

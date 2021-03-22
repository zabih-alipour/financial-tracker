package com.alipour.product.financialtracker.common;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestTemplate;

import javax.sql.DataSource;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;

@Configuration
@ComponentScan(basePackages = "com.alipour.product.financialtracker")
public class AppConfig {
    private final Environment env;

    public AppConfig(Environment environment) {
        this.env = environment;
    }

    @Bean
    public SecureRandom random() {
        return new SecureRandom();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer());
        simpleModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer());
        mapper.registerModule(simpleModule);

        return mapper;
    }

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(Objects.requireNonNull(env.getProperty("spring.datasource.driver-class-name")));
        dataSource.setUrl(env.getProperty("spring.datasource.url"));
//        dataSource.setUsername(env.getProperty("user"));
//        dataSource.setPassword(env.getProperty("password"));
        return dataSource;
    }
}

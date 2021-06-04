package com.alipour.product.financialtracker;

import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableScheduling
@RestController
public class FinancialTrackerApplication implements ExitCodeGenerator {
    private final ApplicationContext context;

    public FinancialTrackerApplication(ApplicationContext context) {
        this.context = context;
    }

    public static void main(String[] args) {
        SpringApplication.run(FinancialTrackerApplication.class, args);
    }


    @GetMapping("/shutdown")
    public void exit() {
        System.out.println("Exiting the app!!");
        SpringApplication.exit(context, this);
    }

    @Override
    public int getExitCode() {
        return 0;
    }
}

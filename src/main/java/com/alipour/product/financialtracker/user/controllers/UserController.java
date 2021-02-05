package com.alipour.product.financialtracker.user.controllers;

import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    @ResponseBody
    public List<User> findAll() {
        return service.findAll();
    }
}

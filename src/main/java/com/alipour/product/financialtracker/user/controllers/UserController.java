package com.alipour.product.financialtracker.user.controllers;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.services.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController extends CRUDController<User> {


    public UserController(UserService service) {
        super(service);
    }


}

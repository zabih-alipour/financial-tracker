package com.alipour.product.financialtracker.user.controllers;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.models.UserSummary;
import com.alipour.product.financialtracker.user.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController extends CRUDController<User> {


    public UserController(UserService service) {
        super(service);
    }

    @GetMapping("/v2")
    @ResponseBody
    public List<UserSummary> findWithDetail(@RequestParam(value = "showAsset", defaultValue = "false", required = false) Boolean showAsset,
                                            @RequestParam(value = "showBalance", defaultValue = "false", required = false) Boolean showBalance) {
        return ((UserService) service).findWithDetail(showAsset, showBalance);
    }
}

package com.alipour.product.financialtracker.user.controllers;

import com.alipour.product.financialtracker.common.BusinessException;
import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.common.Response;
import com.alipour.product.financialtracker.payment_type.models.UserPaymentTypeDetail;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.models.UserSummary;
import com.alipour.product.financialtracker.user.services.UserService;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/payment-type/{id}")
    @ResponseBody
    public Response<List<UserPaymentTypeDetail>> userPaymentDetail(@PathVariable("id") Long userId) {
        final Response.ResponseBuilder<List<UserPaymentTypeDetail>> builder = Response.builder();
        builder.status(HttpStatus.OK)
                .data(((UserService) service).userPaymentDetail(userId));
        return builder.build();
    }
}

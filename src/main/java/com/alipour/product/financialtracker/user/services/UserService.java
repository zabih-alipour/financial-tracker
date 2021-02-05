package com.alipour.product.financialtracker.user.services;

import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> findAll() {
        return repository.findAll();
    }
}

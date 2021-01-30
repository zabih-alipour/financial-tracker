package com.alipour.product.financialtracker.configs.services;

import com.alipour.product.financialtracker.configs.models.User;
import com.alipour.product.financialtracker.configs.repositories.UserRepository;
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

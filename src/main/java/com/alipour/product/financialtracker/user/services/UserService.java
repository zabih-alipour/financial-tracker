package com.alipour.product.financialtracker.user.services;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.repositories.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserService extends CRUDService<User> {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public JpaRepository<User, Long> getRepository() {
        return repository;
    }
}

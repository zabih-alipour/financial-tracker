package com.alipour.product.financialtracker.user.repositories;

import com.alipour.product.financialtracker.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}

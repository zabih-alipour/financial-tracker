package com.alipour.product.financialtracker.user.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

@Entity
@Table(name="user")
@Getter
@Setter
public class User extends ParentEntity {
    @NotEmpty(message = "نام کاربری نمیتواند خالی باشد")
    private String name;

    public User(Long id) {
        super(id);
    }

    public User() {
    }
}

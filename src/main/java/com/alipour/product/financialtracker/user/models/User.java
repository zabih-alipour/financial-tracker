package com.alipour.product.financialtracker.user.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="user")
@Getter
@Setter
public class User extends ParentEntity {
    private String name;
}

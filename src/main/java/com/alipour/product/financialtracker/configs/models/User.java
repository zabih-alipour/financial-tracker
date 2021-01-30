package com.alipour.product.financialtracker.configs.models;

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

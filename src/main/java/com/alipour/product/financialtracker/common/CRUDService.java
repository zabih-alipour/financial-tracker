package com.alipour.product.financialtracker.common;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CRUDService<T> {
    JpaRepository<T, Long> getRepository();

    default T add(T t) {
        return getRepository().save(t);
    }

    default T edit(T t) {
        return getRepository().save(t);
    }

    default Optional<T> get(Long id) {
        return getRepository().findById(id);
    }

    default void delete(T t) {
        getRepository().delete(t);
    }

    default void delete(Long id) {
        getRepository().deleteById(id);
    }

    default List<T> findAll() {
        return getRepository().findAll();
    }

}

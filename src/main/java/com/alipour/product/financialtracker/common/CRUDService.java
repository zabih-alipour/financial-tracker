package com.alipour.product.financialtracker.common;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class CRUDService<T> {
    protected abstract JpaRepository<T, Long> getRepository();

    public T add(T t) {
        return getRepository().save(t);
    }

    public T add(ParentDto t) {
        throw new NotSupportException();
    }

    public T edit(T t) {
        return getRepository().save(t);
    }

    public Optional<T> get(Long id) {
        return getRepository().findById(id);
    }

    public void delete(T t) {
        getRepository().delete(t);
    }

    public void delete(Long id) {
        getRepository().deleteById(id);
    }

    public List<T> findAll() {
        return getRepository().findAll();
    }

    public Long count() {
        return getRepository().count();
    }

}

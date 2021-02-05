package com.alipour.product.financialtracker.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class CRUDController<T> {

    protected final CRUDService<T> service;

    public CRUDController(CRUDService<T> service) {
        this.service = service;
    }

    @GetMapping
    @ResponseBody
    public List<T> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public T findOne(@PathVariable(name = "id") Long id) {
        return service.get(id).orElseThrow(NotFoundException::new);
    }

    @PostMapping
    @ResponseBody
    public T add(@RequestBody T entity) {
        return service.add(entity);
    }

    @PutMapping
    @ResponseBody
    public T edit(@RequestBody T entity) {
        return service.edit(entity);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.ok("Entity Successfully deleted");
    }
}

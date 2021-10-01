package com.alipour.product.financialtracker.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public class CRUDController<T extends ParentEntity> {

    protected final CRUDService<T> service;

    public CRUDController(CRUDService<T> service) {
        this.service = service;
    }

    @GetMapping
    @ResponseBody
    public Response<List<T>> findAll() {
        Response.ResponseBuilder<List<T>> builder = Response.builder();
        builder.status(HttpStatus.OK)
                .data(service.findAll());
        return builder.build();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Response<T> findOne(@PathVariable(name = "id") Long id) {
        final Optional<T> entity = service.get(id);
        return entity.map(t -> {
                    Response.ResponseBuilder<T> builder = Response.builder();
                    builder.status(HttpStatus.OK)
                            .data(t);
                    return builder.build();
                })
                .orElseThrow(NotFoundException::new);
    }

    @PostMapping
    @ResponseBody
    public Response<T> add(@RequestBody T entity) {
        Response.ResponseBuilder<T> builder = Response.builder();
        builder.status(HttpStatus.OK)
                .data(service.add(entity))
                .message("عملیات ذخیره با موفقیت انجام شد");
        return builder.build();
    }

    @PutMapping
    @ResponseBody
    public Response<T> edit(@RequestBody T entity) {
        Response.ResponseBuilder<T> builder = Response.builder();
        builder.status(HttpStatus.OK)
                .data(service.edit(entity))
                .message("رکورد مورد نظر ویرایش شد.");

        return builder.build();
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public Response<String> delete(@PathVariable("id") Long id) {
        service.delete(id);
        Response.ResponseBuilder<String> builder = Response.builder();
        builder.status(HttpStatus.OK)
                .message("رکورد مورد نظر حذف گردید");
        return builder.build();
    }
}

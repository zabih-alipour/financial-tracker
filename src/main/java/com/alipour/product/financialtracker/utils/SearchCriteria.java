package com.alipour.product.financialtracker.utils;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class SearchCriteria implements Serializable {
    private List<Search> searchArias = new ArrayList<>();
    private Pagination pagination = new Pagination();
    private Sort sort;

    @Data
    public static class Search {
        private String key;
        private String value;
    }

    @Data
    public static class Pagination {
        private int pageSize = 5;
        private int pageNumber = 0;
    }

    @Data
    public static class Sort {
        private String field = "id";
        private String order = "DESC";
    }


}

package com.alipour.product.financialtracker.utils;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class SearchCriteria implements Serializable {
    private List<Search> searchArias = new ArrayList<>();
    private Pagination pagination = Pagination.getInstance();
    private Sort sort = Sort.getInstance();

    @Data
    public static class Search {
        private String key;
        private String value;
    }

    @Data
    public static class Pagination {
        private int pageSize = 5;
        private int pageNumber = 0;

        public static Pagination getInstance() {
            return new Pagination();
        }
    }

    @Data
    public static class Sort {
        private String field = "id";
        private String order = "DESC";

        public static Sort getInstance() {
            return new Sort();
        }
    }


}

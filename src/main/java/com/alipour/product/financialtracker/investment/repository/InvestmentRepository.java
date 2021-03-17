package com.alipour.product.financialtracker.investment.repository;

import com.alipour.product.financialtracker.investment.models.Investment;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long>, JpaSpecificationExecutor<Investment> {

    @Query(value = "WITH RECURSIVE cte as (\n" +
            "\tSELECT p.*, 0 as level  from investment  p where p.id = :parentId\n" +
            "\tUNION ALL\n" +
            "\tSELECT c.*, (cte.level +1) as level from investment  c  JOIN cte on cte.id = c.parent_id\n" +
            ")\n" +
            "SELECT * from cte \n" +
            "\twhere cte.level\tin (0, 1, 2)\n" +
            "\tORDER by cte.create_at", nativeQuery = true)
    List<Investment> getByParentId(@Param("parentId") Long parentId);


    List<Investment> findByUserId(Long userId);

    @Query("select sum(i.amount) as amount from Investment i " +
            "where i.user.id = :userId " +
            "and i.investmentType.id = 1 " +
            "and i.parent is null " +
            "and i.amount >= 0")
    BigDecimal getTotalRialInvestments(@Param("userId") Long userId);
}
package com.alipour.product.financialtracker.type_price_history.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.type_price_history.models.InvestmentTypePriceHistory;
import com.alipour.product.financialtracker.type_price_history.repository.InvestmentTypePriceHistoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-04-27 23:18:33
 */
@Transactional(rollbackFor = Exception.class)
@Service
public class InvestmentTypePriceHistoryService extends CRUDService<InvestmentTypePriceHistory> {

    private final InvestmentTypePriceHistoryRepository repository;
    private final EntityManager entityManager;

    public InvestmentTypePriceHistoryService(InvestmentTypePriceHistoryRepository repository, EntityManager entityManager) {
        this.repository = repository;
        this.entityManager = entityManager;
    }

    @Override
    protected JpaRepository<InvestmentTypePriceHistory, Long> getRepository() {
        return repository;
    }

    public void getCopy() {
        final Query query = entityManager
                .createNativeQuery("insert  into investment_type_price_history (investment_type_id, latest_price, create_at) " +
                        "select id, latest_price, (select datetime()) from investment_type");
        query.executeUpdate();

    }

    @Override
    public InvestmentTypePriceHistory add(ParentDto t) {
        throw new UnsupportedOperationException("This operation not supported");
    }

    @Override
    public InvestmentTypePriceHistory edit(InvestmentTypePriceHistory investmentTypePriceHistory) {
        throw new UnsupportedOperationException("This operation not supported");
    }

    @Override
    public void delete(Long id) {
        throw new UnsupportedOperationException("This operation not supported");
    }

    @Override
    public InvestmentTypePriceHistory add(InvestmentTypePriceHistory investmentTypePriceHistory) {
        throw new UnsupportedOperationException("This operation not supported");
    }

    @Override
    public void delete(InvestmentTypePriceHistory investmentTypePriceHistory) {
        throw new UnsupportedOperationException("This operation not supported");
    }
}
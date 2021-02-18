package com.alipour.product.financialtracker.investment_type.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@Service
@Transactional
public class InvestmentTypeService extends CRUDService<InvestmentType> {

    private final InvestmentTypeRepository repository;

    public InvestmentTypeService(InvestmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    protected JpaRepository<InvestmentType, Long> getRepository() {
        return repository;
    }
}
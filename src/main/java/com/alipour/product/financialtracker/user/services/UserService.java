package com.alipour.product.financialtracker.user.services;

import com.alipour.product.financialtracker.common.BadRequestException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.payment_type.models.UserPaymentTypeDetail;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.models.UserSummary;
import com.alipour.product.financialtracker.user.repositories.UserRepository;
import com.alipour.product.financialtracker.user.repositories.UserSummaryRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserService extends CRUDService<User> {
    private final UserRepository repository;
    private final UserSummaryRepository userSummaryRepository;

    public UserService(UserRepository repository, UserSummaryRepository userSummaryRepository) {
        this.repository = repository;
        this.userSummaryRepository = userSummaryRepository;
    }

    @Override
    public JpaRepository<User, Long> getRepository() {
        return repository;
    }

    @Override
    public User add(User user) {
        if (user.getName() == null || user.getName().isEmpty()) {
            throw new BadRequestException("نام کاربر نمیتواند خالی باشد");
        }
        return super.add(user);
    }

    public List<UserSummary> findWithDetail(Boolean showAsset, Boolean showBalance) {
        return userSummaryRepository.findAll();
    }

    public List<UserPaymentTypeDetail> userPaymentDetail(Long userId) {
        return repository.userPaymentTypeDetail(userId);
    }
}

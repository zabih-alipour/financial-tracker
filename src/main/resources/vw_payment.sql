create view vw_payment as
select p.id,
       p.user_id,
       p.payment_type_id,
       p.code,
       p.shamsi_date,
       p.created_at,
       p.description,
       p.amount                                                  payment_amount,
       sub.amount                                                settlement_amount,
       case when ((p.amount + sub.amount)) = 0 then 1 else 0 end is_settled
from payment p
         left join (select p2.parent_id,
                           sum(p2.amount) amount
                    from payment p2
                    group by p2.parent_id) sub
                   on p.id = sub.parent_id
where p.amount > 0
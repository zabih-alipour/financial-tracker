CREATE VIEW "wv_investment" AS
select buys.id,
       buys.user_id,
       buys.investment_type_id,
       buys.amount,
       buys.code,
       buys.parent_id,
       buys.shamsi_date,
       buys.executed_price,
       sells.amount                 as spent_amount
from (
         SELECT i.id,
                i.user_id,
                i.investment_type_id,
                i.amount,
                i.code,
                i.parent_id,
                i.shamsi_date,
                i.executed_price
         FROM investment i
         WHERE i.amount >= 0
     ) as buys
         LEFT JOIN (
    SELECT i.user_id,
           i.investment_type_id,
           i.parent_id,
           sum(amount) amount
    from investment i
    WHERE amount < 0
    GROUP by i.user_id,
             i.investment_type_id,
             i.parent_id
) as sells
                   on buys.id = sells.parent_id
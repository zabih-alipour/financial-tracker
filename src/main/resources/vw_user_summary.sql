CREATE VIEW vw_user_summary as
select u.*,
       round(ifnull((invest.assets/10), 0), 0) as assets,
       round(ifnull(vp.balance, 0), 0)    as balance

from user u
         left join (select vas.user_id,
                           sum(
                                   case
                                       when vas.investment_type_id = 1 then vas.amount
                                       when vas.investment_type_id = 12 then 0
                                       else (dolor_type.latest_price * vas.amount) end) assets
                    from (select user_id, investment_type_id, sum(it.latest_price * amount) amount
                          from investment
                                   join investment_type it on investment_type_id = it.id
                          group by user_id, investment_type_id) vas
                             left outer join (select * from investment_type where id = 8) dolor_type

                    group by vas.user_id) invest
                   on u.id = invest.user_id
         left join (select p.user_id, sum(p.amount) balance
                    from payment p
                    group by p.user_id) vp on u.id = vp.user_id
;

CREATE VIEW vw_asset_summary as
select i.user_id,
       i.investment_type_id,
       sum(
               case
                   when i.investment_type_id = 1 and i.amount >= 0 then i.amount
                   when i.investment_type_id = 1 and i.amount < 0 then 0
                   else i.amount end
           ) total_amount
from investment i
group by i.user_id, i.investment_type_id;
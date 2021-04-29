-- we don't know how to generate root <with-no-name> (class Root) :(
create table investment_type
(
	id INTEGER
		primary key,
	name TEXT not null,
	code TEXT not null,
	latest_price INTEGER default 0
);

create table investment_type_log
(
	id INTEGER
		primary key,
	investment_type_id INTEGER not null
		references investment_type,
	price not null,
	create_at INTEGER not null
);

create table investment_type_price_history
(
	id INTEGER
		constraint investment_type_price_history_pk
			primary key,
	investment_type_id INTEGER not null
		references investment_type,
	latest_price INTEGER default 0,
	create_at INTEGER not null
);

create table payment_type
(
	id INTEGER
		primary key,
	name TEXT not null,
	parent_id INTEGER
		references payment_type,
	parent_path TEXT
);

create table user
(
	id INTEGER
		primary key,
	name TEXT not null
		unique
);

create table investment
(
	id INTEGER
		primary key,
	user_id INTEGER not null
		references user,
	investment_type_id INTEGER not null
		references investment_type,
	amount INTEGER not null,
	shamsi_date TEXT not null,
	executed_price NUMERIC not null,
	parent_id INTEGER
		references investment,
	description TEXT not null,
	code TEXT not null,
	create_at INTEGER not null
);

create table payment
(
	id INTEGER
		primary key,
	user_id INTEGER not null
		references user,
	payment_type_id INTEGER not null
		references payment_type,
	code INTEGER not null,
	amount INTEGER not null,
	shamsi_date TEXT not null,
	created_at INTEGER not null,
	description INTEGER not null,
	parent_id int
		references payment
);

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

CREATE VIEW "vw_investment" AS
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
                   on buys.id = sells.parent_id;

CREATE VIEW vw_payment as
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
where p.amount > 0;

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
                    group by p.user_id) vp on u.id = vp.user_id;


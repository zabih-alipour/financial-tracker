alter table payment_type add code text;

update payment_type set code='DEBIT' where id=1;
update payment_type set code='LOAN' where id=2;
update payment_type set code='CAR_TRADE' where id=3;
update payment_type set code='VILLAGE_INSTALLMENT' where id=4;
update payment_type set code='RICE_INSTALLMENT' where id=5;
update payment_type set code='TEHRAN_HOUSE_COSTS' where id=9;
update payment_type set code= 'VILLAGE_HOUSE_COSTS' where id=10;
update payment_type set code='REPLACEMENT_PAYMENT' where id=11;
update payment_type set code='CREDIT' where id=12;
update payment_type set code='INVESTMENT' where id=13;


alter table payment add investment_code text;
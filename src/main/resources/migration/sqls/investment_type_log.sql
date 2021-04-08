create table investment_type_price_history
(
    id                 INTEGER primary key,
    investment_type_id INTEGER not null
        references investment_type,
    price                      not null,
    create_at          INTEGER not null
);

create table asset_balance
(
    id                 INTEGER primary key,
    investment_type_id INTEGER not null
        references investment_type,
    amount                      not null,
    create_at          INTEGER not null
);
create table investment_type_price_history
(
    id INTEGER
        constraint investment_type_price_history_pk
            primary key,
    investment_type_id INTEGER not null references investment_type,
    latest_price INTEGER default 0,
    create_at INTEGER not null
);
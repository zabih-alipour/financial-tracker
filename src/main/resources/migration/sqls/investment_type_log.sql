create table investment_type_log
(
    id                 INTEGER primary key,
    investment_type_id INTEGER not null
        references investment_type,
    price                      not null,
    create_at          INTEGER not null
);
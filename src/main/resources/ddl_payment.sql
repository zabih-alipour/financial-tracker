alter table payment
    add parent_id int references payment;
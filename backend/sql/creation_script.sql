CREATE table if not exists  p_group (
    pg_id SERIAL PRIMARY KEY,
    pg_name VARCHAR(255) NOT NULL,
    pg_code VARCHAR(255) NOT null,
    pg_flag INTEGER
);

CREATE TABLE if not exists p_product (
    pp_id SERIAL PRIMARY KEY,
    pp_name VARCHAR(255) NOT NULL,
    pp_code VARCHAR(255) NOT NULL,
    pp_price Decimal(20,2) not null,
    pp_desc text,
    pg_id INTEGER REFERENCES p_group(pg_id),
    pp_quantity INTEGER NOT null,
    pp_flag INTEGER
);

CREATE table if not exists  p_value_model (
    pvm_id SERIAL PRIMARY KEY,
    pg_id INTEGER REFERENCES p_group(pg_id),
    pvm_name VARCHAR(255) NOT NULL,
    pvm_desc VARCHAR(2500),
    pvm_code VARCHAR(255) NOT null,
    pvm_flag INTEGER
);

CREATE table if not exists  p_value (
    pvm_id INTEGER REFERENCES p_value_model(pvm_id)NOT NULL,
    pp_id INTEGER REFERENCES p_product(pp_id)NOT NULL,
    pv_value text,
    PRIMARY KEY (pvm_id, pp_id)
);

CREATE table if not exists  o_offer (
    oo_id SERIAL PRIMARY KEY,
    pp_id INTEGER REFERENCES p_product(pp_id),
    oo_discount decimal(3,2) NOT NULL,
    oo_flag INTEGER not NULL
);

select pg_id as id, pg_name as name, pg_code as code, pg_flag as pg_flag from p_group;

select pp.pp_id as id, pp.pp_name as name, pp.pp_code as code , pp.pg_id as group_id, pp.pp_quantity as quantity, pp.pp_flag as flag 
from p_product pp;

SELECT count(*)>0 as exists FROM p_product pp WHERE pp_id = 1;

SELECT count(*)>0 as exists FROM p_value WHERE pp_id = and pvm_id =;



select pp.pp_id as id, pp.pp_name as name, pp.pp_code as code , pp.pg_id as group_id, pp.pp_quantity as quantity,
pp.pp_flag as flag, 
json_agg( JSON_BUILD_OBJECT('model_id',pv.pvm_id ,'name',pvm.pvm_name ,'code',pvm.pvm_code ,'desc',pvm.pvm_desc, 'flag',pvm.pvm_flag ,'value',pv.pv_value)) as valueList
from p_product pp 
join p_value pv on (pp.pp_id=pv.pp_id)
join p_value_model pvm on (pv.pvm_id=pvm.pvm_id)
group by pp.pp_id 
offset 0 limit 30;

select json_agg( JSON_BUILD_OBJECT('model_id',pv.pvm_id ,'name',pvm.pvm_name ,'code',pvm.pvm_code ,'desc',pvm.pvm_desc, 'flag',pvm.pvm_flag ,'value',pv.pv_value)) from p_value pv 
join p_value_model pvm on (pv.pvm_id=pvm.pvm_id ) group by pv.pp_id ;

select pp.pp_id as id, pp.pp_name as name, pp.pp_code as code , pp.pg_id as group_id, pp.pp_quantity as quantity, pp.pp_flag as flag, json_agg( JSON_BUILD_OBJECT('model_id',pv.pvm_id ,'name',pvm.pvm_name ,'code',pvm.pvm_code ,'desc',pvm.pvm_desc, 'flag',pvm.pvm_flag ,'value',pv.pv_value)) as valueList from p_product pp join p_value pv on (pp.pp_id=pv.pp_id) join p_value_model pvm on (pv.pvm_id=pvm.pvm_id) group by pp.pp_id offset 0 limit 30;

Select
    convert(concat_ws("",  (SELECT concat(
"DROP ",type," IF EXISTS `DB_NAME`.`",specific_Name,"`;
CREATE ",p.security_type,"=",p.definer," ", type," `DB_NAME`.`", specific_Name
    , concat("`("
            , param_list
            , ") "
            ,
            CASE
                WHEN type = "FUNCTION" THEN
                    concat("\nRETURNS ", RETURNS)
                ELSE
                    ""
                END,
            "
    LANGUAGE ",p.language,
    IF(p.is_deterministic="NO"," NOT ",""),"DETERMINISTIC
    ",replace(sql_data_access,"_"," "),
    "
                          SQL SECURITY INVOKER
                          ", body)
                                       ,";

DELETE FROM `DB_NAME`.`s_procparams` WHERE procName=", quote(specific_Name),";

	" ) as text
                            FROM
                                mysql.proc p
                            WHERE
                                    db="DB_NAME" and name=p2.name LIMIT 1)
	,
	(    select concat("INSERT INTO `DB_NAME`.`s_procparams` (procName,name,type,valueMin,valueMax,length,required,`default`) VALUES
	",group_concat(concat(" (",quote(procName),",",quote(name),",",quote(type),",",quote(valueMin),",",quote(valueMax),",",quote(length),",",quote(required)
	,",",quote(`default`),")") separator ",
	"),";") from `proc`.s_procparams pp where pp.procName=p2.name),"

")using "utf8") as text, specific_Name as name
FROM
    mysql.proc p2
WHERE
        db="DB_NAME";

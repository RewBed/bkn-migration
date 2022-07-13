SELECT 1 as success,
concat('DROP TRIGGER IF EXISTS ',TRIGGER_NAME,';
CREATE TRIGGER ',TRIGGER_NAME,
              '\n', ACTION_TIMING, ' ', EVENT_MANIPULATION, '\nON ', EVENT_OBJECT_TABLE, '\nFOR EACH ROW\n
',
/*
'
BEGIN
IF(@noTriggers is null)THEN
', substr(trim(ACTION_STATEMENT),6),' IF;
END',
*/
              ACTION_STATEMENT,
              ';\r\n\r\n') as text
FROM
    information_schema.TRIGGERS t
WHERE
        TRIGGER_SCHEMA ='DB_NAME' AND TRIGGER_NAME='TABLE_NAME';
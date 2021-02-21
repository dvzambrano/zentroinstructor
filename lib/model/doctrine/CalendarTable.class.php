<?php

/**
 * CalendarTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class CalendarTable extends sfCalendarTable {

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 'rs.*, rs.customcolor as customcolor';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.Taskstatus rs'), array(
                    array(
                        'field' => 'entityid',
                        'realfield' => 'entityid',
                        'char' => 'rs'
                        )), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function getAll($filters = array(), $simple = false) {
        $select = 'rs.*, rs.customcolor as customcolor';
        $query = BaseTable::getAllPaged(self::table, 0, PHP_INT_MAX, $filters, array('t.Taskstatus rs'), array(
                    array(
                        'field' => 'entityid',
                        'realfield' => 'entityid',
                        'char' => 'rs'
                        )), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function getRebuilded($array = array()) {
        if ($array['code'] != '')
            $calendar = Doctrine::getTable('Calendar')->findByAK($array['code']);

        if (!$calendar && $array['id'] > 0) {
            $calendar = new Calendar();
            $calendar->fromArray($array);
            $calendar->save();
        }

        return $calendar;
    }

    //[getByParentMethod]
}
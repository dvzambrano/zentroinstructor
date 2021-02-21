<?php

/**
 * ScheduleTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class ScheduleTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object ScheduleTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable(self::table);
    }

    public static function formatData($array, $page, $count = false) {
        return array(
            'metaData' => array(
                'idProperty' => 'id',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'id', 'type' => 'int'),
                    array('name' => 'customicon', 'type' => 'string'),
                    array('name' => 'code', 'type' => 'string'),
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'sesions', 'type' => 'string'),
                    array('name' => 'exceptions', 'type' => 'string'),
                    array('name' => 'is_active', 'type' => 'bool'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'entityid', 'type' => 'int')
                ),
                'sortInfo' => array(
                    'field' => 'id',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => $count,
            'data' => $array->toArray(),
            'page' => $page
        );
    }

    const table = 'Schedule';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 'NOT(t.is_active) as deleteable';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array(), array(), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function getAll($filters = array(), $simple = false) {
        return self::getAllPaged(0, PHP_INT_MAX, $filters, $simple);
    }

    public static function deleteByPK($pks, $user = false) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

    public static function getActiveSchedule($entityid = false) {
        $q = Doctrine_Query::create()
                ->select('dc.*')
                ->from('Schedule dc')
                ->where('dc.is_active = true');
        
        if ($entityid && $entityid != '')
            $q = $q->andWhere('dc.entityid = ?', $entityid);

        return $q->execute();
    }

    //[getByParentMethod]
}
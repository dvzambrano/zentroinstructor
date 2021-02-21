<?php

/**
 * MailqueueTable
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class MailqueueTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object MailqueueTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable('Mailqueue');
    }

    public static function formatData($array, $page, $count = false) {
        return array(
            'metaData' => array(
                'idProperty' => 'name',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string')
                ),
                'sortInfo' => array(
                    'field' => 'name',
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

    const table = 'Mailqueue';
    const akfield = 'name';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters);
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

}
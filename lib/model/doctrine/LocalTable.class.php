<?php

/**
 * LocalTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class LocalTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object LocalTable
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
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'code', 'type' => 'string'),
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'parentid', 'type' => 'int'),
                    array('name' => 'path', 'type' => 'string'),
                    array('name' => 'icon', 'type' => 'string'),
                    array('name' => 'customicon')
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

    const table = 'Local';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 't.icon as customicon, "" as icon, (SELECT COUNT(q.id) FROM Task q WHERE q.localid = t.id)<1 as deleteable';
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

    public static function getByParent($filters = array(), $checkeable = false) {
        $select = 'p.*, (SELECT COUNT(q.id) FROM Task q WHERE q.localid = t.id)<1 as deleteable';
        return BaseTable::getByParent(self::table, $filters, $checkeable, $select, array('t.Local p'));
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array()) {
        $local = false;

        if (!$local && $array['code'] != '')
            $local = self::findByAK($array['code']);

        if (!$local && $array['id'] > 0) {
            $local = new Local();
            $local->fromArray($array);
            $parent = Doctrine::getTable('Local')->getRebuilded($array['Local']);
            if ($parent)
                $local->setLocal($parent);
            $local->save();
        }

        return $local;
    }

}
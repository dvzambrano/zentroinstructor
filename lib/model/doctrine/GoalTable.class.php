<?php

/**
 * GoalTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class GoalTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object GoalTable
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

    const table = 'Goal';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 't.icon as customicon, "" as icon, (SELECT COUNT(q.goalid) FROM GoalPlanRelation q WHERE q.goalid = t.id)<1 as deleteable';
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
        $select = 'p.*, (SELECT COUNT(q.goalid) FROM GoalPlanRelation q WHERE q.goalid = t.id)<1 as deleteable';
        return BaseTable::getByParent(self::table, $filters, $checkeable, $select, array('t.Goal p'));
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array()) {
        $goal = false;

        if (!$goal && $array['code'] != '')
            $goal = self::findByAK($array['code']);

        if (!$goal && $array['id'] > 0) {
            unset($array['GoalPlanRelation']);
            unset($array['Period']);
            
            $goal = new Goal();
            $goal->fromArray($array);
            $parent = Doctrine::getTable('Goal')->getRebuilded($array['Goal']);
            if ($parent)
                $goal->setGoal($parent);
            $goal->save();
        }

        return $goal;
    }

}
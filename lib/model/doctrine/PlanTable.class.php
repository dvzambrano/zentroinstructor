<?php

/**
 * PlanTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class PlanTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object PlanTable
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
                    array('name' => 'code', 'type' => 'string'),
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'baseline', 'type' => 'string'),
                    array('name' => 'start', 'type' => 'date', 'dateFormat' => 'Y-m-d'),
                    array('name' => 'guessstart', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'end', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'parentid', 'type' => 'int'),
                    array('name' => 'created_by', 'type' => 'int'),
                    array('name' => 'entityid', 'type' => 'int'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'conttasks', 'type' => 'int'),
                    array('name' => 'virtual', 'type' => 'bool'),
                    array('name' => 'Goals'),
                    array('name' => 'PlanPersonRelation'),
                    array('name' => 'Plan')
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

    const table = 'Plan';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        /*
        // esta es la variante correcta pero como se cambio q las tareas padres -> ya salen en el plan puesto q son las principales del responsable hay q quitar la restriccion de ->
        // to hide serial base tasks
        $select = 'ppr.*, p.*, u.*, gls.*, pln.*, 
            false as virtual, 
            (SELECT MAX(e1.end) FROM PlanTaskRelation ptr1 LEFT JOIN ptr1.Task tsk1 ON tsk1.id = ptr1.taskid LEFT JOIN tsk1.Event e1 ON e1.id = tsk1.eventid WHERE ptr1.planid = t.id AND e1.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as end, 
            (SELECT MIN(e11.start) FROM PlanTaskRelation ptr11 LEFT JOIN ptr11.Task tsk11 ON tsk11.id = ptr11.taskid LEFT JOIN tsk11.Event e11 ON e11.id = tsk11.eventid WHERE ptr11.planid = t.id AND e11.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as guessstart, 
            (SELECT COUNT(ptr2.planid) FROM PlanTaskRelation ptr2 LEFT JOIN ptr2.Task tsk2 ON tsk2.id = ptr2.taskid LEFT JOIN tsk2.Event e2 ON e2.id = tsk2.eventid WHERE ptr2.planid = t.id AND e2.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ')<1 as deleteable, 
            (SELECT COUNT(ptr3.planid) FROM PlanTaskRelation ptr3 LEFT JOIN ptr3.Task tsk3 ON tsk3.id = ptr3.taskid LEFT JOIN tsk3.Event e3 ON e3.id = tsk3.eventid WHERE ptr3.planid = t.id AND e3.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as conttasks';
        */
        $select = 'ppr.*, p.*, u.*, gls.*, pln.*, 
            false as virtual, 
            (SELECT MAX(e1.end) FROM PlanTaskRelation ptr1 LEFT JOIN ptr1.Task tsk1 ON tsk1.id = ptr1.taskid LEFT JOIN tsk1.Event e1 ON e1.id = tsk1.eventid WHERE ptr1.planid = t.id) as end, 
            (SELECT MIN(e11.start) FROM PlanTaskRelation ptr11 LEFT JOIN ptr11.Task tsk11 ON tsk11.id = ptr11.taskid LEFT JOIN tsk11.Event e11 ON e11.id = tsk11.eventid WHERE ptr11.planid = t.id) as guessstart, 
            (SELECT COUNT(ptr2.planid) FROM PlanTaskRelation ptr2 LEFT JOIN ptr2.Task tsk2 ON tsk2.id = ptr2.taskid LEFT JOIN tsk2.Event e2 ON e2.id = tsk2.eventid WHERE ptr2.planid = t.id)<1 as deleteable, 
            (SELECT COUNT(ptr3.planid) FROM PlanTaskRelation ptr3 LEFT JOIN ptr3.Task tsk3 ON tsk3.id = ptr3.taskid LEFT JOIN tsk3.Event e3 ON e3.id = tsk3.eventid WHERE ptr3.planid = t.id) as conttasks';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.PlanPersonRelation ppr', 'ppr.Person p', 'p.sfGuardUser u', 't.Goals gls', 't.Plan pln'), array(
                    array(
                        'field' => 'personid',
                        'realfield' => array('created_by', 'personid'),
                        'char' => array('t', 'ppr')
                        )), false, $select);
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

    //[getByParentMethod]

    public static function getChildsByParent($pk) {
        $q = Doctrine_Core::getTable(self::table)->createQuery('l')
                ->where('l.parentid = ?', $pk);

        $rows = $q->execute();

        return $rows;
    }

    public static function getBaseLineStadistics($ownerid = '', $planid = '') {
        $result = array(
            'equal' => array(),
            'diff' => array(),
            'neww' => array()
        );

        $obj = false;
        $actualtasks = array();

        if ($ownerid && $ownerid != '') {
            $query = Doctrine_Query::create()
                    ->select('t.*')
                    ->from('Task t')
                    ->leftJoin("t.Event e")
                    ->where('e.code NOT LIKE ? AND t.responsibleid = ?', array('%->%', $ownerid));
            $obj = Doctrine::getTable('Person')->find($ownerid);
            $actualtasks = $query->execute();
        } else
        if ($planid && $planid != '') {
            $query = Doctrine_Query::create()
                    ->select('t.*')
                    ->from('Task t')
                    ->leftJoin("t.Event e")
                    ->leftJoin("t.Plans p")
                    ->where('e.code NOT LIKE ? AND p.id = ?', array('%->%', $planid));

            $obj = Doctrine::getTable('Plan')->find($planid);
            $actualtasks = $query->execute();
        }

        if ($obj) {
            $basetasks = json_decode($obj->getBaseline());

            foreach ($actualtasks as $task) {
                $encodedtask = $task->toArray();
                $encodedtask['name'] = $task->getEvent()->getName();
                $encodedtask['start'] = $task->getEvent()->getStart();
                $encodedtask['end'] = $task->getEvent()->getEnd();
                $encodedtask['responsible'] = $task->getPerson()->getFullName();
                $encodedtask['creator'] = $task->getCreator()->getFullName();

                if (stripos($obj->getBaseline(), json_encode(array('id' => $task->getId(), 'start' => $task->getEvent()->getStart(), 'end' => $task->getEvent()->getEnd()))))
                    $result['equal'][] = $encodedtask;
                else {
                    $found = false;
                    foreach ($basetasks as $basetask)
                        if ($basetask->id == $encodedtask['id']) {
                            $encodedtask['startorginal'] = $basetask->start;
                            $encodedtask['endorginal'] = $basetask->end;

                            $result['diff'][] = $encodedtask;
                            $found = true;
                            break;
                        }

                    if (!$found)
                        $result['neww'][] = $encodedtask;
                }
            }
        }

        return $result;
    }

    private function getUsersLessOther() {
        $q = '';

        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u');

        return $q->execute();
    }

    private function getTasks($userid) {
        $person = Doctrine::getTable('Person')->find($userid);

        return count($person->getTasksOfResponsability());
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array()) {
        $plan = false;

        if (!$plan && $array['code'] != '')
            $plan = Doctrine::getTable('Plan')->findByAK($array['code']);

        if (!$plan && $array['id'] > 0) {
            $goals = array();
            foreach ($array['Goals'] as $item) {
                $goal = Doctrine::getTable('Goal')->getRebuilded($item);
                if ($goal)
                    $goals[] = $goal;
            }
            unset($array['Goals']);
            $plan = new Plan();
            $plan->fromArray($array);

            foreach ($goals as $goal)
                $plan->Goals[] = $goal;

            $plan->save();
        }

        return $plan;
    }

}
<?php

/**
 * TaskTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class TaskTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object TaskTable
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
                    array('name' => 'durationvalue', 'type' => 'decimal'),
                    array('name' => 'durationtype', 'type' => 'string'),
                    array('name' => 'manuallyprogrammed', 'type' => 'bool'),
                    array('name' => 'percentage', 'type' => 'decimal'),
                    array('name' => 'frequencytype', 'type' => 'int'),
                    array('name' => 'dailyrepetition', 'type' => 'string'),
                    array('name' => 'weeklyrepetition', 'type' => 'string'),
                    array('name' => 'monthlyrepetition', 'type' => 'string'),
                    array('name' => 'yearlyrepetition', 'type' => 'string'),
                    array('name' => 'breakingrepetition', 'type' => 'string'),
                    array('name' => 'participants', 'type' => 'string'),
                    array('name' => 'relateds', 'type' => 'string'),
                    array('name' => 'evidence', 'type' => 'string'),
                    array('name' => 'parentid', 'type' => 'int'),
                    array('name' => 'serialid', 'type' => 'int'),
                    array('name' => 'multipartid', 'type' => 'int'),
                    array('name' => 'tasktypeid', 'type' => 'int'),
                    array('name' => 'taskstatusid', 'type' => 'int'),
                    array('name' => 'localid', 'type' => 'int'),
                    array('name' => 'responsibleid', 'type' => 'int'),
                    array('name' => 'eventid', 'type' => 'int'),
                    array('name' => 'created_by', 'type' => 'int'),
                    array('name' => 'start', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'end', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'finished', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'path', 'type' => 'string'),
                    array('name' => 'entityid', 'type' => 'int'),
                    array('name' => 'activitytype', 'type' => 'int'),
                    array('name' => 'activityorigin', 'type' => 'int'),
                    array('name' => 'taskstatus', 'type' => 'string'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'isprincipal', 'type' => 'bool'),
                    array('name' => 'isinvitation', 'type' => 'bool'),
                    array('name' => 'Event'),
                    array('name' => 'Person'),
                    array('name' => 'Creator'),
                    array('name' => 'Local'),
                    array('name' => 'Tasktype'),
                    array('name' => 'Taskstatus'),
                    array('name' => 'Task')
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

    const table = 'Task';
    const akfield = 'id';

    public static function getAllPaged($start, $limit, $filters, $simple = false, $time = false) {
        $select = 'e.*, e.start as start, e.end as end, tt.*, ts.*, cal.*, p.*, pe.*, r.*, ru.*, crt.*, crtu.*, l.*, plns.*, 
            true as deleteable, ' . Task::getInvitationSubQuery() . ' as isinvitation';

        $where = false;
        switch ($time) {
            case 'inprogress':
                $where = Task::getInProgressSubQuery();
                break;
            case 'future':
                $where = Task::getCommingSubQuery();
                break;
            case 'ontime':
                $where = Task::getOnTimeSubQuery();
                break;
            case 'expired':
                $where = Task::getExpiredSubQuery();
                break;
            default:
                break;
        }

        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.Event e', 't.Tasktype tt', 't.Taskstatus ts', 'ts.Calendar cal', 't.Task p', 'p.Event pe', 't.Person r', 'r.sfGuardUser ru', 't.Creator crt', 'crt.sfGuardUser crtu', 't.Local l', 't.Plans plns'), array(array(
                        'field' => 'code',
                        'realfield' => 'code',
                        'char' => 'e'
                    ), array(
                        'field' => 'name',
                        'realfield' => 'name',
                        'char' => 'e'
                    ), array(
                        'field' => 'start',
                        'realfield' => 'start',
                        'char' => 'e'
                    ), array(
                        'field' => 'end',
                        'realfield' => 'end',
                        'char' => 'e'
                    ), array(
                        'field' => 'responsible',
                        'realfield' => array('first_name', 'last_name', 'email_address'),
                        'char' => 'ru'
                    ), array(
                        'field' => 'tasktype',
                        'realfield' => 'name',
                        'char' => 'tt'
                    ), array(
                        'field' => 'taskstatus',
                        'realfield' => 'name',
                        'char' => 'ts'
                    ), array(
                        'field' => 'local',
                        'realfield' => 'name',
                        'char' => 'l'
                    ), array(
                        'field' => 'planid',
                        'realfield' => 'id',
                        'char' => 'plns'
                        )), 't.id ASC', $select, $where);
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

    public static function deleteByPK($planid, $pks) {
        $count = 0;
        foreach ($pks as $pk) {
            $obj = self::getInstance()->find($pk);

            $query = Doctrine_Core::getTable('PlanTaskRelation')->createQuery('r')
                    ->where('r.taskid = ?', $obj->getId());

            // if this task is only on this plan
            if ($query->count() < 2) {
                // deleting relations in other task to this one
                $q = Doctrine_Query::create()
                        ->select('t.*')
                        ->from('Task t')
                        ->where('t.relateds LIKE ?', '%"id":' . $obj->getId() . ',"name":"' . $obj->getEvent()->getName() . '"%');
                $relateds = $q->execute();
                foreach ($relateds as $related) {
                    $newrelations = array();
                    $relations = json_decode($related->getRelateds());
                    foreach ($relations as $relation)
                        if ($relation->id != $obj->getId())
                            $newrelations[] = $relation;
                    $related->setRelateds(json_encode($newrelations));
                    $related->save();
                }
                // deleting current task
                $obj->getEvent()->delete();
            } else {
                // this is a multi plan task, so we have to delete only the relation to current plan
                $query = Doctrine_Core::getTable('PlanTaskRelation')->createQuery('r')
                        ->where('r.taskid = ? AND r.planid = ?', array($obj->getId(), $planid));
                $relation = $query->fetchOne();
                if ($relation)
                    $relation->delete();
            }

            $count++;
        }
        return $count;
    }

    public static function exploreTasksInSerialANDInMultipart($pks) {
        $array = array();

        foreach ($pks as $value) {

            $q = Doctrine_Query::create()
                    ->select('t.id')
                    ->from('Task t')
                    ->leftJoin('t.Event e')
                    ->where('t.id != ? AND e.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE, $value)
                    ->whereIn('t.serialid', array($value));
            $elements = $q->fetchArray();
            foreach ($elements as $v)
                $array[] = $v['id'];

            $q = Doctrine_Query::create()
                    ->select('t.id')
                    ->from('Task t')
                    ->leftJoin('t.Event e')
                    ->where('t.id != ? AND e.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE, $value)
                    ->whereIn('t.multipartid', array($value));
            $elements = $q->fetchArray();
            foreach ($elements as $v)
                $array[] = $v['id'];

            $array[] = $value;
        }

        $temp = array();
        foreach ($array as $value)
            if (!in_array($value, $temp))
                $temp[] = $value;
        $array = $temp;

        return $array;
    }

    public static function getByParent($filters = array(), $checkeable = false) {
        $select = 'p.*, r.*, ru.*, m.*, mu.*, (SELECT COUNT(q.id) FROM TaskpersonRelation q WHERE q.taskid = t.id)<1 as deleteable';
        return BaseTable::getByParent(self::table, $filters, $checkeable, $select, array('t.Task p', 't.Responsible r', 'r.sfGuardUser ru', 't.Members m', 'm.sfGuardUser mu'));
    }

    public static function getArrayForReport($planid = false, $personid = false, $year = false, $month = false, $onlyparents = false, $orderedbytasktype = false) {
        /*
        // esta es la variante correcta pero como se cambio q las tareas padres -> ya salen en el plan puesto q son las principales del responsable hay q quitar la restriccion de ->
        // to hide serial base tasks
        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin("t.Event e")
                ->leftJoin("t.Tasktype tt")
                ->leftJoin("t.Taskstatus ts")
                ->where(Task::getExcludeInvitationSubQuery() . ' < 1')
                ->andWhere('e.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE);
                */
        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin("t.Event e")
                ->leftJoin("t.Tasktype tt")
                ->leftJoin("t.Taskstatus ts")
                ->where(Task::getExcludeInvitationSubQuery() . ' < 1');
        if($orderedbytasktype)
            $q = $q->orderBy('tt.name ASC');
        else
            $q = $q->orderBy('e.start ASC');

        if ($planid) {
            $q = $q->leftJoin("t.Plans p");
            $q->addWhere('p.id = ?', $planid);
        }
        if ($personid)
            $q->addWhere('t.responsibleid = ?', $personid);
        if ($onlyparents)
            $q->addWhere('t.parentid is NULL');

        $firstday = date_create_from_format('Y-m-d H:i:s', $year . '-01-01' . ' 00:00:00');
        $lastday = date_create_from_format('Y-m-d H:i:s', $year . '-12-31' . ' 23:59:59');

        if ($month) {
            $firstday = date_create_from_format('Y-m-d H:i:s', $year . '-' . $month . '-01' . ' 00:00:00');
            $lastday = date_create_from_format('d/m/Y H:i:s', date('d/m/Y', strtotime('last day of ' . $firstday->format('M') . ' ' . $firstday->format('Y'))) . ' 23:59:59');
        }

        //echo $firstday->format('Y-m-d') . ' - ' . $lastday->format('Y-m-d');
        $q->addWhere('(e.start >= ? AND e.start <= ?) OR (e.end >= ? AND e.end <= ?) OR (e.start <= ? AND e.end >= ?)', array($firstday->format('Y-m-d H:i:s'), $lastday->format('Y-m-d H:i:s'), $firstday->format('Y-m-d H:i:s'), $lastday->format('Y-m-d H:i:s'), $firstday->format('Y-m-d H:i:s'), $lastday->format('Y-m-d H:i:s')));



        return $q->execute();
    }

    public static function exploreAvailability($start, $end, $person, $task = false) {
        $result = array();

        // dates must be in 'Y-m-d H:i:s' format
        $q = Doctrine_Core::getTable(self::table)->createQuery('t')
                ->leftJoin('t.Event e')
                ->leftJoin('t.Person p')
                ->where('t.id != ? AND t.parentid != ? AND p.id = ? AND e.start >= ? AND e.end >= ? AND e.start <= ?', array($task, $task, $person, $start, $end, $end)) // left limit
                ->orWhere('t.id != ? AND t.parentid != ? AND p.id = ? AND e.start >= ? AND e.end <= ?', array($task, $task, $person, $start, $end)) // iqual or content
                ->orWhere('t.id != ? AND t.parentid != ? AND p.id = ? AND e.start <= ? AND e.end >= ?', array($task, $task, $person, $start, $end)) // iqual or content
                ->orWhere('t.id != ? AND t.parentid != ? AND p.id = ? AND e.start <= ? AND e.end <= ? AND e.end >= ?', array($task, $task, $person, $start, $end, $start)); // right limit
        if (!$task)
            $q = Doctrine_Core::getTable(self::table)->createQuery('t')
                    ->leftJoin('t.Event e')
                    ->leftJoin('t.Person p')
                    ->where('p.id = ? AND e.start >= ? AND e.end >= ? AND e.start <= ?', array($person, $start, $end, $end)) // left limit
                    ->orWhere('p.id = ? AND e.start >= ? AND e.end <= ?', array($person, $start, $end)) // iqual or content
                    ->orWhere('p.id = ? AND e.start <= ? AND e.end >= ?', array($person, $start, $end)) // iqual or content
                    ->orWhere('p.id = ? AND e.start <= ? AND e.end <= ? AND e.end >= ?', array($person, $start, $end, $start)); // right limit
        $tasks = $q->execute();

        foreach ($tasks as $task) {
            $temp = $task->toArray();
            $temp['Creator']['sfGuardUser'] = $task->getCreator()->getSfGuardUser()->toArray();
            $temp['Person']['sfGuardUser'] = $task->getPerson()->getSfGuardUser()->toArray();

            $result[] = $temp;
        }

        return $result;
    }

    public static function getTaskIDBySiblings($id, $array = array()) {
        $task = BaseTable::findByAK(self::table, self::akfield, $id);

        if ($task->getParentid() > 0) {
            $query = Doctrine_Query::create()
                    ->select('t.*')
                    ->from('Task t')
                    ->where('t.parentid = ' . $task->getParentid())
                    ->orderBy('t.id asc');
            $sons = $query->execute()->toArray();

            for ($index = 0; $index < count($sons); $index++)
                if ($sons[$index]["id"] == $id) {
                    $array[] = $index + 1;
                    break;
                }
                
                $array = TaskTable::getTaskIDBySiblings($task->getParentid(), $array);
        }

        return $array;
    }

    public static function getSummary($responsible = false) {
        $query = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin('t.Event e')
                ->where(Task::getInProgressSubQuery());
        if ($responsible)
            $query->addWhere('t.responsibleid = ?', $responsible);
        $inprogress = $query->count();

        $query = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin('t.Event e')
                ->where(Task::getOnTimeSubQuery());
        if ($responsible)
            $query->addWhere('t.responsibleid = ?', $responsible);
        $ontime = $query->count();

        $query = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin('t.Event e')
                ->where(Task::getOutOfTimeSubQuery());
        if ($responsible)
            $query->addWhere('t.responsibleid = ?', $responsible);
        $outoftime = $query->count();

        $query = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin('t.Event e')
                ->where(Task::getCommingSubQuery());
        if ($responsible)
            $query->addWhere('t.responsibleid = ?', $responsible);
        $comming = $query->count();

        $query = Doctrine_Query::create()
                ->select('t.*')
                ->from('Task t')
                ->leftJoin('t.Event e')
                ->where(Task::getExpiredSubQuery());
        if ($responsible)
            $query->addWhere('t.responsibleid = ?', $responsible);
        $expired = $query->count();

        $rows = array(
            array('name' => 'task.inprogress.title', 'amount' => $inprogress, 'flag' => '2e8f0c'),
            array('name' => 'task.future.title', 'amount' => $comming, 'flag' => 'f88015')
        );
        if ($ontime > 0)
            $rows[] = array('name' => 'task.ontime.title', 'amount' => $ontime, 'flag' => '83ad47');
        if ($outoftime > 0)
            $rows[] = array('name' => 'task.outoftime.title', 'amount' => $outoftime, 'flag' => 'fa7166');
        if ($expired > 0)
            $rows[] = array('name' => 'task.expired.title', 'amount' => $expired, 'flag' => 'cf2424');

        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from('Reminder t');
        $reminders = $q->execute();


        $dates = array();
        $reminded = array();
        foreach ($reminders as $reminder) {
            $date = date_create_from_format('Y-m-d H:i', date('Y-m-d H:i'));
            switch ($reminder->getPeriod()) {
                case 1:
                    $date->add(new DateInterval('PT' . $reminder->getValue() . 'M'));
                    break;
                case 2:
                    $date->add(new DateInterval('PT' . $reminder->getValue() . 'H'));
                    break;
                case 3:
                    $date->add(new DateInterval('P' . $reminder->getValue() . 'D'));
                    break;
                case 4:
                    $date->add(new DateInterval('P' . $reminder->getValue() * 7 . 'D'));
                    break;
                case 5:
                    $date->add(new DateInterval('P' . $reminder->getValue() . 'M'));
                    break;
                case 6:
                    $date->add(new DateInterval('P' . $reminder->getValue() . 'Y'));
                    break;
                default:
                    break;
            }
            $dates[] = $reminder->getPeriod() . ': ' . $date->format('Y-m-d H:i');

            $q = Doctrine_Query::create()
                    ->select('t.*, e.*, tt.*, ts.*, tsc.*, l.*, c.*, cu.*, p.*, pu.*')
                    ->from('Task t')
                    ->leftJoin('t.Event e')
                    ->leftJoin('t.Tasktype tt')
                    ->leftJoin('t.Taskstatus ts')
                    ->leftJoin('ts.Calendar tsc')
                    ->leftJoin('t.Local l')
                    ->leftJoin('t.Creator c')
                    ->leftJoin('c.sfGuardUser cu')
                    ->leftJoin('t.Person p')
                    ->leftJoin('p.sfGuardUser pu')
                    ->where('e.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ' AND e.reminderid = ? AND e.start >= ? AND e.start <= ?', array($reminder->getId(), $date->format('Y-m-d H:i') . ':00', $date->format('Y-m-d H:i') . ':59'));
            if ($responsible)
                $q->addWhere('t.responsibleid = ?', $responsible);

            if ($q->count() > 0)
                $reminded = array_merge($reminded, $q->execute()->toArray());
        }
        if (count($reminded) > 0)
            $rows[] = array('name' => 'task.reminder.title', 'amount' => count($reminded), 'flag' => '542382', 'data' => $reminded);

        $rows = array(
            'metaData' => array(
                'idProperty' => 'name',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'amount', 'type' => 'int'),
                    array('name' => 'flag', 'type' => 'string')
                ),
                'sortInfo' => array(
                    'field' => 'name',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => 4,
            'dates' => $dates,
            'data' => $rows,
            'page' => 1
        );
        return $rows;
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array(), $responsibleid = false) {
        $responsible = false;
        if ($responsibleid)
            $responsible = Doctrine::getTable('Person')->find($responsibleid);
        else
            $responsible = Doctrine::getTable('Person')->getRebuilded($array['Person']);

        $creator = Doctrine::getTable('Person')->getRebuilded($array['Creator']);
        $tasktype = Doctrine::getTable('Tasktype')->getRebuilded($array['Tasktype']);
        $local = Doctrine::getTable('Local')->getRebuilded($array['Local']);
        $taskstatus = Doctrine::getTable('Taskstatus')->getRebuilded($array['Taskstatus']);
        $event = Doctrine::getTable('Event')->getRebuilded($array['Event']);

        if (!$event) {
            $task = new Task();
            $task->fromArray($array);
            $task->save();
        }
        if ($responsible)
            $task->setPerson($responsible);
        if ($creator)
            $task->setCreator($creator);
        if ($tasktype)
            $task->setTasktype($tasktype);
        if ($local)
            $task->setLocal($local);
        if ($taskstatus)
            $task->setTaskstatus($taskstatus);
        if ($event) {
            $task->getEvent()->setReminder(null);
            $task->setEvent($event);
        }

        $task->save();

        return $task;
    }

}
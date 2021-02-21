<?php

/**
 * PersonTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class PersonTable extends sfPersonTable {
    
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
                    array('name' => 'customicon'),
                    array('name' => 'phone', 'type' => 'string'),
                    array('name' => 'cellphone', 'type' => 'string'),
                    array('name' => 'address', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'picture', 'type' => 'string'),
                    array('name' => 'baseline', 'type' => 'string'),
                    array('name' => 'teamid', 'type' => 'string'),
                    array('name' => 'readonly', 'type' => 'string'),
                    array('name' => 'guessstart', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'start', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'end', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'conttasks', 'type' => 'int'),
                    array('name' => 'sfGuardUser')
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

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        /*
        // esta es la variante correcta pero como se cambio q las tareas padres -> ya salen en el plan puesto q son las principales del responsable hay q quitar la restriccion de ->
        $select = 'u.*, tib.*, tiv.*, true as virtual, CONCAT(u.first_name, " ", u.last_name) AS name,
            u.created_at as start,
            u.created_at as guessstart,
            (SELECT MAX(e1.end) FROM Task tsk1 LEFT JOIN tsk1.Event e1 ON e1.id = tsk1.eventid WHERE tsk1.responsibleid = t.id AND e1.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as end,
            (SELECT COUNT(tsk2.responsibleid) FROM Task tsk2 LEFT JOIN tsk2.Event e2 ON e2.id = tsk2.eventid WHERE tsk2.responsibleid = t.id AND e2.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as conttasks,
            (SELECT COUNT(tsk3.responsibleid) FROM Task tsk3 LEFT JOIN tsk3.Event e3 ON e3.id = tsk3.eventid WHERE tsk3.responsibleid = t.id AND e3.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ')<1 as deleteable';
            */
        $select = 'u.*, tib.*, tiv.*, true as virtual, CONCAT(u.first_name, " ", u.last_name) AS name,
            u.created_at as start,
            u.created_at as guessstart,
            (SELECT MAX(e1.end) FROM Task tsk1 LEFT JOIN tsk1.Event e1 ON e1.id = tsk1.eventid WHERE tsk1.responsibleid = t.id) as end,
            (SELECT COUNT(tsk2.responsibleid) FROM Task tsk2 LEFT JOIN tsk2.Event e2 ON e2.id = tsk2.eventid WHERE tsk2.responsibleid = t.id) as conttasks,
            (SELECT COUNT(tsk3.responsibleid) FROM Task tsk3 LEFT JOIN tsk3.Event e3 ON e3.id = tsk3.eventid WHERE tsk3.responsibleid = t.id)<1 as deleteable';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.sfGuardUser u', 't.TeamsIBelong tib', 't.TeamsImBoss tiv'), array(
                    array(
                        'field' => 'name',
                        'realfield' => array('first_name', 'last_name'),
                        'char' => 'u'
                    ), array(
                        'field' => 'entityid',
                        'realfield' => 'entityid',
                        'char' => array('tib', 'tiv')
                    ), array(
                        'field' => 'teamid',
                        'realfield' => 'id',
                        'char' => array('tib', 'tiv')
                        )), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function getAll($filters = array(), $simple = false) {
        return self::getAllPaged(0, PHP_INT_MAX, $filters, $simple);
    }

    public static function getAllPersonsByTeam($teamid, $plan = false, $distinct = false) {
        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from(self::table . ' t')
                ->leftJoin('t.TeamsImBoss tbs')
                ->leftJoin('t.TeamsIBelong tbg')
                ->where('tbs.id = ? OR tbg.id = ?', array($teamid, $teamid));

        if ($distinct) {
            $where = '';
            $params = array();
            for ($i = 0; $i < count($distinct); $i++) {
                if ($i == 0)
                    $where = $where . 't.id != ?';
                else
                    $where = $where . ' AND t.id != ?';
                $params[] = $distinct[$i]->id;
            }
            $q->addWhere($where, $params);
        }

        return self::formatData($q->execute(), 1, $q->count());
    }

    public static function getAllPersonsByPlan($planid) {

        $q = Doctrine_Query::create()
                ->select('p.*, pp.*, u.*')
                ->from(self::table . ' p')
                ->leftJoin('p.PlanPersonRelation pp')
                ->leftJoin('p.sfGuardUser u')
                ->where('pp.planid = ?', $planid);

        return self::formatData($q->execute(), 1, $q->count());
    }

    public static function getAllNoResponsibles($query) {

        $rows = new Doctrine_Collection(self::table);

        $persons = Doctrine_Query::create()
                ->from(self::table . ' p');

        $persons = $persons->execute();

        if ($query && $query != '') {
            $persons = Doctrine_Query::create()
                    ->select('p.*')
                    ->from(self::table . ' p')
                    ->leftJoin('p.sfGuardUser u')
                    ->where('u.first_name LIKE ? OR u.last_name LIKE ?', array('%' . $query . '%', '%' . $query . '%'));

            $persons = $persons->execute();
        }

        $responsibles = Doctrine_Query::create()
                ->select('t.*, p.*')
                ->from(self::table . ' p')
                ->leftJoin('p.Team t')
                ->where('t.responsibleid = p.id');

        $responsibles = $responsibles->execute();

        foreach ($persons as $person) {
            $exist = false;
            foreach ($responsibles as $responsible)
                if ($person->getId() == $responsible->getId()) {
                    $exist = true;
                    break;
                }

            if (!$exist)
                $rows[] = $person;
        }

        return self::formatData($rows, 1, count($rows));
    }

    public static function getAllLeadedQuery($personid, $entityid) {
        $parentids = array();

        $q = Doctrine_Query::create()
                ->select('t.*, p.*')
                ->from('Team t')
                ->where('t.responsibleid = ? AND t.entityid = ?', array($personid, $entityid));

        $teamsleaded = $q->execute();
        foreach ($teamsleaded as $teamleaded) {
            $childs = BaseTable::getAllChilds('Team', 'parentid', $teamleaded->getId(), true);
            $parentids = array_unique(array_merge($parentids, $childs['ids']));
        }

        $select = 't.*, u.*, tib.*, tiv.*, true as virtual, CONCAT(u.first_name, " ", u.last_name) AS name,
            u.created_at as start,
            (SELECT MAX(e1.end) FROM Task tsk1 LEFT JOIN tsk1.Event e1 ON e1.id = tsk1.eventid WHERE tsk1.responsibleid = t.id AND e1.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as end,
            (SELECT COUNT(tsk2.responsibleid) FROM Task tsk2 LEFT JOIN tsk2.Event e2 ON e2.id = tsk2.eventid WHERE tsk2.responsibleid = t.id AND e2.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ') as conttasks,
            (SELECT COUNT(tsk3.responsibleid) FROM Task tsk3 LEFT JOIN tsk3.Event e3 ON e3.id = tsk3.eventid WHERE tsk3.responsibleid = t.id AND e3.code NOT LIKE ' . Task::LIKE_COMPARITION_CODE . ')<1 as deleteable';
        $q = Doctrine_Query::create()
                ->select($select)
                ->from('Person t')
                ->leftJoin("t.sfGuardUser u")
                ->leftJoin("t.TeamsIBelong tp")
                ->leftJoin("t.TeamsImBoss tj")
                ->whereIn('tp.parentid', $parentids)
                ->orWhereIn('tp.id', $parentids)
                ->orWhereIn('tj.id', $parentids)
                ->orWhere('t.id = ?', $personid);

        return $q;
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array()) {
        $person = false;

        if (!$person && $array['code'] != '')
            $person = Doctrine::getTable('Person')->findByAK($array['code']);
        if (!$person && $array['first_name'] != '' && $array['last_name'] != '') {
            $query = Doctrine_Query::create()
                    ->select('p.*')
                    ->from('Person p')
                    ->leftJoin('p.sfGuardUser u')
                    ->where('u.first_name = ?', $array['first_name'])
                    ->orWhere('u.last_name = ?', $array['last_name'])
                    ->andWhere('u.is_active = ?', true);
            $person = $query->fetchOne();
        }
        if (!$person && $array['sfGuardUser'] && $array['sfGuardUser']['username'] != '') {
            $person = Doctrine::getTable('sfGuardUser')->retrieveByUsername($array['sfGuardUser']['username']);
            if ($person)
                $person = $person->getPerson();
        }
        if (!$person && $array['sfGuardUser'] && $array['sfGuardUser']['email_address'] != '') {
            $person = Doctrine::getTable('sfGuardUser')->retrieveByUsername($array['sfGuardUser']['email_address']);
            if ($person)
                $person = $person->getPerson();
        }

        if (!$person) {
            $person = new Person();
            $person->fromArray($array);
            $user = $person->getSfGuardUser()->copy();
            $person->setSfGuardUser($user);
            $person->save();
        }

        return $person;
    }

}
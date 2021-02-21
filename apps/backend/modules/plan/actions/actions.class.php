<?php

/**
 * title actions.
 *
 * @package    SGArqBase
 * @subpackage plan
 * @author     Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class planActions extends sfBaseActions {

    private static $children = Array();

    public function executeRequest(sfWebRequest $request) {
        $response = array();

        try {
            switch ($request->getParameter('method')) {
                case 'gettasks4planorperson':
                    $obj = $this->gettasks4PlanOrPerson($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful', 'data' => $obj);
                    break;
                case 'resetbaseline':
                    $this->resetbaseline($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
                    break;
                case 'createbaseline':
                    $this->createbaseline($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
                    break;
                case 'explorebaseline':
                    $data =  $this->explorebaseline($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful', 'data' => $data);
                    break;
                case 'explore':
                    $response = $this->explore($request);
                    $response = array('success' => true, 'message' => $response, 'location' => date('YmdHis') . '-' . rand(1, 9999));
                    break;
                case 'export':
                    $this->export($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
                    break;
                case 'readimport':
                    $response = $this->readimport($request);
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'viewexport':
                    header('Content-type: application/json');
                    header('Content-Disposition: attachment; filename=' . chr(octdec('42')) . date('YmdHis') . '.zi1' . chr(octdec('42')));
                    readfile('uploads/db/' . $request->getParameter('location') . '.json');
                    return $this->renderText('');
                default:
                    return parent::executeRequest($request);
                    break;
            }
        } catch (Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return $this->renderText(json_encode($response));
    }

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {

            case 'combo':
                $rows = PlanTable::getInstance()->getAll($filter);
                break;

            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                if ($request->getParameter('superadmin') && $request->getParameter('superadmin') == 'true') {
                    
                } else {
                    if ($request->getParameter('personid') && $request->getParameter('personid') != '') {
                        $obj = new stdClass();
                        $obj->type = "int";
                        $obj->field = "personid";
                        $obj->comparison = "eq";
                        $obj->value = $request->getParameter('personid');
                        $filter[] = $obj;
                    }
                }

                if ($request->getParameter('type') == 'personal') {
                    if ($request->getParameter('superadmin') && $request->getParameter('superadmin') == 'true') {
                        $rows = PersonTable::getInstance()->getAllPaged($start, $limit, $filter);
                    } else {
                        $q = Doctrine::getTable('Person')->getAllLeadedQuery($request->getParameter('personid'), $request->getParameter('entityid'));

                        $pager = new sfDoctrinePager('Person', $limit);

                        $pager->setQuery($q);
                        $page = $start ? $start / $limit + 1 : 1;
                        $pager->setPage($page);

                        $pager->init();

                        $rows = Doctrine::getTable('Person')->formatData($pager->getResults(), $page, $q->count());
                    }
                }
                else
                    $rows = PlanTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            case 'tree':
                $id = $request->getParameter('node');
                $checkeable = $request->getParameter('checkeable');
                $query = $request->getParameter('query');
                $rows = PlanTable::getInstance()->getByParent($id, $query, $checkeable);
                if ($request->getParameter('customParam') != '')
                    $rows = PlanTable::getInstance()->getByParent($id, $query, $checkeable);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $plan = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $plan = Doctrine::getTable('Plan')->find($request->getParameter('id'));

        if ($plan == array()) {
            $plan = Doctrine::getTable('Plan')->findByAK($ak);
            if ($plan)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('plan.field.label', 'plan.field.name', $request->getParameter('name')),
                            data => $plan->toArray()
                        )));
            $plan = new Plan();

            $sender = Doctrine::getTable('sfGuardUser')->retrieveByUsername($this->getUser()->getUsername());
            $plan->setCreator($sender->getPerson());
        }

        $plan->setCode($ak);
        $plan->setName($request->getParameter('name'));
        $plan->setComment($request->getParameter('comment'));

        if ($request->getParameter('start') && $request->getParameter('start') != '')
            $plan->setStart(Util::convertToDate($request->getParameter('start'), 'd/m/Y', 'Y-m-d'));

        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $plan->setEntityid($request->getParameter('entityid'));

        if ($request->getParameter('parentid') && $request->getParameter('parentid') != '')
            $plan->setParentid($request->getParameter('parentid'));


        $plan->save();
        sfContext::getInstance()->getLogger()->alert('Salvado plan de trabajo ' . $plan->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');


        // asociating goals
        $q = Doctrine_Query::create()
                ->delete('GoalPlanRelation')
                ->addWhere('planid = ?', $plan->getId());
        $q->execute();
        if ($request->getParameter('goals') && $request->getParameter('goals') != '') {
            $goals = json_decode($request->getParameter('goals'));
            foreach ($goals as $goal) {
                $relation = new GoalPlanRelation();
                $relation->setPlanid($plan->getId());
                $relation->setGoalid($goal->id);
                $relation->save();
            }
        }

        // asociating persons
        $q = Doctrine_Query::create()
                ->delete('PlanPersonRelation')
                ->addWhere('planid = ?', $plan->getId());
        $q->execute();
        if ($request->getParameter('persons') && $request->getParameter('persons') != '') {
            $persons = json_decode($request->getParameter('persons'));
            foreach ($persons as $person) {
                $relation = new PlanPersonRelation();
                $relation->setPlanid($plan->getId());
                $relation->setPersonid($person->id);
                $relation->setReadonly($person->readonly);
                $relation->save();
            }
        }

        // adjusting parents dates
        $parent = $plan->getPlan();
        while ($parent && $parent->getId() > 0) {
            if ($plan->getStart() < $parent->getStart()) {
                $parent->setStart($plan->getStart());
                $parent->save();
            }
            $parent = $parent->getPlan();
        }

        return $plan->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Plan')->deleteByPK($pks);
    }

    public function gettasks4PlanOrPerson(sfWebRequest $request) {
        if ($request->getParameter('institutional') && $request->getParameter('institutional') != '') {
            $plan = Doctrine::getTable('Plan')->find($request->getParameter('id'));
            return $plan->getTasks()->toArray();
        } else {
            $person = Doctrine::getTable('Person')->find($request->getParameter('id'));
            return $person->getTasksImResponsible()->toArray();
        }
    }

    public function resetbaseline(sfWebRequest $request) {
        if ($request->getParameter('institutional') && $request->getParameter('institutional') != '') {
            $plan = Doctrine::getTable('Plan')->find($request->getParameter('id'));
            $plan->setBaseline(json_encode(array()));
            $plan->save();
        } else {
            $person = Doctrine::getTable('Person')->find($request->getParameter('id'));
            $person->setBaseline(json_encode(array()));
            $person->save();
        }
    }

    public function createbaseline(sfWebRequest $request) {
        $task = Doctrine::getTable('Task')->find($request->getParameter('taskid'));
        $start = date_create_from_format('Y-m-d H:i:s', $task->getEvent()->getStart());
        $end = date_create_from_format('Y-m-d H:i:s', $task->getEvent()->getEnd());

        if ($request->getParameter('institutional') && $request->getParameter('institutional') != '') {
            $plan = Doctrine::getTable('Plan')->find($request->getParameter('objid'));
            $baseline = json_decode($plan->getBaseline());
            $baseline[] = array(
                'id' => $task->getId(),
                'start' => $start->format('Y-m-d H:i') . ':00',
                'end' => $end->format('Y-m-d H:i') . ':00'
            );
            $plan->setBaseline(json_encode($baseline));
            $plan->save();
        } else {
            $person = Doctrine::getTable('Person')->find($request->getParameter('objid'));
            $baseline = json_decode($person->getBaseline());
            $baseline[] = array(
                'id' => $task->getId(),
                'start' => $start->format('Y-m-d H:i') . ':00',
                'end' => $end->format('Y-m-d H:i') . ':00'
            );
            $person->setBaseline(json_encode($baseline));
            $person->save();
        }
    }

    public function explorebaseline(sfWebRequest $request) {
        $task = Doctrine::getTable('Task')->find($request->getParameter('taskid'));
        $start = date_create_from_format('Y-m-d H:i:s', $task->getEvent()->getStart());
        $end = date_create_from_format('Y-m-d H:i:s', $task->getEvent()->getEnd());

        $obj = false;

        if ($request->getParameter('institutional') && $request->getParameter('institutional') != '')
            $obj = Doctrine::getTable('Plan')->find($request->getParameter('objid'));
        else
            $obj = Doctrine::getTable('Person')->find($request->getParameter('objid'));


        $result = json_decode($request->getParameter('result'), true);
        
        if ($obj) {
            $basetasks = json_decode($obj->getBaseline());

            $encodedtask = $task->toArray();
            $encodedtask['name'] = $task->getEvent()->getName();
            $encodedtask['start'] = $task->getEvent()->getStart();
            $encodedtask['end'] = $task->getEvent()->getEnd();
            $encodedtask['responsible'] = $task->getPerson()->getFullName();
            $encodedtask['creator'] = $task->getCreator()->getFullName();

            if (stripos($obj->getBaseline(), json_encode(array('id' => $task->getId(), 'start' => $start->format('Y-m-d H:i') . ':00', 'end' => $end->format('Y-m-d H:i') . ':00'))))
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
        
        return $result;
    }

    public function explore(sfWebRequest $request) {
        $result = array();
        if ($request->getParameter('institutional') && $request->getParameter('institutional') != '') {
            $plan = Doctrine::getTable('Plan')->find($request->getParameter('id'));
            $result = $plan->getTasks();
        } else {
            $person = Doctrine::getTable('Person')->find($request->getParameter('id'));
            $result = $person->getTasksImResponsible();
        }
        $temp = array();
        foreach ($result as $task) {
            if ($request->getParameter('noserialmultipart') && $request->getParameter('noserialmultipart') != '') {
                if (!$task->getSerialid() && !$task->getMultipartid())
                    $temp[] = array(
                        'id' => $task->getId(),
                        'name' => $task->getEvent()->getName()
                    );
            }
            else
                $temp[] = array(
                    'id' => $task->getId(),
                    'name' => $task->getEvent()->getName()
                );
        }
        return $temp;
    }

    public function export(sfWebRequest $request) {
        $result = array();

        $location = Util::getRootPath('/db/' . $request->getParameter('location') . '.json');
        if ($request->getParameter('item') && $request->getParameter('item') != '') {
            $author = Doctrine::getTable('sfGuardUser')->retrieveByUsername($this->getUser()->getUsername());
            $result['metadata'] = array(
                'date' => date('d/m/Y g:i A'),
                'author' => $author->getFirstName() . ' ' . $author->getLastName(),
                'username' => $this->getUser()->getUsername()
            );

            if ($request->getParameter('institutional') && $request->getParameter('institutional') != '') {
                $plan = Doctrine::getTable('Plan')->find($request->getParameter('id'));
                $result['plan'] = $plan->toArray();
                $result['plan']['Goals'] = array();
                foreach ($plan->getGoals() as $goal)
                    $result['plan']['Goals'][] = $goal->getAsArray();
            }

            $content = json_encode($result);
            $content = sfSecurity::encrypt($content, sfSecurity::EXPORT_KEY);
            file_put_contents($location, $content);
            $result = array();
        }

        if ($request->getParameter('taskid') && $request->getParameter('taskid') != '') {
            $task = Doctrine::getTable('Task')->find($request->getParameter('taskid'));
            $result = $task->getAsArray();
        }

        $content = file_get_contents($location, true);
        $content = $content . ';' . sfSecurity::encrypt(json_encode($result), sfSecurity::EXPORT_KEY);
        // deleting car returns and line jumps
        $content = str_replace("\n", " ", $content);
        $content = str_replace("\r", "", $content);
        // deleting duplicated 'space;'
        while (stripos($content, "; ;"))
            $content = str_replace("; ;", ";", $content);
        while (stripos($content, ";;"))
            $content = str_replace(";;", ";", $content);
        // deleting duplicated spaces
        $content = preg_replace('/\s\s+/', ' ', $content);

        file_put_contents($location, $content);
    }

    public function readimport(sfWebRequest $request) {
        $metadata = '';
        if ($request->getParameter('url') && $request->getParameter('url') != '') {
            $location = Util::getRootPath($request->getParameter('url'), true, true);

            $content = file_get_contents($location, true);

            $lines = explode(';', $content);
            $metadata = sfSecurity::decrypt($lines[0], sfSecurity::EXPORT_KEY);
            $metadata = json_decode($metadata, true);
            $metadata['amount'] = count($lines) - 1;
        }
        return $metadata;
    }

}

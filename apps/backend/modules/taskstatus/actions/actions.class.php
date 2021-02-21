<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage taskstatus
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class taskstatusActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        
        $m = ModuleTable::getInstance()->getMultientityManager();
        $filter = $this->getFilter($request, $m && $m->getIsActive());

        switch ($request->getParameter('component')) {
            case 'combo':
                switch ($request->getParameter('restriction')) {
                    case 'onlyparents':
                        $rows = TaskstatusTable::getInstance()->getOnlyPimaries($filter);
                        break;
                    case 'next':
                        $rows = TaskstatusTable::getInstance()->getOnlyNext($request->getParameter('id'));
                        break;
                    default:
                        $rows = TaskstatusTable::getInstance()->getAll($filter);
                        break;
                }
                break;

            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
                $rows = TaskstatusTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $taskstatus = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('entityid'));

        if ($request->getParameter('id') != '')
            $taskstatus = Doctrine::getTable('Taskstatus')->find($request->getParameter('id'));

        if ($taskstatus == array()) {
            $calendar = Doctrine::getTable('Calendar')->findByAK($ak);
            if ($calendar)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('taskstatus.field.label', 'taskstatus.field.name', $request->getParameter('name'))
                        )));
            $taskstatus = new Taskstatus();
            $taskstatus->setCalendar(new Calendar());
        }
        else {
            $testobj = Doctrine::getTable('Calendar')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $taskstatus->getCalendar()->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('calendar.field.label', 'calendar.field.name', $request->getParameter('name'))
                        )));
        }

        $taskstatus->getCalendar()->setName($request->getParameter('name'));
        $taskstatus->getCalendar()->setCode($ak);
        $taskstatus->getCalendar()->setComment($request->getParameter('comment'));
        $taskstatus->getCalendar()->setColor(rand(1, 33));

        $taskstatus->setCustomcolor($request->getParameter('customcolor'));

        $taskstatus->setIscomplete($request->getParameter('iscomplete') && $request->getParameter('iscomplete') == 'on');
        $taskstatus->setIssuspended($request->getParameter('issuspended') && $request->getParameter('issuspended') == 'on');

        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $taskstatus->setEntityid($request->getParameter('entityid'));
        else
            $taskstatus->setEntityid(null);

        $taskstatus->save();
        sfContext::getInstance()->getLogger()->alert('Salvado estado de tarea ' . $taskstatus->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        $q = Doctrine_Query::create()
                ->delete('TaskstatusRelation')
                ->addWhere('fromstatus_id = ?', $taskstatus->getId());
        $deleted = $q->execute();

        if ($request->getParameter('status') && $request->getParameter('status') != '') {
            $statues = explode(",", $request->getParameter('status'));
            foreach ($statues as $status) {
                $relation = new TaskstatusRelation();
                $relation->setFromstatusId($taskstatus->getId());
                $relation->setTostatusId($status);
                $relation->save();
            }
        }

        return $taskstatus->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Taskstatus')->deleteByPK($pks);
    }

}

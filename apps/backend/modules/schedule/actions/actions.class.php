<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage schedule
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class scheduleActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        
        $m = ModuleTable::getInstance()->getMultientityManager();
        $filter = $this->getFilter($request, $m && $m->getIsActive());

        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = ScheduleTable::getInstance()->getAll($filter);
                break;

            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
                $rows = ScheduleTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $schedule = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('entityid'));

        if ($request->getParameter('id') != '')
            $schedule = Doctrine::getTable('Schedule')->find($request->getParameter('id'));

        if ($schedule == array()) {
            $schedule = Doctrine::getTable('Schedule')->findByAK($ak);
            if ($schedule)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('schedule.field.label', 'schedule.field.name', $request->getParameter('name'))
                        )));
            $schedule = new Schedule();
        }
        else {
            $testobj = Doctrine::getTable('Schedule')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $schedule->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('schedule.field.label', 'schedule.field.name', $request->getParameter('name'))
                        )));
        }

        $schedule->setCode($ak);
        $schedule->setName($request->getParameter('name'));

        if ($request->getParameter('is_active') && $request->getParameter('is_active') == 'on') {
            $schedule->setIsActive(1);
            $actives = Doctrine::getTable('Schedule')->getActiveSchedule($request->getParameter('entityid'));
            foreach ($actives as $active)
                if ($active && $active->getId() > 0 && $schedule->getId() != $active->getId()) {
                    $active->setIsActive(0);
                    $active->save();
                }
        } else
            $schedule->setIsActive(0);

        $schedule->setSesions($request->getParameter('sesions'));
        $schedule->setExceptions($request->getParameter('exceptions'));

        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $schedule->setEntityid($request->getParameter('entityid'));
        else
            $schedule->setEntityid(null);

        $schedule->save();
        sfContext::getInstance()->getLogger()->alert('Salvado horario ' . $schedule->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $schedule->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Schedule')->deleteByPK($pks);
    }

}

<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage period
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class periodActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {

            case 'combo':
                $rows = PeriodTable::getInstance()->getAll($filter);
                break;

            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                $rows = PeriodTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $period = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $period = Doctrine::getTable('Period')->find($request->getParameter('id'));

        if ($period == array()) {
            $period = Doctrine::getTable('Period')->findByAK($ak);
            if ($period)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('period.field.label', 'period.field.name', $request->getParameter('name'))
                        )));
            $period = new Period();
        }
        else {
            $testobj = Doctrine::getTable('Period')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $period->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('period.field.label', 'period.field.name', $request->getParameter('name'))
                        )));
        }

        $period->setCode($ak);
        $period->setName($request->getParameter('name'));
        $period->setComment($request->getParameter('comment'));


        $period->save();
        sfContext::getInstance()->getLogger()->alert('Salvado periodo ' . $period->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $period->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Period')->deleteByPK($pks);
    }

}

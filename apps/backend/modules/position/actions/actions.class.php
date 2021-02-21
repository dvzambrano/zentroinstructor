<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage position
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class positionActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {

            case 'combo':
                $rows = PositionTable::getInstance()->getAll($filter);
                break;

            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                $rows = PositionTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $position = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('entityid'));

        if ($request->getParameter('id') != '')
            $position = Doctrine::getTable('Position')->find($request->getParameter('id'));

        if ($position == array()) {
            $position = Doctrine::getTable('Position')->findByAK($ak);
            if ($position)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('position.field.label', 'position.field.name', $request->getParameter('name'))
                        )));
            $position = new Position();
        }
        else {
            $testobj = Doctrine::getTable('Position')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $position->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('position.field.label', 'position.field.name', $request->getParameter('name'))
                        )));
        }

        $position->setCode($ak);
        $position->setName($request->getParameter('name'));
        $position->setComment($request->getParameter('comment'));
        $position->setEntityid($request->getParameter('entityid'));

        $position->save();
        sfContext::getInstance()->getLogger()->alert('Salvado cargo ' . $position->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $position->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Position')->deleteByPK($pks);
    }

}

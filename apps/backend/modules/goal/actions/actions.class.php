<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage goal
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class goalActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = GoalTable::getInstance()->getAll($filter);
                break;

            case 'tree':
                // hago la validacion para cuando se esta buscando un padre escribiendo y no seleccionando
                if (!$request->getParameter('query') || $request->getParameter('query') == '') {
                    $obj = new stdClass();
                    $obj->type = "int";
                    $obj->field = "parentid";
                    if ($request->getParameter('node') == '' || $request->getParameter('node') == 'NULL')
                        $obj->comparison = "null";
                    else {
                        $obj->comparison = "eq";
                        $obj->value = $request->getParameter('node');
                    }
                    $filter[] = $obj;
                }
                $rows = GoalTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $goal = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('parent_id'));

        if ($request->getParameter('id') != '')
            $goal = Doctrine::getTable('Goal')->find($request->getParameter('id'));

        if ($goal == array()) {
            $goal = Doctrine::getTable('Goal')->findByAK($ak);
            if ($goal)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('goal.field.label', 'goal.field.name', $request->getParameter('name'))
                        )));
            $goal = new Goal();
        }
        else {
            $testobj = Doctrine::getTable('Goal')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $goal->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('goal.field.label', 'goal.field.name', $request->getParameter('name'))
                        )));
        }

        $goal->setCode($ak);
        $goal->setName($request->getParameter('name'));
        $goal->setComment($request->getParameter('comment'));

        if ($request->getParameter('period_id') != '')
            $goal->setPeriodid($request->getParameter('period_id'));
        else
            $goal->setPeriodid(null);


        if ($request->getParameter('parent_id') && $request->getParameter('parent_id') != '')
            $goal->setParentid($request->getParameter('parent_id'));
        else
            $goal->setParentid(null);

        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $goal->setEntityid($request->getParameter('entityid'));
        else
            $goal->setEntityid(null);

        $goal->save();
        sfContext::getInstance()->getLogger()->alert('Salvado  objetivo de trabajo ' . $goal->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        if ($request->getParameter('path') && $request->getParameter('path') != '') {
            $goal->setPath($request->getParameter('path') . '/' . $goal->getId());
            $goal->save();
        }

        return $goal->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Goal')->deleteByPK($pks);
    }

}

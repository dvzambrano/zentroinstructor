<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage tasktype
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class tasktypeActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = TasktypeTable::getInstance()->getAll($filter);
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
                $rows = TasktypeTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $tasktype = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('parent_id'));

        if ($request->getParameter('id') != '')
            $tasktype = Doctrine::getTable('Tasktype')->find($request->getParameter('id'));

        if ($tasktype == array()) {
            $tasktype = Doctrine::getTable('Tasktype')->findByAK($ak);
            if ($tasktype)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('tasktype.field.label', 'tasktype.field.name', $request->getParameter('name'))
                        )));
            $tasktype = new Tasktype();
        }
        else {
            $testobj = Doctrine::getTable('Tasktype')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $tasktype->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('tasktype.field.label', 'tasktype.field.name', $request->getParameter('name'))
                        )));
        }

        $tasktype->setCode($ak);
        $tasktype->setName($request->getParameter('name'));
        $tasktype->setComment($request->getParameter('comment'));


        if ($request->getParameter('parent_id') && $request->getParameter('parent_id') != '')
            $tasktype->setParentid($request->getParameter('parent_id'));
        else
            $tasktype->setParentid(null);


        $tasktype->save();
        sfContext::getInstance()->getLogger()->alert('Salvado tipo de tarea ' . $tasktype->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        if ($request->getParameter('path') && $request->getParameter('path') != '') {
            $tasktype->setPath($request->getParameter('path') . '/' . $tasktype->getId());
            $tasktype->save();
        }

        return $tasktype->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Tasktype')->deleteByPK($pks);
    }

}

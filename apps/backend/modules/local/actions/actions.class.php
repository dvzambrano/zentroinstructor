<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage local
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class localActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = LocalTable::getInstance()->getAll($filter);
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
                $rows = LocalTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $local = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('parent_id'));

        if ($request->getParameter('id') != '')
            $local = Doctrine::getTable('Local')->find($request->getParameter('id'));

        if ($local == array()) {
            $local = Doctrine::getTable('Local')->findByAK($ak);
            if ($local)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('local.field.label', 'local.field.name', $request->getParameter('name'))
                        )));
            $local = new Local();
        }
        else {
            $testobj = Doctrine::getTable('Local')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $local->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('local.field.label', 'local.field.name', $request->getParameter('name'))
                        )));
        }

        $local->setCode($ak);
        $local->setName($request->getParameter('name'));
        $local->setComment($request->getParameter('comment'));


        if ($request->getParameter('parent_id') && $request->getParameter('parent_id') != '')
            $local->setParentid($request->getParameter('parent_id'));
        else
            $local->setParentid(null);
        
        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $local->setEntityid($request->getParameter('entityid'));
        else
            $local->setEntityid(null);

        if ($request->getParameter('excluding') == 'on')
            $local->setIsExcluding(true);
        else
            $local->setIsExcluding(false);

        $local->save();
        sfContext::getInstance()->getLogger()->alert('Salvado local ' . $local->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        if ($request->getParameter('path') && $request->getParameter('path') != '') {
            $local->setPath($request->getParameter('path') . '/' . $local->getId());
            $local->save();
        }

        return $local->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Local')->deleteByPK($pks);
    }

}

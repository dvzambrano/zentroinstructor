<?php

/**
 * title actions.
 *
 * @package    SGArqBase
 * @subpackage resource
 * @author     Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class resourceActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        if ($request->getParameter('query'))
            $query->query = $request->getParameter('query');
        if ($request->getParameter('is_active'))
            $query->is_active = $request->getParameter('is_active');

        switch ($request->getParameter('component')) {
            
            case 'combo':
                $rows = ResourceTable::getInstance()->getAll($query->query);
                break;
            
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
                $filter = json_decode(stripslashes($request->getParameter('filter')));

                if ($request->getParameter('entityid') && $request->getParameter('entityid')!=''){
                    $obj = new stdClass();
                    $obj->type = "int";
                    $obj->field = "entityid";
                    $obj->comparison = "eq";
                    $obj->value = $request->getParameter('entityid');
                    $filter[] = $obj;
                }

                $rows = ResourceTable::getInstance()->getAllPaged($start, $limit, $query, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $resource = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $resource = Doctrine::getTable('Resource')->find($request->getParameter('id'));

        if ($resource == array()) {
            $resource = Doctrine::getTable('Resource')->findByAK($ak);
            if ($resource)
                throw new Exception('app.error.duplicatedalternatekey');
            $resource = new Resource();
        }
        
                $resource->setCode($request->getParameter('code'));
        $resource->setName($request->getParameter('name'));
        $resource->setRate($request->getParameter('rate'));
        $resource->setExtrarate($request->getParameter('extrarate'));
        $resource->setComment($request->getParameter('comment'));

        
        $resource->setName($request->getParameter('name'));
        $resource->setCode($ak);

        $resource->save();
        sfContext::getInstance()->getLogger()->alert('Salvado recurso ' . $resource->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Resource')->deleteByPK($pks);
    }

}

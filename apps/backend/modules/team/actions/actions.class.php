<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage team
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class teamActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = TeamTable::getInstance()->getAll($filter);
                break;

            case 'tree':
//                 hago la validacion para cuando se esta buscando un padre escribiendo y no seleccionando
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
                $rows = TeamTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $team = array();
        $ak = Util::generateCode($request->getParameter('name') . $request->getParameter('parent_id'));

        if ($request->getParameter('id') != '')
            $team = Doctrine::getTable('Team')->find($request->getParameter('id'));

        if ($team == array()) {
            $team = Doctrine::getTable('Team')->findByAK($ak);
            if ($team)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('team.field.label', 'team.field.name', $request->getParameter('name'))
                        )));
            $team = new Team();
        }
        else {
            $testobj = Doctrine::getTable('Team')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $team->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('team.field.label', 'team.field.name', $request->getParameter('name'))
                        )));
        }

        $team->setCode($ak);
        $team->setName($request->getParameter('name'));
        $team->setComment($request->getParameter('comment'));

        if ($request->getParameter('responsible_id') && $request->getParameter('responsible_id') != '')
            $team->setResponsibleid($request->getParameter('responsible_id'));
        else
            $team->setResponsibleid(null);

        if ($request->getParameter('parent_id') && $request->getParameter('parent_id') != '')
            $team->setParentid($request->getParameter('parent_id'));
        else
            $team->setParentid(null);
        
        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '')
            $team->setEntityid($request->getParameter('entityid'));
        else
            $team->setEntityid(null);

        $team->save();
        sfContext::getInstance()->getLogger()->alert('Salvado grupo de trabajo ' . $team->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        if ($request->getParameter('persons') && $request->getParameter('persons') != '')
            $personids = json_decode(stripslashes($request->getParameter('persons')));
        else
            $personids = false;

        $teampersons = $team->getTeamPersonRelation();

        if (!$isnew)
            self::removePersonal($teampersons, $personids);

        if ($personids) {
            if (count($teampersons) == 0) {
                foreach ($personids as $id) {
                    $teamperson = new TeamPersonRelation();
                    $teamperson->setTeamid($team->getId());
                    $teamperson->setPersonid($id);

                    $teamperson->save();
                }
            } else {
                foreach ($personids as $personid) {
                    $exist = false;
                    foreach ($teampersons as $teamperson)
                        if ($personid == $teamperson->getPersonid())
                            $exist = true;

                    if (!$exist) {
                        $teamperson = new TeamPersonRelation();
                        $teamperson->setTeamid($team->getId());
                        $teamperson->setPersonid($personid);

                        $teamperson->save();
                    }
                }
            }
        }
        if ($request->getParameter('path') && $request->getParameter('path') != '') {
            $team->setPath($request->getParameter('path') . '/' . $team->getId());
            $team->save();
        }

        return $team->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Team')->deleteByPK($pks);
    }

    private function removePersonal($teampersons, $personids) {
        if (count($personids) == 0)
            foreach ($teampersons as $teamperson)
                $teamperson->delete();
        else
            foreach ($teampersons as $teamperson) {
                $exist = false;
                foreach ($personids as $personid)
                    if ($teamperson->getPersonid() == $personid)
                        $exist = true;

                if (!$exist)
                    $teamperson->delete();
            }
    }

}

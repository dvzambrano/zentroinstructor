<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage person
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class personActions extends sfPersonActions {

    public function executeRequest(sfWebRequest $request) {
        $response = array();

        try {
            switch ($request->getParameter('method')) {
                case 'isbossof':
                    $person1 = Doctrine::getTable('Person')->find($request->getParameter('id1'));
//                    $person2 = Doctrine::getTable('Person')->find($request->getParameter('id2'));
//                    if ($person1->isBossOf($person2))
//                        echo $person1->getSfGuardUser()->getFirstName() . ' es jefe de ' . $person2->getSfGuardUser()->getFirstName();
//                    else
//                        echo $person1->getSfGuardUser()->getFirstName() . ' NO es jefe de ' . $person2->getSfGuardUser()->getFirstName();

                    $q = Doctrine::getTable('Person')->getAllLeadedQuery($person1);
                    print_r($q->execute()->toArray());
                    break;
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
                if ($request->getParameter('teamid') && $request->getParameter('teamid') != '') {
                    $obj = new stdClass();
                    $obj->type = "int";
                    $obj->field = "teamid";
                    $obj->comparison = "eq";
                    $obj->value = $request->getParameter('teamid');
                    $filter[] = $obj;
                }
                $rows = PersonTable::getInstance()->getAll($filter);
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
                $rows = PersonTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            case 'personsbyteam':
                $rows = PersonTable::getInstance()->getAllPersonsByTeam($request->getParameter('teamid'), $request->getParameter('plan'));
                break;

            case 'personsbyplan':
                $rows = PersonTable::getInstance()->getAllPersonsByPlan($request->getParameter('planid'));
                break;

            case 'noResponsibles':
                $rows = PersonTable::getInstance()->getAllNoResponsibles($query->query);
                break;

            default:
				return parent::executeRequest($request);
                break;
        }

        return $rows;
    }


}

<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construccion de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage calendar
 * @author     MSc. Donel Vazquez Zambrano
 * @version    1.0.0
 */
class calendarActions extends sfCalendarActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        $filter = $this->getFilter($request);

        try {
            switch ($request->getParameter('method')) {
                case 'load':
                    switch ($request->getParameter('component')) {
                        case 'event':
                            $response['evts'] = array();
                            
                            /*
                            // esta es la variante correcta pero como se cambio q las tareas padres -> ya salen en el plan puesto q son las principales del responsable hay q quitar la restriccion de ->
                            // to hide serial base tasks
                            $obj = new stdClass();
                            $obj->type = "string";
                            $obj->field = "code";
                            $obj->comparison = "notlike";
                            $obj->value = '->';
                            $filter[] = $obj;
                            */

                            if ($request->getParameter('personid') && $request->getParameter('personid') != 'false') {
                                $obj = new stdClass();
                                $obj->type = "int";
                                $obj->field = "responsibleid";
                                $obj->comparison = "eq";
                                $obj->value = $request->getParameter('personid');
                                $filter[] = $obj;
                            }

                            if ($request->getParameter('start') && $request->getParameter('start') != '') {
                                $obj = new stdClass();
                                $obj->type = "date";
                                $obj->field = "start";
                                $obj->comparison = "get";
                                $obj->value = $request->getParameter('start');
                                $filter[] = $obj;
                            }

                            if ($request->getParameter('end') && $request->getParameter('end') != '') {
                                $obj = new stdClass();
                                $obj->type = "date";
                                $obj->field = "start";
                                $obj->comparison = "let";
                                $obj->value = $request->getParameter('end');
                                $filter[] = $obj;
                            }

                            $rows = EventTable::getInstance()->getAll($filter);

                            $response['evts'] = array();
                            foreach ($rows['data'] as $value) {
                                $response['evts'][] = $value;
                                $response['evts'][count($response['evts']) - 1]['cid'] = $value['calendarid'];
                                $response['evts'][count($response['evts']) - 1]['title'] = $value['name'];
                                $response['evts'][count($response['evts']) - 1]['ad'] = $value['allday'];
                                $response['evts'][count($response['evts']) - 1]['notes'] = $value['comment'];
                                $response['evts'][count($response['evts']) - 1]['loc'] = $value['location'];
                                $response['evts'][count($response['evts']) - 1]['url'] = $value['link'];
                                $response['evts'][count($response['evts']) - 1]['rem'] = $value['reminderid'];
                                $response['evts'][count($response['evts']) - 1]['rec'] = $value['Task']['serialid'];
                            }
                            break;
                        default:
                            return parent::executeRequest($request);
                            break;
                    }
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

    
}

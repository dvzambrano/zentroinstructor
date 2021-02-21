<?php

require_once(dirname(__FILE__) . '/../config/ProjectConfiguration.class.php');

$configuration = ProjectConfiguration::getApplicationConfiguration('backend', 'dev', true);
$context = sfContext::createInstance($configuration);

$databaseManager = new sfDatabaseManager($configuration);
$databaseManager->loadConfiguration();


$appname = Util::getMetadataValue('app_name');
$emailstrategy = Util::getMetadataValue('app_mailstrategy');
$headershadow = Util::getMetadataValue('app_headershadow');

$currentdate = date_create_from_format('Y-m-d H:i:s', date('Y-m-d H:i:s'));

echo "===================================================================";
echo "\n";
echo $appname . ':  Ejecutando tarea "SEND NOTIFICATION", esto puede tardar unos segundos...';
echo "\n";
echo "===================================================================";

// STEP 1) Check if today is anual plan approval date
$array = Util::getMetadataValue('app_dateanualplan');
$array = explode('/', $array);
if ($currentdate->format('d') == $array[0] && $currentdate->format('m') == $array[1]) {// today is the day to next year plan approval 
    if ($currentdate->format('H') == '09' && $currentdate->format('i') == '00') { // and its time!
        $entities = Doctrine::getTable('Entity')->getAll(array(), true);
        foreach ($entities as $entity) {
            if ($entity->getEmailAddress() && $entity->getEmailAddress() != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $entity->getEmailAddress(),
                            'subject' => array(
                                'msg' => 'entity.action.yearlyapprobalnotify.mailsubject',
                                'params' => array($entity->getName())
                            ),
                            'partial' => 'mail/YearPlanApprovalSuccess',
                            'params' => array(
                                'entity' => $entity->getName(),
                                'date' => date('d/m/Y'),
                                'nextyear' => date('Y') + 1
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }
        }
        $group = Doctrine::getTable('sfGuardGroup')->findByAK('advanced');
        foreach ($group->getUsers() as $user) {
            if ($user->getEmailAddress() && $user->getEmailAddress() != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $user->getEmailAddress(),
                            'subject' => array(
                                'msg' => 'entity.action.yearlyapprobalnotify.mailsubject',
                                'params' => array($group->getDescription())
                            ),
                            'partial' => 'mail/YearPlanApprovalSuccess',
                            'params' => array(
                                'entity' => '',
                                'date' => date('d/m/Y'),
                                'nextyear' => date('Y') + 1
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }
        }
    }
}

// STEP 2) Check if today is month plan approval date
$monthlyplan = Util::getMetadataValue('app_datemonthlyplan');
if ($currentdate->format('d') == $monthlyplan) {// today is the day to next month plan approval 
    if ($currentdate->format('H') == '09' && $currentdate->format('i') == '00') { // and its time!
        $entities = Doctrine::getTable('Entity')->getAll(array(), true);
        foreach ($entities as $entity) {
            if ($entity->getEmailAddress() && $entity->getEmailAddress() != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $entity->getEmailAddress(),
                            'subject' => array(
                                'msg' => 'entity.action.monthlyapprobalnotify.mailsubject',
                                'params' => array($entity->getName())
                            ),
                            'partial' => 'mail/MonthPlanApprovalSuccess',
                            'params' => array(
                                'entity' => $entity->getName(),
                                'date' => date('d/m/Y'),
                                'nextmonth' => Util::getMonthName(date('m') + 1) . '/' . date('Y')
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }
        }
        $group = Doctrine::getTable('sfGuardGroup')->findByAK('advanced');
        foreach ($group->getUsers() as $user) {
            if ($user->getEmailAddress() && $user->getEmailAddress() != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $user->getEmailAddress(),
                            'subject' => array(
                                'msg' => 'entity.action.monthlyapprobalnotify.mailsubject',
                                'params' => array($group->getDescription())
                            ),
                            'partial' => 'mail/MonthPlanApprovalSuccess',
                            'params' => array(
                                'entity' => '',
                                'date' => date('d/m/Y'),
                                'nextmonth' => Util::getMonthName(date('m') + 1) . '/' . date('Y')
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }
        }
        $teams = Doctrine::getTable('Team')->getAll(array(), true);
        foreach ($teams as $team) {
            if ($team->getResponsible() && $team->getResponsible()->getSfGuardUser() && $team->getResponsible()->getSfGuardUser()->getEmailAddress() && $team->getResponsible()->getSfGuardUser()->getEmailAddress() != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $team->getResponsible()->getSfGuardUser()->getEmailAddress(),
                            'subject' => array(
                                'msg' => 'entity.action.monthlyapprobalnotify.mailsubject',
                                'params' => array($team->getName())
                            ),
                            'partial' => 'mail/MonthPlanApprovalSuccess',
                            'params' => array(
                                'entity' => $team->getName(),
                                'date' => date('d/m/Y'),
                                'nextmonth' => Util::getMonthName(date('m') + 1) . '/' . date('Y')
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }
        }
    }
}

// STEP 3) Check for reminders
$rows = TaskTable::getInstance()->getSummary();
foreach ($rows['data'] as $summary)
    if ($summary['name'] == 'task.reminder.title') {
        $reponsibles = array();
        foreach ($summary['data'] as $task) {
            if (!isset($reponsibles[$task['responsibleid']]))
                $reponsibles[$task['responsibleid']] = array(
                    'tasks' => '',
                    'email' => $task['Person']['sfGuardUser']['email_address'],
                    'fullname' => $task['Person']['sfGuardUser']['first_name'] . ' ' . $task['Person']['sfGuardUser']['last_name']
                );

            $bd = date_create_from_format('Y-m-d H:i:s', $task['Event']['start']);
            $ed = date_create_from_format('Y-m-d H:i:s', $task['Event']['end']);

            $reponsibles[$task['responsibleid']]['tasks'].= '<table>
                    <tr><td style="font-size:11px; text-align: right;">T&Iacute;TULO:</td><td>&nbsp;&nbsp;' . $task['Event']['name'] . '</td></tr>
                    <tr><td style="font-size:11px; text-align: right;">TIPO:</td><td>&nbsp;&nbsp;' . $task['Tasktype']['name'] . '</td></tr>
                    <tr><td style="font-size:11px; text-align: right;">LUGAR:</td><td>&nbsp;&nbsp;' . $task['Local']['name'] . '</td></tr>
                    <tr><td style="font-size:11px; text-align: right;">ESTADO:</td><td>&nbsp;&nbsp;' . $task['Taskstatus']['Calendar']['name'] . '</td></tr>
                    <tr><td style="font-size:11px; text-align: right;">INICIO:</td><td>&nbsp;&nbsp;' . $bd->format('d/m/Y g:i A') . '</td></tr>
                    <tr><td style="font-size:11px; text-align: right;">FINALIZACI&Oacute;N:</td><td>&nbsp;&nbsp;' . $ed->format('d/m/Y g:i A') . '</td></tr>
                </table><br/><br/>';
        }

        foreach ($reponsibles as $reponsible)
            if ($reponsible['email'] && $reponsible['email'] != '') {
                $mail = new Mailqueue();
                $mail->setValue(json_encode(array(
                            'sendto' => $reponsible['email'],
                            'subject' => array(
                                'msg' => 'task.action.creationnotify.mailsubject',
                                'params' => array(Util::getBundle('task.field.label'))
                            ),
                            'partial' => 'mail/ReminderTaskSuccess',
                            'params' => array(
                                'fullname' => $reponsible['fullname'],
                                'tasks' => $reponsible['tasks']
                            )
                        )));
                $mail->setName(Util::generateCode($mail->getValue() . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX) . rand(1, PHP_INT_MAX)));
                $mail->save();
            }

        break;
    }

// STEP X) Sending mail queue
if (strtolower($emailstrategy) == 'queue') {
    $mails = Doctrine::getTable('Mailqueue')->getAll(array(), true);
    foreach ($mails as $mail) {
        $data = json_decode($mail->getValue(), true);

        $data['partial'] = explode('/', $data['partial']);

        $data['params']['appname'] = $appname;
        $data['params']['app_headershadow'] = $headershadow;
        $data['params']['companyemail'] = $data['sendto'];

        $data['subject']['msg'] = Util::getBundle($data['subject']['msg']);
        foreach ($data['subject']['params'] as $key => $value)
            $data['subject']['msg'] = str_ireplace('{' . $key . '}', $value, $data['subject']['msg']);

        try {
            Util::sendEmail($context->getMailer(), $data['sendto'], $data['subject']['msg'], Util::getTemplateContent($data['params'], '/apps/backend/modules/' . $data['partial'][0] . '/templates/_' . $data['partial'][1] . '.php'));
            $mail->delete();
        } catch (Exception $exc) {
            echo "\n";
            echo "-------------------------------------------------------------------";
            echo "ERROR:\n";
            echo "-------------------------------------------------------------------";
            echo "\n";
            echo $exc->getMessage();
            echo "\n";
            echo $exc->getTraceAsString();
        }
    }
}

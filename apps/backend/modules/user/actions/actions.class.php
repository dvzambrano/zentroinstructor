<?php

/**
 * title actions.
 *
 * @package    SGARQBASE
 * @subpackage user
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class userActions extends sfUserActions {
	
    public function save(sfWebRequest $request) {
        $user = array();
        $isnew = false;

        $emailalloewd = Util::getMetadataValue('app_sendsystememails');
        $mailline = array();

        if ($request->getParameter('app') && $request->getParameter('app') == 'frontend')
            $request = $this->prepareRequest($request);

        if ($request->getParameter('id') != '')
            $user = Doctrine::getTable('sfGuardUser')->find($request->getParameter('id'));

        if ($user == array()) {
            $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')->where('u.username = ?', $request->getParameter('username'));
            $user = $q->fetchOne();
            if ($user)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                        )));

            if ($request->getParameter('email_address') && $request->getParameter('email_address') != '') {
                $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')->where('u.email_address = ?', $request->getParameter('email_address'));
                $user = $q->fetchOne();
                if ($user)
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'app.form.email', $request->getParameter('email_address'))
                            )));
            }

            $user = new sfGuardUser();
            $user->setPerson(new Person());
            $user->getPerson()->setCode(Util::generateCode($request->getParameter('username')));

            $isnew = true;
        }
        else {
            $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                    ->where('u.username = ?', array($request->getParameter('username')));
            $testuser = $q->fetchOne();
            if ($testuser) {
                if ($request->getParameter('id') == '' || $testuser->getUsername() != $user->getUsername())
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                            )));
            }
        }

        $user->setFirstName($request->getParameter('first_name'));
        $user->setLastName($request->getParameter('last_name'));
        $user->setEmailAddress($request->getParameter('email_address'));
        if ($request->getParameter('username') && $request->getParameter('username') != '')
            $user->setUsername($request->getParameter('username'));
        if ($request->getParameter('password') && $request->getParameter('password') != '')
            $user->setPassword($request->getParameter('password'));
        if ($request->getParameter('is_active') == 'true' || $request->getParameter('is_active') == '1')
            $user->setIsActive(true);
        else
            $user->setIsActive(false);

        if ($request->getParameter('position_id') && $request->getParameter('position_id') != '')
            $user->getPerson()->setPositionid($request->getParameter('position_id'));
        else
            $user->getPerson()->setPositionid(null);

        if ($request->getParameter('app') != 'frontend') {
            $pks = explode(",", $request->getParameter('groups'));
            $user->unlink('Groups');
            $user->link('Groups', $pks);

            $pks = explode(",", $request->getParameter('permissions'));
            $user->unlink('Permissions');
            $user->link('Permissions', $pks);
        }

        $user->save();
        if ($this->getUser()->isAuthenticated())
            sfContext::getInstance()->getLogger()->alert('Salvado usuario ' . $user->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
		
		if ($request->getParameter('app') != 'frontend') {
			$q = Doctrine_Query::create()
					->delete('EntityUserRelation')
					->addWhere('sf_guard_user_id = ?', $user->getId());
			if ($request->getParameter('app') == 'frontend' && $request->getParameter('entities') && $request->getParameter('entities') != '') {
				$entities = explode(",", $request->getParameter('entities'));
				$q = $q->addWhere('entity_id IN (' . implode(',', $entities) . ')');
			}
			$deleted = $q->execute();

			if ($request->getParameter('entities') && $request->getParameter('entities') != '') {
				$entities = explode(",", $request->getParameter('entities'));
				foreach ($entities as $entityid) {
					$entity = new EntityUserRelation();
					$entity->setEntityId($entityid);
					$entity->setSfGuardUserId($user->getId());
					$entity->save();
				}
			}
        }

        if ($emailalloewd) {
            if ($isnew) {
                $mailline[] = array(
                    'sendto' => $user->getEmailAddress(),
                    'subject' => array(
                        'msg' => 'user.action.registrationconfirm.mailsubject',
                        'params' => array(Util::getMetadataValue('app_name'))
                    ),
                    'partial' => 'mail/NewUserSuccess',
                    'params' => array(
                        'fullname' => $user->getPerson()->getFullName(),
                        'username' => $user->getUsername(),
                        'password' => $request->getParameter('password')
                    )
                );
                $mailline[] = array(
                    'sendto' => Util::getMetadataValue('app_businessmail'),
                    'subject' => array(
                        'msg' => 'user.action.registrationnotify.mailsubject',
                        'params' => array(Util::getMetadataValue('app_name'))
                    ),
                    'partial' => 'mail/NewUserNotificationSuccess',
                    'params' => array(
                        'fullname' => $user->getPerson()->getFullName(),
                        'username' => $user->getUsername(),
                        'password' => $request->getParameter('password')
                    )
                );
            }
        }

        $user = $user->toArray();
        if ($mailline && count($mailline) > 0)
            $user['mailline'] = json_encode($mailline);

        return $user;
    }
	
}

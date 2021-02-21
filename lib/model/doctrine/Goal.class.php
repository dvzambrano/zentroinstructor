<?php

/**
 * Goal
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    SGArqBase
 * @subpackage model
 * @author     Donel Vazquez Zambrano
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class Goal extends BaseGoal {

    public function isUsed() {
        if ($this->getPlans()->count() > 0)
            return true;

        return false;
    }

    public function getAsArray() {
        $result = $this->toArray();
        if ($this->getGoal() && $this->getGoal()->getId() > 0)
            $result['Goal'] = $this->getGoal()->getAsArray();
        return $result;
    }

}
<?php

/**
 * Taskstatus
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    SGArqBase
 * @subpackage model
 * @author     Donel Vazquez Zambrano
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class Taskstatus extends BaseTaskstatus {

    public function isPrimary() {
        $q = Doctrine_Query::create()
                ->select('cbr.*')
                ->from('TaskstatusRelation cbr')
                ->where('cbr.tostatus_id = ?', $this->getId());
        if ($q->execute()->count() == 0)
            return true;
        return false;
    }

    public function isFinal() {
        if ($this->getTaskStatues()->count() == 0)
            return true;
        return false;
    }

    public function isUsed() {
        if ($this->getTasks()->count() > 0)
            return true;
        return false;
    }

    public function getAsArray() {
        $array = $this->toArray();
        $array['Calendar'] = $this->getCalendar()->toArray();

        return $array;
    }

    public function getPercent() {
        $prestatues = Util::getArrayOrdered($this, array(), 'preorder', 'getTaskstatus');
        $prev = count($prestatues)-1;
        
        $poststatues = Util::getArrayOrdered($this, array(), 'preorder', 'getTaskStatues');
        $post = 0;
        foreach ($poststatues as $status) {
            $post++;
            if ($status['iscomplete'])
                break;
        }
		
		// validating divition by 0
		if($prev+$post-1==0)
			return 0;
        
        return $prev/($prev+$post-1)*100;
    }

}
<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 7pt">
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:20%;text-align:center" valign="middle" ></td>
                <td style="width:60%;text-align:center;font-size:16px;" valign="middle" >
                    <b>Modelo No. 3</b>
                </td>
                <td style="width:20%;text-align:center;font-size:10px;" valign="middle" ></td>
            </tr>
        </table>
        <?php if (strtolower($approvalperson) != strtolower($user)): ?>
            <table class="cleantable" width="100%" height="10%" border="0">
                <tr>
                    <td style="width:40%;text-align:center;">
                        <table class="sa_signature_box">
                            <tr>    
                                <td style="padding-left: 1em;font-size: 7pt;">Aprobado por:</td>
                                <td class="written_field" style="padding-left: 2.5in; text-align: right;">X</td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0em">&nbsp;</td>
                                <td style="text-align: center; padding-top: 0em;font-size: 7pt;"><b><?php echo $approvalperson ?></b><br/><?php echo $approvalrange ?></td>
                            </tr>
                        </table>
                    </td>
                    <td style="width:40%;text-align:center;" valign="middle" ></td>
                </tr>
            </table>
        <?php endif ?>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:10%;text-align:center;"></td>
                <td style="width:80%;text-align:center;font-size:20px;" valign="middle" >
                    <b>PLAN DE TRABAJO INDIVIDUAL PARA EL MES DE</b>&nbsp;<span style="text-decoration: underline;"><?php echo $month ?></span>
                </td>
                <td style="width:10%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <hr/>
        <br /><br />
        <p style="font-size:12px;">
            <b>TAREAS PRINCIPALES</b><br /><br /><br />
        </p>
        <?php if (count($megatasks) == 0): ?>    
            <p style="font-size:12px;">No definidas para este plan</p>
        <?php endif ?>
        <ul>
            <?php foreach ($megatasks as $megatask): ?>
                <li style="font-size:12px;"><?php echo $megatask['name'] ?></li>
            <?php endforeach ?>
        </ul>
        <hr/>
        <?php foreach ($tasks as $week => $daytask): ?>
            <table class="change_order_items" border="1">
                <thead>
                    <tr class="even_row">
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Mon')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Lunes ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Tue')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Martes ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Wed')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Miércoles ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Thu')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Jueves ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Fri')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Viernes ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Sat')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Sábado ' . $daynumber;
                                ?>
                            </b></td>
                        <td  style="width: 14%; text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>
                                <?php
                                $daynumber = '';
                                foreach ($daytask as $day => $task)
                                    if ($day == 'Sun')
                                        $daynumber = $task['day'];
                                if ($daynumber != '')
                                    echo 'Domingo ' . $daynumber;
                                ?>
                            </b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="odd_row" style="vertical-align: top;">                
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Mon'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Tue'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Wed'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Thu'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Fri'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Sat'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                        <td>
                            <?php foreach ($daytask as $day => $task): ?>    
                                <?php if ($day == 'Sun'): ?> 
                                    <?php foreach ($task['tasks'] as $event): ?>    
                                        <?php echo $event['name'] ?><br/><br/>
                                    <?php endforeach ?>
                                <?php endif ?>
                            <?php endforeach ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        <?php endforeach ?>

        <table class="change_order_items" border="1">
            <tbody>
                <tr>
                    <td colspan="7" style="font-size: 7pt; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;">NOTA: Las tareas marcadas con asterisco (*) est&aacute;n planificadas fuera del horario "<?php echo $schedule ?>".</td>
                </tr>
            </tbody>
        </table>

        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:20%;text-align:center;" valign="middle" ></td>
                <td style="width:40%;">
                    <table class="sa_signature_box">
                        <tr>    
                            <td style="padding-left: 1em; font-size: 7pt;">Elaborado por:</td>
                            <td class="written_field" style="padding-left: 2.5in; text-align: right;">X</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 0em">&nbsp;</td>
                            <td style="text-align: center; padding-top: 0em; font-size: 7pt;"><b><?php echo $user ?></b><br/><?php echo $userrange ?></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</div>
<div style="width:100%;" name="footer" id="footer">
    <div id="footer">                                                            
        <table>                                                                
            <tbody>
                <tr>
                    <td width="80%">
                        <div style="font-size: 8px;">
                            Este modelo ha sido generado por <?php echo $user ?> utilizando el software '<?php echo htmlspecialchars_decode($appname) ?>'.
                        </div>
                    </td>     
                    <td width="20%" style="text-align: right;">
                        <div style="text-align: right;" class="page-number"></div>
                    </td>     
                </tr>       
            </tbody>
        </table>     
    </div>
</div>
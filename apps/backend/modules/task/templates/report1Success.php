<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content">
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:20%;text-align:center" valign="middle" ></td>
                <td style="width:60%;text-align:center;" valign="middle" >
                    <b>Modelo No. 1</b>
                </td>
                <td style="width:20%;text-align:center;font-size:10px;" valign="middle" >
                    &quot;Seg&uacute;n lista interna de clasificaci&oacute;n&quot;<br/><br/>
                    Ejemplar No.______________________
                </td>
            </tr>
        </table>
        <?php if (strtolower($approvalperson) != strtolower($user)): ?>
            <table class="cleantable" width="100%" height="10%" border="0">
                <tr>
                    <td style="width:40%;text-align:center;">
                        <table class="sa_signature_box">
                            <tr>    
                                <td style="padding-left: 1em;font-size: 10px;">Aprobado por:</td>
                                <td class="written_field" style="padding-left: 2.5in; text-align: right;">X</td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0em">&nbsp;</td>
                                <td style="text-align: center; padding-top: 0em;font-size: 10px;"><b><?php echo $approvalperson ?></b><br/><?php echo $approvalrange ?></td>
                            </tr>
                        </table>
                    </td>
                    <td style="width:40%;text-align:center;" valign="middle" ></td>
                </tr>
            </table>
        <?php endif ?>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:10%;text-align:center;"></td>
                <td style="width:80%;text-align:center;font-size:30px;" valign="middle" >
                    <b>OBJETIVOS DE TRABAJO Y PLAN DE ACTIVIDADES DE</b>&nbsp;<span style="text-decoration: underline;"><?php echo $entity ?></span><br /><br />
                    <b>A&Ntilde;O</b>&nbsp;<span style="text-decoration: underline;"><?php echo $year ?></span>
                </td>
                <td style="width:10%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:20%;text-align:center;" valign="middle" ></td>
                <td style="width:40%;">
                    <table class="sa_signature_box">
                        <tr>    
                            <td style="padding-left: 1em; font-size: 10px;">Elaborado por:</td>
                            <td class="written_field" style="padding-left: 2.5in; text-align: right;">X</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 0em">&nbsp;</td>
                            <td style="text-align: center; padding-top: 0em; font-size: 10px;"><b><?php echo $user ?></b><br/><?php echo $userrange ?></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <hr/>

        <br /><br />
        <p>
            <b>OBJETIVOS DE TRABAJO</b><br /><br /><br />
        </p>
        <?php if (count($objetives) == 0): ?>    
            <p>No definidos para este plan</p>
        <?php endif ?>
        <ul>
            <?php foreach ($objetives as $objetive): ?>
                <li><?php echo $objetive->getName() ?></li>
            <?php endforeach ?>
        </ul>
        <hr/>

        <table class="change_order_items" style="width: 100%" border="1">
            <thead>
                <tr class="even_row">
                    <td rowspan="2" style="width:2%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p><b>No.</b></p></td>
                    <td rowspan="2" style="width:15%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>ACTIVIDADES</b></p></td>
                    <td colspan="12" style="width:30%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Meses</b></p></td>
                    <td rowspan="2" style="width:8%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>DIRIGENTE</b></p></td>
                    <td rowspan="2" style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>PARTICIPANTES</b></p></td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Ene</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Feb</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Mar</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Abr</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>May</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Jun</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Jul</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Ago</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Sep</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Oct</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Nov</b></p></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><p align="center"><b>Dic</b></p></td>
                </tr>                
            </thead>
            <tbody>
                <?php if (count($tasks) < 1): ?>
                    <tr>
                        <td colspan="16">No existen actividades para el a&ntilde;o <?php echo $year ?>.</td>
                    </tr>
                <?php endif ?>
                <?php $type = array() ?>
                <?php foreach ($tasks as $task): ?>
                    <?php if (!in_array($task['type'], $type)): ?>    
                        <?php foreach (explode('|stringsplitter|', $task['type']) as $typepart): ?>
                            <?php if (!in_array($typepart, $type)): ?> 
                                <tr class="even_row">
                                    <td colspan="16" style="border: 0.9px solid black;"><p><b> <?php echo $typepart ?></b></p></td>
                                </tr>
                                <?php $type[] = $typepart ?>
                            <?php endif ?>
                        <?php endforeach ?>
                        <?php $type[] = $task['type'] ?>
                    <?php endif ?>

                    <tr class="odd_row">
                        <td valign="top"><p align="center"><?php echo $task['treeid']; ?></p></td>
                        <td valign="top" style="text-align: justify;"><p><?php echo $task['name'] ?></p></td>
                        <?php for ($i = 1; $i <= 12; $i++): ?>
                            <td valign="top"><p align="center">
                                    <?php echo str_replace(', ', '<br/>', $task['initialdates'][$i]) ?>
                                </p>
                            </td>
                        <?php endfor ?>

                        <td valign="top"><p align="center"><?php echo $task['responsible'] ?></p></td>
                        <td valign="top">
                            <p align="center">
                                <?php echo str_replace(', ', '<br/><br/>', $task['participants']) ?>
                            </p>
                        </td>
                    </tr>
                <?php endforeach ?>
                <tr class="even_row">
                    <td colspan="16" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"></td>
                </tr>
            </tbody>
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
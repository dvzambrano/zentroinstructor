<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 7pt">
        <br/><br/>
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
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:5%;"></td>
                <td style="width:90%;font-size:15px;" valign="middle" >
                    <b>PROPUESTA DE ACTIVIDADES QUE SE PUNTUALIZAN PARA </b>&nbsp;<span style="text-decoration: underline;"><?php echo $entity ?></span><br/>
                    <b>EN EL MES DE </b>&nbsp;<span style="text-decoration: underline;"><?php echo $month ?></span>
                </td>
                <td style="width:5%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/><br/>

        <table class="change_order_items" border="1">
            <thead>
                <tr>
                    <td style="text-align: center; width:2%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>No.</b></td>
                    <td style="width:40%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>ACTIVIDADES</b></td>
                    <td style="text-align: center; width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>Fecha y hora planificada</b></td>
                    <td style="text-align: center; width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>Fecha y hora puntualizada</b></td>
                    <td style="width:8%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>DIRIGENTE</b></td>
                    <td style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>PARTICIPANTES</b></td>
                </tr>
            </thead>
            <tbody>
                <?php if (count($tasks) < 1): ?>
                    <tr>
                        <td colspan="6">No existen actividades puntualizadas para el mes de <?php echo $month ?>.</td>
                    </tr>
                <?php endif ?>
                <?php $total = 0 ?>
                <?php $type = array() ?>
                <?php foreach ($tasks as $task): ?>
                    <?php if (!in_array($task['type'], $type)): ?>    
                        <?php foreach (explode('|stringsplitter|', $task['type']) as $typepart): ?>
                            <?php if (!in_array($typepart, $type)): ?> 
                                <tr class="even_row">
                                    <td colspan="6" style="border: 0.9px solid black;"><b> <?php echo $typepart ?></b></td>
                                </tr>
                                <?php $type[] = $typepart ?>
                            <?php endif ?>
                        <?php endforeach ?>
                        <?php $type[] = $task['type'] ?>
                    <?php endif ?>

                    <tr class="odd_row">
                        <td valign="top" style="text-align: center;"><?php $total++ ?><?php echo $total ?></td>
                        <td valign="top"><?php echo $task['name'] ?></td>
                        <td valign="top" style="text-align: center;">
                            <?php
                            for ($i = 1; $i <= 12; $i++)
                                echo str_replace(', ', '<br/>', $task['startorginal'][$i]);
                            ?>
                        </td>
                        <td valign="top" style="text-align: center;">
                            <?php
                            for ($i = 1; $i <= 12; $i++)
                                echo str_replace(', ', '<br/>', $task['initialdates'][$i]);
                            ?>
                        </td>
                        <td valign="top"><p align="center"><?php echo $task['responsible'] ?></td>
                        <td valign="top">
                            <?php echo str_replace(', ', '<br/>', $task['participants']) ?>
                        </td>
                    </tr>
                <?php endforeach ?>
            </tbody>
            <tr>
                <td colspan="6" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"></td>
            </tr>
        </table>

        <br/><br/>
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
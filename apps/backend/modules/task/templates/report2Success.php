<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 9px">
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:20%;text-align:center" valign="middle" ></td>
                <td style="width:60%;text-align:center;font-size:16px;" valign="middle" >
                    <b>Modelo No. 2</b>
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
                    <b>PLAN DE TRABAJO PARA EL MES DE</b>&nbsp;<span style="text-decoration: underline;"><?php echo $month ?></span>
                </td>
                <td style="width:10%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <hr/>
        <br /><br />
        <p style="font-size:12px;">
            <b>TAREAS PRINCIPALES</b><br /><br /><br />

            <?php if (count($megatasks) == 0): ?>    
            <p style="font-size:12px;">No definidas para este plan
            <?php endif ?>
        <ul>
            <?php foreach ($megatasks as $megatask): ?>
                <li style="font-size:12px;"><?php echo $megatask['name'] ?></li>
            <?php endforeach ?>
        </ul>
        <hr/>
        <div style="font-size: 7pt">
            <table class="change_order_items" border="1">
                <thead>
                    <tr>
                        <td style="width:2%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>No.</b></td>
                        <td style="width:25%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>ACTIVIDADES</b></td>
                        <td style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>FECHA Y HORA</b></td>
                        <td style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>LUGAR</b></td>
                        <td style="width:8%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>DIRIGENTE</b></td>
                        <td style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>PARTICIPANTES</b></td>
                        <td style="width:10%; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>OBSERVACIONES SOBRE EL CUMPLIMIENTO</b></td>
                    </tr>
                </thead>
                <tbody>
                    <?php if (count($tasks) < 1): ?>
                        <tr>
                            <td colspan="7">No existen actividades para el mes de <?php echo $month ?>.</td>
                        </tr>
                    <?php endif ?>
                    <?php $evenrow = false; ?>
                    <?php $total = 0 ?>
                    <?php foreach ($tasks as $task): ?>
                        <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                            <td valign="top"><p align="center"><?php $total++ ?><?php echo $total ?></td>
                            <td valign="top"><?php echo $task['name'] ?></td>                
                            <td>
                                <?php for ($i = 1; $i <= 12; $i++): ?>
                                    <p align="center">
                                        <?php echo str_replace(', ', '<br/>', $task['initialdates'][$i]) ?>

                                    <?php endfor ?>
                                <p align="center">
                                    <?php echo $task['time'] ?>

                            </td>
                            <td valign="top"><p align="center"><?php echo $task['local'] ?></td>
                            <td valign="top"><p align="center"><?php echo $task['responsible'] ?></td>
                            <td valign="top">
                                <p align="center">
                                    <?php echo str_replace(', ', '<br/>', $task['participants']) ?>

                            </td>
                            <td valign="top"></td>
                        </tr>
                        <?php $evenrow = !$evenrow; ?>
                    <?php endforeach ?>
                    <tr class="even_row">
                        <td colspan="7" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"></td>
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
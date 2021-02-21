<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 9px">
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:5%;"></td>
                <td style="width:90%;font-size:15px;" valign="middle" >
                    <b>RESUMEN DEL PLAN ANUAL DE ACTIVIDADES DE </b>&nbsp;<span style="text-decoration: underline;"><?php echo $entity ?></span><br/>
                    <b>PARA EL A&Ntilde;O</b>&nbsp;<span style="text-decoration: underline;"><?php echo $year ?></span>
                </td>
                <td style="width:5%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/>

        <table class="change_order_items" style="width: 100%" border="1">
            <tbody>
                <tr class="even_row">
                    <td colspan="7" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;"><b>ACTIVIDADES Y TAREAS DE ASEGURAMINETO PLANIFICADAS</b></td>
                </tr>
                <tr class="even_row">
                    <td rowspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">CAPITULOS</td>
                    <td colspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PROPIAS</td>
                    <td colspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">EXTERNAS <br/>(DE NIVEL SUPERIOR O IGUAL)</td>
                    <td colspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TOTAL</td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">ACTIVIDADES</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TAREAS DE ASEGURAMIENTO</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">ACTIVIDADES</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TAREAS DE ASEGURAMIENTO</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">ACTIVIDADES</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TAREAS DE ASEGURAMIENTO</td>
                </tr>
                <?php $totalactivityexternal = 0 ?>
                <?php $totalinsuranceexternal = 0 ?>
                <?php $totalactivityown = 0 ?>
                <?php $totalinsuranceown = 0 ?>
                <?php foreach ($tasktypes as $tasktype): ?>
                    <tr class="odd_row">
                        <td style="text-align: center;"><?php echo $tasktype['name'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['activityown'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['insuranceown'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['activityexternal'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['insuranceexternal'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['activityexternal'] + $tasktype['activityown'] ?></td>
                        <td style="text-align: center;"><?php echo $tasktype['insuranceexternal'] + $tasktype['insuranceown'] ?></td>
                    </tr>
                    <?php $totalactivityexternal += $tasktype['activityexternal'] ?>
                    <?php $totalinsuranceexternal += $tasktype['insuranceexternal'] ?>
                    <?php $totalactivityown += $tasktype['activityown'] ?>
                    <?php $totalinsuranceown += $tasktype['insuranceown'] ?>
                <?php endforeach ?>
                <tr class="even_row">
                    <td rowspan="2" style="border-bottom: 0.9px solid black; text-align: center;"><b>TOTAL</b></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalinsuranceown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalinsuranceexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityexternal + $totalactivityown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalinsuranceexternal + $totalinsuranceown ?></td>
                </tr>
                <tr class="even_row">
                    <td colspan="2" style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityown + $totalinsuranceown ?></td>
                    <td colspan="2" style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityexternal + $totalinsuranceexternal ?></td>
                    <td colspan="2" style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $totalactivityown + $totalinsuranceown + $totalactivityexternal + $totalinsuranceexternal ?></td>
                </tr>
            </tbody>
        </table>
        <br/>
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
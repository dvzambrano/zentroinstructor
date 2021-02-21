<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 7pt">
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:5%;"></td>
                <td style="width:90%;font-size:15px;" valign="middle" >
                    <b>RESUMEN DEL CUMPLIMIENTO DEL PLAN DE TRABAJO DE </b>&nbsp;<span style="text-decoration: underline;"><?php echo $entity ?></span><br/>
                    <b>DEL MES DE </b>&nbsp;<span style="text-decoration: underline;"><?php echo $month ?></span>
                </td>
                <td style="width:5%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/>

        <table class="change_order_items" style="width: 100%" border="1">
            <tbody>
                <tr class="even_row">
                    <td colspan="13" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;"><b>TAREAS  PLANIFICADAS</b></td>
                </tr>
                <tr class="even_row">
                    <td rowspan="2" colspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TOTAL TAREAS DEL PLAN MENSUAL</td>
                    <td colspan="5" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">DEL PLAN ANUAL PARA EL MES</td>
                    <td colspan="5" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">NUEVAS TAREAS INCORPORADAS  EN LA  PUNTUALIZACIÓN MENSUAL</td>
                    <td rowspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">% INCORPORADAS vs PLAN ANUAL</td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">SUB TOTAL</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">EXTERNAS (Nivel igual o superior)</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PROPIAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">SUB TOTAL</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">EXTERNAS (Nivel igual o superior)</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PROPIAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                </tr>
                <tr class="odd_row">
                    <td colspan="2" style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4month + $extraplan4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($planed4monthexternal / $planed4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($planed4monthown / $planed4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4monthexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4monthexternal / $extraplan4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4monthown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4monthown / $extraplan4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4month / ($planed4month + $extraplan4month) * 100, 2) ?></td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">ACUMULADAS DE MESES ANTERIORES</td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4month + $acumulatedextraplan4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4monthexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedplaned4monthexternal / $acumulatedplaned4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4monthown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedplaned4monthown / $acumulatedplaned4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4monthexternal ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4monthexternal / $acumulatedextraplan4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4monthown ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4monthown / $acumulatedextraplan4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4month / ($acumulatedplaned4month + $acumulatedextraplan4month) * 100, 2) ?></td>
                </tr>
            </tbody>
        </table>
        <br/>

        <table class="change_order_items" style="width: 100%" border="1">
            <tbody>
                <tr class="even_row">
                    <td colspan="12" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;"><b>CUMPLIMIENTO DE TAREAS</b></td>
                </tr>
                <tr class="even_row">
                    <td rowspan="2" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TOTAL TAREAS CUMPLIDAS EN EL MES</td>
                    <td colspan="5" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PLANIFICADAS EN EL PLAN MENSUAL<br/><span style="font-size:7px;">(INCLUYE LAS DEL PLAN ANUAL Y LAS PUNTUALIZADAS)</span></td>
                    <td colspan="6" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">EXTRAPLANES</td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PLANIFICADAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">CUMPLIDAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">INCUMPLIDAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">POSPUESTAS  O SUSPENDIDAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">TOTAL</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">EXTERNAS (Nivel igual o superior)</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">PROPIAS</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">%</td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">% ESTRAPLANES vs TAREAS PLANIFICADAS</td>
                </tr>
                <tr class="odd_row">
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthcomplete + $extraplan4monthcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($planed4monthcomplete / $planed4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthincomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $planed4monthsuspended ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4monthcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4monthexternalcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4monthexternalcomplete / $extraplan4monthcomplete * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $extraplan4monthowncomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4monthowncomplete / $extraplan4monthcomplete * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($extraplan4monthcomplete / ($planed4monthcomplete + $extraplan4monthcomplete) * 100, 2) ?></td>
                </tr>
                <tr class="even_row">
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>; text-align: center;">ACUMULADAS DE MESES ANTERIORES</td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4month ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4monthcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedplaned4monthcomplete / $acumulatedplaned4month * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4monthincomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedplaned4monthsuspended ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4monthcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4monthexternalcomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4monthexternalcomplete / $acumulatedextraplan4monthcomplete * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo $acumulatedextraplan4monthowncomplete ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4monthowncomplete / $acumulatedextraplan4monthcomplete * 100, 2) ?></td>
                    <td style="border-bottom: 0.9px solid black; text-align: center;"><?php echo round($acumulatedextraplan4monthcomplete / ($acumulatedplaned4monthcomplete + $acumulatedextraplan4monthcomplete) * 100, 2) ?></td>
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
<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 7pt">
        <br/><br/>
        <?php if (strtolower($approvalperson) != strtolower($user)): ?>
            <table border="0">
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
                    <td style="width:60%;"></td>
                </tr>
            </table>
        <?php endif ?>
        <table border="0">
            <tr>
                <td style="width:10%;"></td>
                <td style="width:80%;text-align:center;font-size:20px;" valign="middle" >
                    <b>RESUMEN DEL CUMPLIMIENTO DEL PLAN INDIVIDUAL <span style="text-decoration: underline;"><?php if ($entity && $entity != '') echo $entity; else echo '' ?></span> DEL MES DE </b><br/><span style="text-decoration: underline;"><?php echo $month ?></span>
                </td>
                <td style="width:10%;"></td>
            </tr>
        </table>
        <table class="change_order_items" width="100%" border="1">
            <tbody>
                <tr class="even_row">
                    <td rowspan="2" style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>TOTAL DE TAREAS PLANIFICADAS</b></td>
                    <td colspan="3" style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>DE ELLAS</b></td>
                    <td rowspan="2" style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>NUEVAS TAREAS (EXTRA PLANES)</b></td>
                </tr>
                <tr class="even_row">
                    <td style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>CUMPLIDAS</b></td>
                    <td style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>INCUMPLIDAS</b></td>
                    <td style="text-align: center; border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>SUSPENDIDAS O POSPUESTAS</b></td>
                </tr>
                <tr class="odd_row">
                    <td style="text-align: center;"><?php echo $total ?></td>
                    <td style="text-align: center;"><?php echo $complete ?></td>
                    <td style="text-align: center;"><?php echo $incomplete - $suspended ?></td>
                    <td style="text-align: center;"><?php echo $suspended ?></td>
                    <td style="text-align: center;"><?php echo count($newwtasks) ?></td>
                </tr>
                <tr class="even_row">
                    <td colspan="3" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>OBSERVACIONES DEL CUMPLIMIENTO</b></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>QUI&Eacute;N LAS ORIGIN&Oacute;</b></td>
                    <td style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>CAUSAS</b></td>
                </tr>
                <tr class="even_row">
                    <td colspan="5" style="border-bottom: 0.9px solid black;"><b>TAREAS INCUMPLIDAS</b></td>
                </tr>
                <?php if (count($incompletetasks) < 1): ?>
                    <tr>
                        <td colspan="5">No existen tareas incumplidas.</td>
                    </tr>
                <?php endif ?>
                <?php foreach ($incompletetasks as $incompletetask): ?>
                    <tr class="odd_row">
                        <td colspan="3"><?php echo $incompletetask['name'] ?></td>
                        <td style="text-align: center;"><?php echo $incompletetask['creator'] ?></td>
                        <td style="text-align: center;"></td>
                    </tr>
                <?php endforeach ?>
                <tr class="even_row">
                    <td colspan="5" style="border-bottom: 0.9px solid black;"><b>TAREAS SUSPENDIDAS O POSPUESTAS</b></td>
                </tr>
                <?php if (count($suspendedtasks) < 1): ?>
                    <tr>
                        <td colspan="5">No existen tareas suspendidas o pospuestas.</td>
                    </tr>
                <?php endif ?>
                <?php foreach ($suspendedtasks as $suspendedtask): ?>
                    <tr class="odd_row">
                        <td colspan="3"><?php echo $suspendedtask['name'] ?></td>
                        <td style="text-align: center;"><?php echo $suspendedtask['creator'] ?></td>
                        <td style="text-align: center;"></td>
                    </tr>
                <?php endforeach ?>
                <tr class="even_row">
                    <td colspan="5" style="border-bottom: 0.9px solid black;"><b>NUEVAS TAREAS (EXTRA PLANES)</b></td>
                </tr>
                <?php if (count($newwtasks) < 1): ?>
                    <tr>
                        <td colspan="5">No existen tareas extra planes.</td>
                    </tr>
                <?php endif ?>
                <?php foreach ($newwtasks as $newwtask): ?>
                    <tr class="odd_row">
                        <td colspan="3"><?php echo $newwtask['name'] ?></td>
                        <td style="text-align: center;"><?php echo $newwtask['creator'] ?></td>
                        <td style="text-align: center;"></td>
                    </tr>
                <?php endforeach ?>
                <tr class="even_row">
                    <td colspan="5" style="border-bottom: 0.9px solid black; background-color: #<?php echo $headershadow ?>;"><b>AN&Aacute;LISIS CUALITATIVO</b></td>
                <tr class="odd_row">
                    <td colspan="5"><br/></td>
                </tr>
                <tr class="odd_row">
                    <td colspan="5"><br/></td>
                </tr>
                <tr class="odd_row">
                    <td colspan="5"><br/></td>
                </tr>
                <tr class="odd_row">
                    <td colspan="5"><br/></td>
                </tr>
                <tr class="odd_row">
                    <td colspan="5"><br/></td>
                </tr>
                <tr class="odd_row">
                    <td colspan="5" style="border-bottom: 0.9px solid black;"><br/></td>
                </tr>
                </tr>
            </tbody>
        </table>

        <table width="100%" border="0">
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

        <?php if ($sf_request->getParameter('extra') == 'yes'): ?>
            <table swidth="100%">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <?php if ($sf_request->getParameter('person') && $sf_request->getParameter('person') != ''): ?>
                            <table class="change_order_items">
                                <tr><td colspan="3"><h2>Seg&uacute;n el tiempo:</h2></td></tr>
                                <tbody>
                                    <tr>
                                        <th>&nbsp;Estado</th>
                                        <th>Tareas</th>
                                        <th>Porciento</th>
                                    </tr>
                                    <?php $evenrow = false; ?>
                                    <?php foreach ($datedstatues as $status): ?>
                                        <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                                            <td><?php echo $status['name'] ?></td>
                                            <td style="text-align: center"><?php echo $status['amount'] ?></td>
                                            <td style="text-align: center"><?php echo round($status['amount'] / $datedstatuestotal * 100, 2) ?>%</td>
                                        </tr>
                                        <?php $evenrow = !$evenrow; ?>
                                    <?php endforeach ?>

                                </tbody>
                                <tr>
                                    <td colspan="3" style="text-align: center;">         
                                        <img src="<?php echo $piegraph2url ?>" width="250" />
                                    </td>
                                </tr>
                            </table>
                        <?php endif ?>

                        <table class="change_order_items">
                            <tr><td colspan="3"><h2>Seg&uacute;n tipos:</h2></td></tr>
                            <tbody>
                                <tr>
                                    <th>&nbsp;Tipo</th>
                                    <th>Tareas</th>
                                    <th>Porciento</th>
                                </tr>
                                <?php $evenrow = false; ?>
                                <?php foreach ($tasktypes as $tasktype): ?>
                                    <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                                        <td><?php echo $tasktype['name'] ?></td>
                                        <td style="text-align: center"><?php echo $tasktype['amount'] ?></td>
                                        <td style="text-align: center"><?php echo round($tasktype['amount'] / $tasktypestotal * 100, 2) ?>%</td>
                                    </tr>
                                    <?php $evenrow = !$evenrow; ?>
                                <?php endforeach ?>
                            </tbody>
                            <tr>
                                <td colspan="3" style="text-align: center;">         
                                    <img src="<?php echo $piegraph3url ?>" width="250" />
                                </td>
                            </tr>
                        </table>
                        <?php if ($sf_request->getParameter('person') && $sf_request->getParameter('person') != ''): ?>
                            <table class="change_order_items">
                                <tr><td colspan="3"><h2>Seg&uacute;n cumplimiento:</h2></td></tr>
                                <tbody>
                                    <tr>
                                        <th>&nbsp;Tipo</th>
                                        <th>Tareas</th>
                                        <th>Porciento</th>
                                    </tr>
                                    <tr class="even_row">
                                        <td>Cumplidas</td>
                                        <td style="text-align: center"><?php echo $complete ?></td>
                                        <td style="text-align: center"><?php echo round($complete / $total * 100, 2) ?>%</td>
                                    </tr>
                                    <tr class="odd_row">
                                        <td>Incumplidas</td>
                                        <td style="text-align: center"><?php echo $incomplete ?></td>
                                        <td style="text-align: center"><?php echo round($incomplete / $total * 100, 2) ?>%</td>
                                    </tr>
                                    <tr class="even_row">
                                        <td>Suspendidas o pospuestas</td>
                                        <td style="text-align: center"><?php echo $suspended ?></td>
                                        <td style="text-align: center"><?php echo round($suspended / $total * 100, 2) ?>%</td>
                                    </tr>
                                </tbody>
                                <tr>
                                    <td colspan="3" style="text-align: center;">         
                                        <img src="<?php echo $piegraph6url ?>" width="250" />
                                    </td>
                                </tr>
                            </table>
                        <?php endif ?>
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        <table class="change_order_items">
                            <tr><td colspan="3"><h2>Seg&uacute;n sus estados en el sistema:</h2></td></tr>
                            <tbody>
                                <tr>
                                    <th>&nbsp;Estado</th>
                                    <th>Tareas</th>
                                    <th>Porciento</th>
                                </tr>
                                <?php $evenrow = false; ?>
                                <?php foreach ($statues as $status): ?>
                                    <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                                        <td><?php echo $status['name'] ?></td>
                                        <td style="text-align: center"><?php echo $status['val'] ?></td>
                                        <td style="text-align: center"><?php echo round($status['val'] / $statuestotal * 100, 2) ?>%</td>
                                    </tr>
                                    <?php $evenrow = !$evenrow; ?>
                                <?php endforeach ?>
                            </tbody>
                            <tr>
                                <td colspan="3" style="text-align: center;">         
                                    <img src="<?php echo $piegraph1url ?>" width="250" />
                                </td>
                            </tr>
                        </table>    
                        <table class="change_order_items">
                            <tr><td colspan="3"><h2>Seg&uacute;n l&iacute;nea base:</h2></td></tr>
                            <tbody>
                                <tr>
                                    <th>&nbsp;Estado</th>
                                    <th>Tareas</th>
                                    <th>Porciento</th>
                                </tr>
                                <?php $evenrow = false; ?>
                                <?php foreach ($baseline as $base): ?>
                                    <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                                        <td><?php echo $base['name'] ?></td>
                                        <td style="text-align: center"><?php echo $base['amount'] ?></td>
                                        <td style="text-align: center"><?php echo round($base['amount'] / $baselinetotal * 100, 2) ?>%</td>
                                    </tr>
                                    <?php $evenrow = !$evenrow; ?>
                                <?php endforeach ?>
                            </tbody>
                            <tr>
                                <td colspan="3" style="text-align: center;">         
                                    <img src="<?php echo $piegraph5url ?>" width="250" />
                                </td>
                            </tr>
                        </table>    
                        <table class="change_order_items">
                            <tr><td colspan="3"><h2>Seg&uacute;n locales:</h2></td></tr>
                            <tbody>
                                <tr>
                                    <th>&nbsp;Local</th>
                                    <th>Tareas</th>
                                    <th>Porciento</th>
                                </tr>
                                <?php $evenrow = false; ?>
                                <?php foreach ($locals as $local): ?>
                                    <tr class="<?php if ($evenrow) echo 'odd_row'; else echo 'even_row' ?>">
                                        <td><?php echo $local['name'] ?></td>
                                        <td style="text-align: center"><?php echo $local['amount'] ?></td>
                                        <td style="text-align: center"><?php echo round($local['amount'] / $localstotal * 100, 2) ?>%</td>
                                    </tr>
                                    <?php $evenrow = !$evenrow; ?>
                                <?php endforeach ?>
                            </tbody>
                            <tr>
                                <td colspan="3" style="text-align: center;">         
                                    <img src="<?php echo $piegraph4url ?>" width="250" />
                                </td>
                            </tr>
                        </table>   
                    </td>
                </tr>
            </table>
        <?php endif ?>
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



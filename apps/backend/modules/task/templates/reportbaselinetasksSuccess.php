<link media="screen,print" type="text/css" rel="stylesheet" href="../css/printReport.css">
<div id="body">
    <div id="content" style="font-size: 9px">
        <br/><br/>
        <table class="cleantable" width="100%" height="10%" border="0">
            <tr>
                <td style="width:5%;"></td>
                <td style="width:90%;font-size:15px;" valign="middle" >
                    <b>Listado de <?php echo str_replace(": {0}", "", html_entity_decode($title)) ?> seg&uacute;n l&iacute;nea base</b>
                </td>
                <td style="width:5%;text-align:center" valign="middle" ></td>
            </tr>
        </table>
        <br/>

        <table class="change_order_items" border="1">
            <thead>
                <tr>
                    <th>Tarea</th>
                    <th>Responsable</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                </tr>
            </thead>
            <tbody>
                <?php $evenrow = false; ?>
                <?php foreach ($params as $item): ?>
                    <?php if (!$evenrow): ?>
                        <tr class="even_row">
                            <td style="text-align: center"><?php echo $item["Event"]["name"] ?></td>
                            <td><?php echo $item["responsible"] ?></td>
                            <td style="text-align: center"><?php echo $item["Event"]["start"] ?></td>
                            <td style="text-align: center;"><?php echo $item["Event"]["end"] ?></td>
                        </tr>
                    <?php endif ?>

                    <?php if ($evenrow): ?>
                        <tr class="odd_row"> 
                            <td style="text-align: center"><?php echo $item["Event"]["name"] ?></td>
                            <td><?php echo $item["responsible"] ?></td>
                            <td style="text-align: center"><?php echo $item["Event"]["start"] ?></td>
                            <td style="text-align: center;"><?php echo $item["Event"]["end"] ?></td>
                        </tr>
                    <?php endif ?>

                    <?php $evenrow = !$evenrow; ?>
                <?php endforeach ?>

            </tbody>

            <tr>
                <td colspan="4" style="text-align: right;">Fecha de elaboraci&oacute;n: <?php echo date('d/M/Y') ?></td>
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
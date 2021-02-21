/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage schedule
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

ScheduleApp = function() {
    return {
        init : function(ScheduleApp) {
            
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/schedule/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('schedule.tab.label').toLowerCase());
                        
                        for(var i=0; i<records.length; i++){
                            var obj = window['ScheduleApp'].decodeSesions(records[i].get('sesions'));
                            records[i].set('days', obj.names);
                            records[i].set('obj', obj.description);
                        }
                        
                        if (config.app_showmessageonstoreloadsuccessful)
                            loadStoreSuccessful();
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField:'is_active',
                groupDir:'DESC'
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/schedule/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) {           
                        alertNoRecords(records, bundle.getMsg('schedule.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });            
            
            this.daysStore = new Ext.data.Store({
                reader: new Ext.data.ArrayReader({
                    idIndex: 0 
                }, Ext.data.Record.create([{
                    name: 'id'
                },{
                    name: 'name'
                }])
                )
            });
            for(var i=0; i<Date.dayNames.length; i++)
                this.daysStore.add(new Ext.data.Record({
                    id: i+1,
                    name: Date.dayNames[i]
                })); 
            
            
            this.monthsStore = new Ext.data.Store({
                reader: new Ext.data.ArrayReader({
                    idIndex: 0 
                }, Ext.data.Record.create([{
                    name: 'id'
                },{
                    name: 'name'
                }])
                )
            });
            for(var i=0; i<Date.monthNames.length; i++)
                this.monthsStore.add(new Ext.data.Record({
                    id: i+1,
                    name: Date.monthNames[i]
                }));
            
            
            
            this.filters = new Ext.ux.grid.GridFilters({
                encode: true,
                local: false,
                menuFilterText: bundle.getMsg('app.languaje.find.label'),
                filters: [{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'string',
                    dataIndex: 'comment'
                }]
            });  
            
            this.daysGridSM = function(selectionModel) {
                selectionModel.grid.ownerCt.sesionsGridPanel.endTimeField.setDisabled(selectionModel.getCount() != 1);
                selectionModel.grid.ownerCt.sesionsGridPanel.beginTimeField.setDisabled(selectionModel.getCount() != 1);
                selectionModel.grid.ownerCt.sesionsGridPanel.addRow.setDisabled(selectionModel.getCount() != 1);
                selectionModel.grid.ownerCt.sesionsGridPanel.applytoAllBtn.setDisabled(selectionModel.getCount() != 1);
                            
                if (selectionModel.getCount() == 1){
                    selectionModel.grid.ownerCt.sesionsGridPanel.getStore().removeAll();
                    var record = selectionModel.getSelected();
                                
                    var array = Ext.decode(record.get('sesions'));  
                    if(array)
                        for(var i = 0; i < array.length; i++){
                            selectionModel.grid.ownerCt.sesionsGridPanel.getStore().insert(selectionModel.grid.ownerCt.sesionsGridPanel.getStore().getCount(), new Ext.data.Record({
                                id: array[i].id,
                                begintime: array[i].begintime,
                                endtime: array[i].endtime
                            }));
                        }
                }
            };
            
            this.daysGridPanel = new Ext.grid.GridPanel({
                ref: 'daysGridPanel',
                width: 140, 
                store: this.daysStore,
                autoExpandColumn: 'colday',  
                hideHeaders : true,
                tbar: new Ext.Toolbar({
                    height: 51
                }),
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    autoScroll:true, 
                    listeners: {
                        selectionchange : this.daysGridSM
                    }
                }),
                height:200,
                viewConfig: {
                    forceFit: true
                },
                //forceLayout:true,
                columns: [new Ext.grid.RowNumberer(),{
                    hidden : true,
                    hideable : false,
                    dataIndex : 'id'
                }, {
                    id:'colday',
                    header : bundle.getMsg('schedule.field.day'),
                    width: 30, 
                    dataIndex : 'name'
                }]
            });
            
            this.infoTextItem = new Ext.Toolbar.TextItem('');
            this.expander = new Ext.ux.grid.RowExpander({
                enableCaching : false,
                tpl : new Ext.Template(
                    '<br/><p>{obj}</p>'
                    )
            });
            
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelSchedule',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("schedule.grid.title") : '',
                autoExpandColumn: 'schedulecolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['ScheduleApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        window.open(config.app_host + '/uploads/tutorial/06 Gestion de Horarios.html');
                    }
                }],
                keys: [panelKeysMap],
                
                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getStore().load();
                    },
                    rowclick : function(grid, rowIndex, eventObject) {
                        var selectionModel = grid.getSelectionModel();
                        App.selectionChange(selectionModel);
                    },
                    rowdblclick : function(grid, rowIndex, eventObject) {
                        if(grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden)
                            grid.updateBtn.fireEvent('click', grid.updateBtn);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['ScheduleApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['ScheduleApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['ScheduleApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['ScheduleApp'].infoTextItem.getEl()).update('');
                    }
                },
                
                columns: [this.expander,{
                    header: bundle.getMsg('app.form.name'), 
                    width: 40, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id:'schedulecolname', 
                    header: bundle.getMsg('app.form.comment'),
                    sortable: true, 
                    dataIndex: 'days'
                },{
                    header: bundle.getMsg('user.is.active'), 
                    width: 40, 
                    sortable: true, 
                    hidden: true, 
                    dataIndex: 'is_active',
                    xtype: 'booleancolumn', 
                    trueText: bundle.getMsg('app.form.yes'), 
                    falseText: bundle.getMsg('app.form.no')
                }],
                
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
                
                plugins: [this.filters, this.expander],
                
                stripeRows: true,			
                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['ScheduleApp'].gridPanel.getSelectionModel().clearSelections();
                            window['ScheduleApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
                        }
                    }
                },{
                    ref: '../updateBtn',
                    text: bundle.getMsg('app.form.info'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('information'),
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            App.mask.show();
                            var record = window['ScheduleApp'].gridPanel.getSelectionModel().getSelected();
                            if (record){
                                window['ScheduleApp'].formPanel.getForm().loadRecord(record);
                                if(record.get('sesions')){
                                    var array = Ext.decode(record.get('sesions'));
                                    if (array){
                                        for(var i = 0; i < array.length; i++)
                                            if (array[i].sesions){                        
                                                var index = window['ScheduleApp'].daysStore.find('id', array[i].id);
                                                if (index>-1){
                                                    var myrecord = window['ScheduleApp'].daysStore.getAt(index);
                                                    myrecord.set('sesions', array[i].sesions);
                                                }
                                            }
                                    }
                                }
                                if(record.get('exceptions')){
                                    var array = Ext.decode(record.get('exceptions'));
                                    if (array){
                                        window['ScheduleApp'].exceptionDatesGridPanel.getStore().removeAll();
                                        for(var i = 0; i < array.length; i++){
                                            window['ScheduleApp'].exceptionDatesGridPanel.getStore().insert(window['ScheduleApp'].exceptionDatesGridPanel.getStore().getCount(), new Ext.data.Record({
                                                datestr: array[i].datestr,
                                                day: array[i].day,
                                                month: array[i].month,
                                                comment: array[i].comment
                                            }));                            
                                        }
                                    }
                                }
                            }
                            else
                                window['ScheduleApp'].formPanel.getForm().reset();
                            window['ScheduleApp'].showWindow(button.getEl(), hideApply, callback);
                            App.mask.hide();
                        }
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject, callback) {
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){											
                                            var records = window['ScheduleApp'].gridPanel.getSelectionModel().getSelections();
                                            
                                            var array = new Array();
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
                                            
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/schedule/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['ScheduleApp'].store.load({
                                                            params:{
                                                                start: window['ScheduleApp'].gridPanel.getBottomToolbar().cursor
                                                            }
                                                        });
                                                        if(callback){
                                                            if(callback.fn)
                                                                callback.fn(callback.params);
                                                            else
                                                                callback();
                                                        }
                                                    }
                                                    else
                                                        requestFailed(response, false);
                                                
                                                }
                                            });
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }, 100, this);
                        }
                    }
                },'->',{
                    ref: '../expandBtn',
                    iconCls: Ext.ux.Icon('expand-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.expandall'),
                    listeners: {
                        click: function(store, records, options) {
                            for(var i = 0; i < window['ScheduleApp'].gridPanel.getStore().getCount(); i++)
                                window['ScheduleApp'].expander.expandRow(i);
                        }
                    }
                },{
                    ref: '../collapseBtn',
                    iconCls: Ext.ux.Icon('collapse-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.collapseall'),
                    listeners: {
                        click: function(store, records, options) {
                            for(var i = 0; i < window['ScheduleApp'].gridPanel.getStore().getCount(); i++) 
                                window['ScheduleApp'].expander.collapseRow(i);
                        }
                    }
                }],
                
                bbar: new Ext.PagingToolbar({
                    pageSize: parseInt(config.app_elementsongrid),
                    store: this.store,
                    plugins: [new Ext.ux.ProgressBarPager(), this.filters],
                    items: [{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['ScheduleApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['ScheduleApp'].infoTextItem.getEl()).update('');
                            window['ScheduleApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.form.bbar.displaymsg'),
                    emptyMsg: String.format(bundle.getMsg('app.form.bbar.emptymsg'), bundle.getMsg('app.form.elements').toLowerCase())
                }),
                
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:false, 
                    listeners: {
                        selectionchange: App.selectionChange
                    }
                })
            });
            
            this.gridPanel.getView().getRowClass = function(record, index, rowParams, store) {
                var css = '';
                if (!record.get('deleteable')) 
                    css = 'row-italic';
                return css;
            };
            
            
            this.sesionsComboStore = new Ext.data.Store({
                url: config.app_host + '/schedule/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) {           
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.sesionsGridPanel = new Ext.grid.GridPanel({
                ref: 'sesionsGridPanel',
                store: this.sesionsComboStore,
                autoExpandColumn: 'schedulesesionscolday',
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    autoScroll:true,
                    listeners: {
                        selectionchange: function(selectionModel) {
                            selectionModel.grid.removeRow.setDisabled(selectionModel.getCount() < 1);
                        }
                    }
                }),
                height:200,
                viewConfig: {
                    forceFit: true
                },
                
                columns: [new Ext.grid.RowNumberer(),{
                    hidden : true,
                    hideable : false,
                    dataIndex : 'id'
                }, {
                    id: 'schedulesesionscolday',
                    header : bundle.getMsg('schedule.field.begin.time'),
                    width: 30, 
                    dataIndex : 'begintime'
                }, {
                    header : bundle.getMsg('schedule.field.end.time'),
                    width: 30, 
                    dataIndex : 'endtime'
                }],
                tbar: this.getSessionTbar(),
                
                buttons:[{
                    ref: '../applytoAllBtn',
                    iconCls: Ext.ux.Icon('date_next'),
                    text: bundle.getMsg('schedule.field.applytoalldays'),
                    disabled: true,
                    listeners: {
                        click: function(button, eventObject) {
                            
                            var array = new Array();       
                            window['ScheduleApp'].sesionsGridPanel.getStore().each(function(record){
                                var r = new Object;
                                r.id = record.get('id');
                                r.begintime = record.get('begintime');
                                r.endtime = record.get('endtime');
                                array.push(r);
                            });
                            
                            window['ScheduleApp'].daysGridPanel.getStore().each(function(record){
                                record.set('sesions', Ext.encode(array));
                            });
                        }
                    }
                }]
            });
            
            this.exceptionDatesGridPanel = new Ext.grid.GridPanel({
                title: bundle.getMsg('schedule.field.notwork'),
                store: new Ext.data.Store({
                    url: config.app_host + '/schedule/request/method/load',
                    baseParams:{
                        component: 'combo'
                    },
                    reader: new Ext.data.JsonReader(),
                    listeners: {
                        load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) {           
                            alertNoRecords(records);
                        },
                        loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                    }
                }),
                iconCls: Ext.ux.Icon('bell'),
                autoExpandColumn: 'colexceltion',
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    autoScroll:true
                }),
                height:200,
                viewConfig: {
                    forceFit: true
                },
                
                columns: [new Ext.grid.RowNumberer(),{
                    id:'colexceltion',
                    header : bundle.getMsg('app.form.date'),
                    width: 30, 
                    dataIndex : 'datestr'
                }, {
                    header : bundle.getMsg('schedule.field.notworkreason'),
                    width: 60, 
                    dataIndex : 'comment'
                }],
            
                tbar: this.getExceptionsTbar()
            });
            
            
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                frame:true,
                url: config.app_host + '/schedule/request/method/save',
                bodyStyle:'padding:5px 5px 0',						        
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.88,
                        layout: 'form',
                        items: [{
                            ref: '../../nameField',
                            xtype:'textfield',
                            name: 'name',
                            fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>',
                            allowBlank:false,
                            anchor:'-20'
                        }]
                    },{
                        columnWidth:.12,
                        layout: 'form',
                        items: [{
                            xtype:'checkbox',
                            name: 'is_active',
                            boxLabel: bundle.getMsg('user.is.active')                               
                        }]
                    }]
                }, new Ext.TabPanel({
                    activeTab: 0,
                    anchor: '-20',
                    height: 230,
                    plain: true,
                    defaults:{
                        autoScroll: true,
                        border: false
                    },			
                    items:[new Ext.Panel({
                        iconCls: Ext.ux.Icon('calendar'),
                        width: 500,
                        height: 200,
                        title: bundle.getMsg('schedule.field.session')+'<x style="color:red;"><sup>*</sup></x>',
                        layout: 'hbox',
                        defaults: {
                            flex: 1
                        }, 
                        items: [window['ScheduleApp'].daysGridPanel, window['ScheduleApp'].sesionsGridPanel]
                    }), window['ScheduleApp'].exceptionDatesGridPanel]
                })]
            });
        
        },
        
        decodeSesions : function(sesions){
            var r = new Object;
            r.names = '';
            r.description = '';
            var array = Ext.decode(sesions);
            if(array)
                for(var i = 0; i < array.length; i++)
                    if (array[i].sesions){
                        r.description += '<div style="float:left;width:120px;">';
                        if (r.names != '')
                            r.names += ', ';
                        
                        var index = window['ScheduleApp'].daysStore.find('id', array[i].id);
                        if (index>-1){
                            var record = window['ScheduleApp'].daysStore.getAt(index);
                            r.names += record.get('name');
                            r.description += '<b>' + record.get('name')+'</b><hr/>';
                        }
                        
                        var temp = '';
                        sesions = Ext.decode(array[i].sesions);
                        for(var j = 0; j < sesions.length; j++){
                            if (temp != '')
                                temp += '<br/>';
                            temp += sesions[j].begintime +' - ' + sesions[j].endtime;
                        }
                        r.description += temp + '</div>';
                    }
            
            return r;
        },
        
        getExceptionsTbar : function(){
            return ['->', {
                xtype: 'displayfield', 
                value: bundle.getMsg('app.form.date')+'<span style="color:red;"><sup>*</sup></span>'+':&nbsp;'
            }, new Ext.form.ComboBox({
                ref: '../monthCombo',
                editable: false,
                store: window['ScheduleApp'].monthsStore,
                allowBlank:false,
                valueField: 'id',    
                displayField: 'name',
                tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus:true,
                emptyText: bundle.getMsg('app.form.select'),
                width: 90,
                listeners: {
                    blur: function(field){
                        var dt = new Date(field.getValue()+'/10/2007 03:05:01 PM GMT-0600');
                        
                        field.ownerCt.ownerCt.dayField.reset();
                        field.ownerCt.ownerCt.dayField.setMaxValue(dt.getDaysInMonth());
                    }
                }
            }),{
                ref: '../dayField',
                xtype: 'spinnerfield',
                minValue: 1,
                maxValue: 31,
                allowDecimals: false,
                allowBlank:false,
                accelerate: true,
                width: 60
            },{
                xtype: 'displayfield', 
                value: '&nbsp;&nbsp;'+bundle.getMsg('schedule.field.notworkreason')+':&nbsp;'
            },{
                ref: '../commentField',
                xtype:'textfield',
                width: 210
            },{
                ref: '../addRow',
                iconCls: Ext.ux.Icon('table_row_insert'),
                listeners: {
                    click: function(button, eventObject) {
                        if(button.ownerCt.ownerCt.monthCombo.isValid() && button.ownerCt.ownerCt.dayField.isValid()){
                            button.ownerCt.ownerCt.getStore().add(new Ext.data.Record({
                                datestr: button.ownerCt.ownerCt.monthCombo.getRawValue()+' '+button.ownerCt.ownerCt.dayField.getValue(),
                                day: button.ownerCt.ownerCt.dayField.getValue(),
                                month: button.ownerCt.ownerCt.monthCombo.getValue(),
                                comment: button.ownerCt.ownerCt.commentField.getValue()
                            }));
                            button.ownerCt.ownerCt.monthCombo.reset();
                            button.ownerCt.ownerCt.dayField.reset();
                            button.ownerCt.ownerCt.commentField.reset();
                        }
                    }
                }
            },{
                ref: '../removeRow',
                tooltip: bundle.getMsg('app.form.deleterow'),
                iconCls: Ext.ux.Icon('table_row_delete'),
                listeners: {
                    click: function(button, eventObject) {
                        var records = button.ownerCt.ownerCt.getSelectionModel().getSelections();
                        button.ownerCt.ownerCt.getStore().remove(records);
                    }
                }
            }];
        },
        
        getSessionTbar : function(){
            return [{
                xtype: 'displayfield', 
                value: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+bundle.getMsg('schedule.field.begin.time')+'<span style="color:red;"><sup>*</sup></span>'+':&nbsp;'
            }, new Ext.form.TimeField({
                fieldLabel: bundle.getMsg('app.form.time')+'<span style="color:red;"><sup>*</sup></span>',
                ref: '../beginTimeField',
                format: Date.patterns.ShortTime,
                increment: 60,
                width: 80, 
                allowBlank:false,
                disabled: true,
                listeners: {
                    blur: function(field) {
                        if (field.isValid())
                            field.ownerCt.ownerCt.endTimeField.setMinValue(field.getValue()); 
                        else
                            field.ownerCt.ownerCt.endTimeField.setMinValue('00:00'); 
                    }
                }
            }), {
                xtype: 'displayfield', 
                value: '&nbsp;&nbsp;&nbsp;'+bundle.getMsg('schedule.field.end.time')+'<span style="color:red;"><sup>*</sup></span>'+':&nbsp;'
            }, new Ext.form.TimeField({
                fieldLabel: bundle.getMsg('app.form.time')+'<span style="color:red;"><sup>*</sup></span>',
                ref: '../endTimeField',
                format: Date.patterns.ShortTime,
                increment: 60,
                width: 80, 
                allowBlank:false,
                disabled: true,
                listeners: {
                    blur: function(field) {
                        if (field.isValid())
                            field.ownerCt.ownerCt.beginTimeField.setMaxValue(field.getValue()); 
                        else
                            field.ownerCt.ownerCt.beginTimeField.setMaxValue('23:59'); 
                    }
                }
            }), '->', {
                ref: '../addRow',
                iconCls: Ext.ux.Icon('table_row_insert'),
                disabled: true,
                listeners: {
                    click: function(button, eventObject) {
                        if(button.ownerCt.ownerCt.beginTimeField.isValid() && button.ownerCt.ownerCt.endTimeField.isValid()){
                            button.ownerCt.ownerCt.getStore().add( new Ext.data.Record({
                                id: button.ownerCt.ownerCt.getStore().getCount(),
                                begintime: button.ownerCt.ownerCt.beginTimeField.getValue(),
                                endtime: button.ownerCt.ownerCt.endTimeField.getValue()
                            }));
                            button.ownerCt.ownerCt.beginTimeField.setMaxValue('23:59'); 
                            button.ownerCt.ownerCt.beginTimeField.reset();
                            button.ownerCt.ownerCt.endTimeField.setMinValue('00:00'); 
                            button.ownerCt.ownerCt.endTimeField.reset();
                            
                            var array = new Array();       
                            button.ownerCt.ownerCt.getStore().each(function(record){
                                var r = new Object;
                                r.id = record.get('id');
                                r.begintime = record.get('begintime');
                                r.endtime = record.get('endtime');
                                array.push(r);
                            });
                            
                            var record = button.ownerCt.ownerCt.ownerCt.daysGridPanel.getSelectionModel().getSelected();
                            record.set('sesions', Ext.encode(array));
                        }
                    }
                }
            },{
                ref: '../removeRow',
                tooltip: bundle.getMsg('app.form.deleterow'),
                disabled: true,
                iconCls: Ext.ux.Icon('table_row_delete'),
                listeners: {
                    click: function(button, eventObject) {
                        var records = button.ownerCt.ownerCt.getSelectionModel().getSelections();
                        button.ownerCt.ownerCt.getStore().remove(records);
                        
                        var array = new Array();       
                        button.ownerCt.ownerCt.getStore().each(function(record){
                            var r = new Object;
                            r.id = record.get('id');
                            r.begintime = record.get('begintime');
                            r.endtime = record.get('endtime');
                            array.push(r);
                        });
                        
                        
                        record = button.ownerCt.ownerCt.ownerCt.daysGridPanel.getSelectionModel().getSelected();
                        record.set('sesions', Ext.encode(array));
                    }
                }
            }];
        },
        
        showWindow : function(animateTarget, hideApply, callback){
            window['ScheduleApp'].window =  App.showWindow(bundle.getMsg('schedule.window.title'), 600, 380, this.formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['OrdertypeApp'].window.submitBtn.id;
                    }
                    
                    var record = window['ScheduleApp'].gridPanel.getSelectionModel().getSelected();
                    
                    var emptysesions = 0;
                    var sesions = new Array();                    
                    window['ScheduleApp'].daysGridPanel.getStore().each(function(record){
                        var r = new Object;
                        r.id = record.get('id');
                        r.sesions = record.get('sesions');
                        sesions.push(r);
                        
                        if(!record.get('sesions') || record.get('sesions') == '')
                            emptysesions++;
                    });  
                    
                    if(emptysesions == sesions.length){
                        window['ScheduleApp'].formPanel.nameField.markInvalid(bundle.getMsg('schedule.action.save.nosessions'));
                        return;
                    }
                    
                    var exceptions = new Array();                    
                    window['ScheduleApp'].exceptionDatesGridPanel.getStore().each(function(record){
                        var r = new Object;
                        r.day = record.get('day');
                        r.datestr = record.get('datestr');
                        r.month = record.get('month');
                        r.comment = record.get('comment');
                        
                        exceptions.push(r);
                    });
                    
                    window['ScheduleApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: record ? record.get('id'):'',
                            sesions: Ext.encode(sesions),
                            exceptions: Ext.encode(exceptions),
                            entityid: config.app_entityid
                        },
                        success: function(form, action) {  
                            checkSesionExpired(form, action);
                            window['ScheduleApp'].store.load({
                                params:{
                                    start: window['ScheduleApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            if(button.id == window['ScheduleApp'].window.submitBtn.id || (button.id == window['ScheduleApp'].window.applyBtn.id && !record)){
                                window['ScheduleApp'].daysGridPanel.getSelectionModel().clearSelections();
                                window['ScheduleApp'].exceptionDatesGridPanel.getStore().removeAll();
                                window['ScheduleApp'].sesionsComboStore.removeAll();
                                window['ScheduleApp'].sesionsGridPanel.beginTimeField.reset();
                                window['ScheduleApp'].sesionsGridPanel.endTimeField.reset();
                                window['ScheduleApp'].exceptionDatesGridPanel.monthCombo.reset();
                                window['ScheduleApp'].exceptionDatesGridPanel.dayField.reset();
                                window['ScheduleApp'].exceptionDatesGridPanel.commentField.reset();
                                
                                if(button.id == window['ScheduleApp'].window.submitBtn.id){
                                    window['ScheduleApp'].daysGridPanel.getStore().each(function(record){
                                        record.set('sesions', null);
                                    });
                                    window['ScheduleApp'].window.hide();
                                }
                                
                                
                                if(callback){
                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                    if(callback.fn){
                                        callback.params.push(obj);
                                        callback.fn(callback.params);
                                    }
                                    else
                                        callback(obj);
                                }
                                else
                                    loadFormSuccessful(form, action, config.app_showmessageonformloadposition);
                            }
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    window['ScheduleApp'].daysGridPanel.getStore().each(function(record){
                        record.set('sesions', null);
                    });
                    window['ScheduleApp'].daysGridPanel.getSelectionModel().clearSelections();
                    window['ScheduleApp'].exceptionDatesGridPanel.getStore().removeAll();
                    window['ScheduleApp'].sesionsComboStore.removeAll();
                    window['ScheduleApp'].sesionsGridPanel.beginTimeField.reset();
                    window['ScheduleApp'].sesionsGridPanel.endTimeField.reset();
                    window['ScheduleApp'].exceptionDatesGridPanel.monthCombo.reset();
                    window['ScheduleApp'].exceptionDatesGridPanel.dayField.reset();
                    window['ScheduleApp'].exceptionDatesGridPanel.commentField.reset();
                    window['ScheduleApp'].formPanel.getForm().reset();
                    window['ScheduleApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false, function(){
                    window['ScheduleApp'].daysGridPanel.getSelectionModel().selectFirstRow();
                });
        },
        
        applySecurity : function(groups, permissions){
            window['ScheduleApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageschedule') != -1 || permissions.indexOf('managescheduleadd') != -1);
            window['ScheduleApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageschedule') != -1 || permissions.indexOf('managescheduleedit') != -1);
            window['ScheduleApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageschedule') != -1 || permissions.indexOf('managescheduledelete') != -1);            
        }
    }
}();
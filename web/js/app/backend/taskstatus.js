/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage taskstatus
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

TaskstatusApp = function() {
    return {
        init : function(TaskstatusApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/taskstatus/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('taskstatus.tab.label').toLowerCase());
                        
                        for(var i = 0; i < records.length; i++){
                            records[i].set('name', records[i].get('Calendar').name);
                            records[i].set('comment', records[i].get('Calendar').comment);
                            
                        }
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/taskstatus/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('taskstatus.tab.label').toLowerCase());
                        
                        for(var i = 0; i < records.length; i++){
                            records[i].set('name', records[i].get('Calendar').name);
                            records[i].set('comment', records[i].get('Calendar').comment);
                            
                        }
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
            this.taskStatusSelectedComboStore = new Ext.data.Store({
                url: config.app_host + '/taskstatus/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) {           
                    //                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
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

            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelTaskstatus',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("taskstatus.grid.title") : '',
                autoExpandColumn: 'taskstatuscolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['TaskstatusApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                    //window.open(config.app_host + '/uploads/tutorial/page.html');
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
                        var text = App.getFiltersText(window['TaskstatusApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['TaskstatusApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['TaskstatusApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['TaskstatusApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [{
                    header: ' ',
                    width: 15,
                    dataIndex: 'customcolor',
                    renderer: function(val) {
                        return '<div class="mail-calendar-cat-color ext-cal-picker-icon" style="background-color:#'+val+'">&nbsp;</div>';
                    }
                }, {
                    header: bundle.getMsg('app.form.name'), 
                    width: 170, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id:'taskstatuscolname', 
                    header: bundle.getMsg('app.form.comment'),
                    width: 300,
                    dataIndex: 'comment'
                }],
				
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
                
                plugins: [this.filters],
				
                stripeRows: true,
				
                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['TaskstatusApp'].gridPanel.getSelectionModel().clearSelections();
                            window['TaskstatusApp'].gridPanel.updateBtn.fireEvent('click', button);
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
                            var record = window['TaskstatusApp'].gridPanel.getSelectionModel().getSelected();
                            var finalFn = function(){
                                if (record){
                                    window['TaskstatusApp'].formPanel.getForm().loadRecord(record);
                                    
                                    var nextstatues = record.get('TaskStatues');
                                    if(nextstatues)
                                        for (var i = 0; i < nextstatues.length; i++){
                                            var index = window['TaskstatusApp'].comboStore.find('id', nextstatues[i].id);
                                            if(index > -1){
                                                window['TaskstatusApp'].taskStatusSelectedComboStore.add(window['TaskstatusApp'].comboStore.getAt(index));
                                                window['TaskstatusApp'].comboStore.removeAt(index);
                                            }
                                        }
                                }
                                window['TaskstatusApp'].showWindow(button.getEl());
                                App.mask.hide();
                            };
                            
                            if(record){
                                var elements = new Array();
                                var element = new Object;
                                element.id = record.get('id');
                                elements.push(element);
                                        
                                window['TaskstatusApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                            }
                            else
                                window['TaskstatusApp'].comboStore.baseParams.distinct = '';
                            
                            window['TaskstatusApp'].comboStore.baseParams.entityid = config.app_entityid;
                            
                            syncLoad([window['TaskstatusApp'].comboStore], finalFn);
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
                                            var records = window['TaskstatusApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/taskstatus/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['TaskstatusApp'].store.load({
                                                            params:{
                                                                start: window['TaskstatusApp'].gridPanel.getBottomToolbar().cursor
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
                }],
				
                bbar: new Ext.PagingToolbar({
                    pageSize: parseInt(config.app_elementsongrid),
                    store: this.store,
                    plugins: [new Ext.ux.ProgressBarPager(), this.filters],
                    items: [{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['TaskstatusApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['TaskstatusApp'].infoTextItem.getEl()).update('');
                            window['TaskstatusApp'].gridPanel.getSelectionModel().clearSelections();
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
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/taskstatus/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.7,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            name: 'name',
                            fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>',
                            allowBlank: false,         
                            maxLength: 130, 
                            anchor:'-20'
                        }]
                    },{
                        columnWidth:.3,
                        layout: 'form',
                        items: [new Ext.ux.PaletteCombo({
                            colors: mastercolors,
                            fieldLabel: bundle.getMsg('app.form.color')+'<span style="color:red;"><sup>*</sup></span>',
                            name: 'customcolor',
                            allowBlank: false,
                            anchor:'-20'
                        })]
                    }]
                },{
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('app.form.comment'),         
                    maxLength: 400, 
                    anchor:'-20'
                },{
                    xtype: 'itemselector',
                    name: 'status',
                    fieldLabel:  bundle.getMsg('app.form.nextstatus'),
                    bodyStyle: 'background-color:#FFFFFF',
                    imagePath: './js/extjs/ux/images/',
                    anchor:'-20',
                    multiselects: [{
                        width: 145,
                        height: 150,
                        store: this.comboStore,
                        legend: bundle.getMsg('app.languaje.select.available'),
                        displayField: 'name',
                        valueField: 'id'
                    },{
                        width: 145,
                        height: 150,
                        store: this.taskStatusSelectedComboStore,
                        legend: bundle.getMsg('app.languaje.select.selected'),
                        displayField: 'name',
                        valueField: 'id'
                    }]
                },{
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            fieldLabel:  bundle.getMsg('task.field.completestatus'),
                            xtype:'checkbox',
                            name: 'iscomplete',
                            boxLabel: bundle.getMsg('task.field.iscomplete')                               
                        }]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'checkbox',
                            name: 'issuspended',
                            boxLabel: bundle.getMsg('task.field.issuspended')                               
                        }]
                    }]
                }]
            });

        },

        showWindow : function(animateTarget, hideApply, callback){
            
            window['TaskstatusApp'].window = App.showWindow(bundle.getMsg('taskstatus.window.title'), 370, 460, window['TaskstatusApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['TaskstatusApp'].window.submitBtn.id;
                    }
                    var record = window['TaskstatusApp'].gridPanel.getSelectionModel().getSelected();
							
                    window['TaskstatusApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: record ? record.get('id') : '',
                            entityid: config.app_entityid
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['TaskstatusApp'].store.load({
                                params:{
                                    start: window['TaskstatusApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('TaskstatusApp', form, action, button, !record, function(){
                                
                                }, callback);
                        },
                        failure: loadFormFailed
                    });
                
                },
                function(){
                    window['TaskstatusApp'].formPanel.getForm().reset();
                    window['TaskstatusApp'].window.hide();
                },
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        }, 
		
        applySecurity : function(groups, permissions){
            window['TaskstatusApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managetaskstatus') != -1 || permissions.indexOf('managetaskstatusadd') != -1);
            window['TaskstatusApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managetaskstatus') != -1 || permissions.indexOf('managetaskstatusedit') != -1);
            window['TaskstatusApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managetaskstatus') != -1 || permissions.indexOf('managetaskstatusdelete') != -1);
        }
    }
}();
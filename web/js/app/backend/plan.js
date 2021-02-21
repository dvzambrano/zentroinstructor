
PlanApp = function() {
    return {
        init : function(PlanApp) {
            
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/plan/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid,
                    personid: config.app_logueduserdata.personid,
                    superadmin: App.isAdvanced(),
                    type: 'personal'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/plan/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) { 
                        alertNoRecords(records, bundle.getMsg('plan.tab.label').toLowerCase());
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
                    type: 'date',
                    dataIndex: 'start',
                    beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                    afterText: bundle.getMsg('app.languaje.find.afterthan'),
                    onText: bundle.getMsg('app.languaje.find.ondate'),
                    dateFormat: Date.patterns.NonISO8601Short
                },{
                    type: 'string',
                    dataIndex: 'comment'
                }]
            });
            
            this.customPanelKeysMap = panelKeysMap.concat({
                key: "p",
                fn: function(key, e){
                    e.preventDefault();
                    
                    var panel = window['PlanApp'].gridPanel;
                    if(panel && panel.planBtn && !panel.planBtn.disabled)
                        panel.planBtn.fireEvent('click', panel.planBtn);
                }
            },{
                key: "1",
                fn: function(key, e){
                    e.preventDefault();
                    
                    var panel = window['PlanApp'].gridPanel;
                    if(panel && panel.calendarBtn && !panel.calendarBtn.disabled)
                        panel.calendarBtn.fireEvent('click', panel.calendarBtn);
                }
            },{
                key: "2",
                fn: function(key, e){
                    e.preventDefault();
                    
                    var panel = window['PlanApp'].gridPanel;
                    if(panel && panel.ganttBtn && !panel.ganttBtn.disabled)
                        panel.ganttBtn.fireEvent('click', panel.ganttBtn);
                }
            });
            
            this.gridPanel = new Ext.grid.GridPanel({
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('devhelp'),
                title: config.app_showgridtitle ? bundle.getMsg("plan.grid.title") : '',
                autoExpandColumn: 'plancolname',
                store: this.store,
                loadMask: true,
                delegate : 'x-grid-cell',
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function(button, eventObject) {
                        App.printView(window['PlanApp'].gridPanel);
                    }
                }],
                keys: [this.customPanelKeysMap],
                
                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getStore().load();
                    },
                    rowclick : function(grid, rowIndex, eventObject) {
                        var selectionModel = grid.getSelectionModel();
                        window['PlanApp'].selectionChange(selectionModel);
                    },
                    rowdblclick : function(grid, rowIndex, eventObject) {
                        var record = grid.getSelectionModel().getSelected(); 
                        if((grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden) ||
                            grid.planBtn && !grid.planBtn.disabled && !grid.planBtn.hidden)
                            if(record.get('virtual') === false)
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.info.title'),
                                    msg: bundle.getMsg('plan.action.editorplan'),
                                    buttons: {
                                        yes:bundle.getMsg('app.form.info'),
                                        no:bundle.getMsg('app.form.plan')
                                    },
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            if(grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden)
                                                grid.updateBtn.fireEvent('click', grid.updateBtn);
                                        }
                                        else{
                                            if(grid.planBtn && !grid.planBtn.disabled && !grid.planBtn.hidden)
                                                grid.planBtn.handler(grid.planBtn);
                                        }
                                    
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                }); 
                            else
                                grid.planBtn.fireEvent('click', grid.planBtn);
                    }
                },
                
                columns: [{
                    width: 15,
                    sortable: false,
                    dataIndex: 'virtual',
                    renderer: function(val) {
                        if(val === false)
                            return '<img title="'+bundle.getMsg('plan.action.viewonlyinstitutional')+'" src="'+config.app_host+'/images/icons/famfamfam/internet-archive.png" height="12"/>';
                        return '<img title="'+bundle.getMsg('plan.action.viewonlypersonal')+'" src="'+config.app_host+'/images/icons/famfamfam/preferences-desktop-theme.png" height="12"/>';
                    }
                },{
                    header: bundle.getMsg('app.form.name'), 
                    width: 250, 
                    sortable: true,
                    dataIndex: 'name',
                    renderer: function(val) {
                        return '<b>'+val+'</b>';
                    }
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Short, 
                    header: bundle.getMsg('app.form.start'), 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'guessstart'
                },{
                    xtype: 'datecolumn',
                    header: bundle.getMsg('schedule.field.end.date'), 
                    width: 80, 
                    sortable: true, 
                    format: Date.patterns.NonISO8601Short,
                    dataIndex: 'end'
                },{
                    header: bundle.getMsg('task.tab.label'), 
                    width: 50, 
                    sortable: true,
                    dataIndex: 'conttasks'
                },{
                    id:'plancolname',
                    header: bundle.getMsg('app.form.comment'), 
                    width: 350,
                    sortable: true,
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
                    disabled: true,
                    iconCls: Ext.ux.Icon('add'), 
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject) {
                            window['PlanApp'].gridPanel.getSelectionModel().clearSelections();
                            window['PlanApp'].gridPanel.updateBtn.fireEvent('click', window['PlanApp'].gridPanel.updateBtn);
                        }
                    }
                },{
                    ref: '../updateBtn',
                    text: bundle.getMsg('app.form.info'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('information'),
                    listeners: {
                        click: function(button, eventObject) {
                            App.mask.show();
                            
                            window['PlanApp'].formPanel.tabPanel.notesContainer.setDisabled(true);
                            
                            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected(); 
                            if (record){
                                window['PlanApp'].formPanel.tabPanel.notesContainer.setDisabled(false);
                                
                                record.set('plan', record.get('Plan').name);
                                window['PlanApp'].parentRecord = new Object;
                                window['PlanApp'].parentRecord.id = record.data.parentid;
                                
                                window['PlanApp'].formPanel.getForm().loadRecord(record);
                                
                                var i = 0;
                                
                                window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().removeAll();
                                var goals = record.get('Goals');
                                for(i = 0; goals && i < goals.length; i++) 
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().add(new Ext.data.Record(goals[i]));
                                
                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().removeAll();
                                var persons = record.get('PlanPersonRelation');
                                for(i = 0; persons && i < persons.length; i++) {
                                    var data = persons[i].Person.sfGuardUser;
                                    data.full_name = persons[i].Person.sfGuardUser.first_name + ' ' + persons[i].Person.sfGuardUser.last_name;
                                    data.readonly = persons[i].readonly;
                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().add(new Ext.data.Record(data));
                                }
                            }
                            window['PlanApp'].showWindow(button.getEl());
                            App.mask.hide();
                        }
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject) {
                            var nodes = window['PlanApp'].gridPanel.getSelectionModel().getSelections();
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            var array = new Array(); 
                                            
                                            for (var i = 0; i < nodes.length; i++)
                                                array.push(nodes[i].data.id);
                                            
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/plan/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    window['PlanApp'].gridPanel.getStore().load({
                                                        params:{
                                                            start:0
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION,
                                    closable: false
                                });
                            }, 100, this);
                        }
                    }
                },'-',
                //                {
                //                    ref: '../planBtn',
                //                    text: bundle.getMsg('app.form.plan'),
                //                    disabled: true,
                //                    iconCls: Ext.ux.Icon('evolution-tasks', 'myicons'),
                //                    listeners: {
                //                        click: function(button, eventObject) {
                //                            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected(); 
                //                            if (record){
                //                                App.mask.show();
                //                                
                //                                window['PlanApp'].taskGridPanel.getStore().baseParams.person = '';
                //                                window['PlanApp'].taskGridPanel.getStore().baseParams.time = '';
                //                                
                //                                if (record.get('virtual') === false){
                //                                    window['PlanApp'].taskGridPanel.getStore().baseParams.person = 'false';
                //                                    window['PlanApp'].taskGridPanel.getStore().baseParams.plan = record.get('id');
                //                                }
                //                                else{
                //                                    window['PlanApp'].taskGridPanel.getStore().baseParams.person = record.get('id');
                //                                    window['PlanApp'].taskGridPanel.getStore().baseParams.plan = 'false';
                //                                }
                //                                
                //                                window['PlanApp'].taskGridPanel.setTitle(String.format(bundle.getMsg('task.grid.title'), record.get('name')));
                //                                
                //                                window['PlanApp'].cardPanel.getLayout().setActiveItem(1); 
                //                                
                //                                App.mask.hide();
                //                            
                //                            }
                //                        }
                //                    }
                //                },
                new Ext.Toolbar.SplitButton({
                    ref: '../planBtn',
                    disabled: true,
                    text: bundle.getMsg('app.form.plan'),
                    iconCls: Ext.ux.Icon('evolution-tasks', 'myicons'),
                    handler: function(button, eventObject) {
                        var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected(); 
                        if (record){
                            App.mask.show();
                                
                            window['PlanApp'].taskGridPanel.getStore().baseParams.person = '';
                            window['PlanApp'].taskGridPanel.getStore().baseParams.time = '';
                                
                            if (record.get('virtual') === false){
                                window['PlanApp'].taskGridPanel.getStore().baseParams.person = 'false';
                                window['PlanApp'].taskGridPanel.getStore().baseParams.plan = record.get('id');
                            }
                            else{
                                window['PlanApp'].taskGridPanel.getStore().baseParams.person = record.get('id');
                                window['PlanApp'].taskGridPanel.getStore().baseParams.plan = 'false';
                            }
                                
                            window['PlanApp'].taskGridPanel.setTitle(String.format(bundle.getMsg('task.grid.title'), record.get('name')));
                                
                            window['PlanApp'].cardPanel.getLayout().setActiveItem(1); 
                                
                            App.mask.hide();
                            
                        }
                    },
                    tooltip: {
                        title: bundle.getMsg('app.form.plan'),
                        text: bundle.getMsg('plan.field.plantip')
                    },
                    menu : {
                        items: [{
                            text: bundle.getMsg('plan.action.duplicate.create'),
                            handler: window['PlanApp'].duplicatePlanFn
                        }]
                    }
                }),'-',{
                    ref: '../calendarBtn',
                    text: bundle.getMsg('plan.action.calendarear'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('wtop-calendars'),
                    listeners: {
                        click: function(button, eventObject) {
                            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                            if(record){
                                if(window['CalendarApp'])
                                    window['CalendarApp'].eventStore.setBaseParam('personid', record.get('id')); 
                                
                                var m = getModule('Calendar'); 
                                var menu = Ext.getCmp('principal-menu-item-'+m.id);
                                if(menu)
                                    menu.toggle(true);
                            }
                        }
                    }
                }, {
                    ref: '../ganttBtn',
                    text: bundle.getMsg('plan.action.ganttear'),
                    hidden: true,
                    disabled: true,
                    iconCls: Ext.ux.Icon('shape_align_left'),
                    listeners: {
                        click: function(button, eventObject) {
                            App.mask.show();
                            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                            if (record){
                                if (record.get('virtual') === false){
                                    window['PlanApp'].taskGridPanel.getStore().baseParams.person = 'false';
                                    window['PlanApp'].taskGridPanel.getStore().baseParams.plan = record.get('id');
                                }
                                else{
                                    window['PlanApp'].taskGridPanel.getStore().baseParams.person = record.get('id');
                                    window['PlanApp'].taskGridPanel.getStore().baseParams.plan = 'false';
                                }
                                window['PlanApp'].taskGridPanel.getStore().load({
                                    params: {
                                        start: 0,
                                        limit: 10000,
                                        renum: 1
                                    },
                                    callback: function(records, options, success ){
                                        var obj = window['PlanApp'].getGanttParams(window['PlanApp'].taskGridPanel.getStore().getRange());
                                        App.mask.hide();
                                        App.printView('print/ganttgraph.php?data='+'['+obj.data+']&progress=['+obj.progress+']&constrains=['+obj.constrains+']&title='+record.get('name')+'&color='+config.app_headershadow+'&trick=image.png', ' ', ' '); 
                                    }
                                });
                            }
                        
                        }
                    }
                },'-', {
                    ref: '../baselineBtn',
                    text: bundle.getMsg('app.form.baseline'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('gnome-screenshot'),
                    menu: {
                        items: [{
                            text: bundle.getMsg('plan.action.baseline.create'),
                            listeners: {
                                click: window['PlanApp'].createBaseLineFn
                            }
                        },{
                            id: 'baselineExploreOption',
                            disabled: true,
                            text: bundle.getMsg('plan.action.baseline.explore'),
                            listeners: {
                                click: window['PlanApp'].exploreBaseLineFn
                            }
                        }]
                    }
                },{
                    ref: '../exportBtn',
                    text: bundle.getMsg('plan.action.export'),
                    iconCls: Ext.ux.Icon('database_go'),
                    menu: {
                        items: [{
                            id: 'exportPlan',
                            disabled: true,
                            text: bundle.getMsg('plan.action.export.create'),
                            listeners: {
                                click: window['PlanApp'].exportPlanFn
                            }
                        },{
                            text: bundle.getMsg('plan.action.export.explore'),
                            listeners: {
                                click: window['PlanApp'].importPlanFn
                            }
                        }]
                    }
                },{
                    ref: '../reportBtn',
                    text: bundle.getMsg('app.languaje.report.label'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('report'),
                    menu : {
                        items: [{
                            ref: 'reportPlan4Year',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.yearlyplan'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report1', record); 
                                }
                            }
                        },{
                            ref: 'reportPlan4YearSummary',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.yearlyplansummary'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report1summary', record); 
                                }
                            }
                        }, '-', {
                            ref: 'reportPlan4Month',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.monthlyplan'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report2', record);
                                }
                            }
                        },{
                            ref: 'reportCompletementPlan4Month',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.monthlyplancompletement'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report2completement', record);
                                }
                            }
                        },{
                            ref: 'reportPlan4Self',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.selflyplan'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report3', record);
                                }
                            }
                        },{
                            ref: 'reportPlanExecution',
                            disabled: true,
                            text: bundle.getMsg('plan.report.cumplete'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('reportCompletement', record);
                                }
                            }
                        },'-',{
                            ref: 'reportPlanControl',
                            disabled: true,
                            text: bundle.getMsg('plan.report.model.controlplan'),
                            iconCls: Ext.ux.Icon('mitter'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                    window['PlanApp'].printPlanReport('report2p', record);
                                }
                            }
                        }]
                    }
                },'->',{
                    ref: '../typeInstitutionalBtn',
                    iconCls: Ext.ux.Icon('internet-archive'),
                    tooltip: {
                        title: bundle.getMsg('plan.action.viewonlyinstitutional'),
                        text: bundle.getMsg('plan.action.viewonlyinstitutional.comment')
                    },
                    enableToggle: true,
                    toggleGroup: 'plan-type-togglegroup',
                    listeners: {
                        click: function(button, eventObject) {
                            window['PlanApp'].gridPanel.getSelectionModel().clearSelections();
                            window['PlanApp'].selectionChange(window['PlanApp'].gridPanel.getSelectionModel());
                            
                            window['PlanApp'].gridPanel.typeInstitutionalBtn.setDisabled(button.pressed);
                            window['PlanApp'].gridPanel.typePersonalBtn.setDisabled(!button.pressed);
                            
                            window['PlanApp'].gridPanel.getStore().baseParams.type = 'institutional';
                            window['PlanApp'].gridPanel.getStore().load();
                            
                            window['PlanApp'].gridPanel.addBtn.setDisabled(false);
                        }
                    }
                },{
                    ref: '../typePersonalBtn',
                    iconCls: Ext.ux.Icon('preferences-desktop-theme'),
                    tooltip: {
                        title: bundle.getMsg('plan.action.viewonlypersonal'),
                        text: bundle.getMsg('plan.action.viewonlypersonal.comment')
                    },
                    enableToggle: true,
                    toggleGroup: 'plan-type-togglegroup',
                    pressed: true,
                    disabled: true,
                    listeners: {
                        click: function(button, eventObject) {
                            window['PlanApp'].gridPanel.getSelectionModel().clearSelections();
                            window['PlanApp'].selectionChange(window['PlanApp'].gridPanel.getSelectionModel());
                            
                            window['PlanApp'].gridPanel.typeInstitutionalBtn.setDisabled(!button.pressed);
                            window['PlanApp'].gridPanel.typePersonalBtn.setDisabled(button.pressed);
                            
                            window['PlanApp'].gridPanel.getStore().baseParams.type = 'personal';
                            window['PlanApp'].gridPanel.getStore().load();
                            
                            window['PlanApp'].gridPanel.addBtn.setDisabled(true);
                        }
                    }
                }],
                
                bbar: new Ext.PagingToolbar({
                    pageSize: parseInt(config.app_elementsongrid),
                    store: this.store,
                    plugins: new Ext.ux.ProgressBarPager(),
                    items: [{
                        tooltip: bundle.getMsg('app.form.deleterow'),
                        ref: 'deleteRowBtn', 
                        hidden: true,
                        disabled: true,
                        iconCls: Ext.ux.Icon('table_row_delete'),
                        listeners: {
                            click: function(button, eventObject) {
                            
                            }
                        }
                    },{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['PlanApp'].gridPanel.filters.clearFilters();
                        } 
                    }],
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.form.bbar.displaymsg'),
                    emptyMsg: String.format(bundle.getMsg('app.form.bbar.emptymsg'), bundle.getMsg('app.form.elements').toLowerCase())
                }),
                
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:false
                })
            });
            
            this.gridPanel.getView().getRowClass = function(record, index, rowParams, store) {
                if (!record.get('deleteable')) 
                    return 'row-italic';
            }; 
            
            this.reportPeriodForm = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                height: 310,
                url: config.app_host + '/plan/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						
                keys: [formKeyMaping],
                items: [{
                    ref: 'yearField',
                    xtype: 'spinnerfield',
                    name: 'periodYearSpinner',
                    fieldLabel: bundle.getMsg('plan.report.year')+'<span style="color:red;"><sup>*</sup></span>',
                    minValue: 1981,
                    allowDecimals: false,
                    accelerate: true,
                    allowBlank: false,
                    anchor: '-20'
                }, new Ext.form.ComboBox({
                    ref: 'monthCombo',
                    fieldLabel: bundle.getMsg('plan.report.month')+'<span style="color:red;"><sup>*</sup></span>', 
                    anchor:'-20',
                    store: window['ScheduleApp'].monthsStore,
                    valueField: 'id',
                    displayField: 'name',
                    tpl: '<tpl for="."><div ext:qtip="{name}" class="x-combo-list-item">{name}</div></tpl>',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true,
                    forceSelection:true,
                    emptyText: bundle.getMsg('app.form.select'),
                    allowBlank: false
                })]
            });
            
            this.notesPanel = window['NoteApp'].getPanelFor('Plan', 'Plan');
            this.taskNotesPanel = window['NoteApp'].getPanelFor('Plan', 'Task');
            
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/plan/request/method/save',
                layout:'fit',
                border:false,					
                keys: [formKeyMaping],
                
                items: [new Ext.TabPanel({
                    ref: 'tabPanel',
                    defaults:{
                        autoHeight:false, 
                        border:false
                    }, 			
                    activeTab: 0,
                    border:false,	
                    items:[new Ext.Panel({
                        ref: 'generalPanel',
                        title: bundle.getMsg('app.form.generaldata'),
                        border: false,	
                        layout:'form',
                        bodyStyle:'padding:5px',
                        items: [{
                            xtype:'textfield',
                            name: 'name',
                            allowBlank: false,
                            fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>', 
                            anchor:'-20'
                        },{
                            layout:'column',
                            border: false,
                            defaults:{
                                border:false
                            }, 	
                            items:[{
                                //                                columnWidth:.25,
                                //                                layout: 'form',
                                //                                items:[{
                                //                                    ref: '../../startField',
                                //                                    xtype:'datefield',
                                //                                    name: 'start',
                                //                                    allowBlank: false,
                                //                                    fieldLabel: bundle.getMsg('app.form.start')+'<span style="color:red;"><sup>*</sup></span>', 
                                //                                    anchor:'-20'
                                //                                }]
                                //                            },{	
                                columnWidth:1,
                                layout: 'form',
                                items:[
                                new Ext.form.ComboBox({
                                    ref: '../../parentCombo',
                                    fieldLabel : bundle.getMsg('plan.field.parent'),
                                    store: this.comboStore,
                                    name: 'plan',
                                    anchor:'-20',
                                    emptyText: bundle.getMsg('app.form.typehere'),
                                    minChars: config.app_characteramounttofind,
                                    displayField: 'name',
                                    typeAhead: false,
                                    loadingText: bundle.getMsg('app.msg.wait.searching'),
                                    pageSize: config.app_elementsongrid/2,
                                    hideTrigger:true,
                                    tpl: new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                        '<h3>{name}</h3>',
                                        '{comment}',
                                        '</div></tpl>'
                                        ),
                                    itemSelector: 'div.search-item',
                                    listeners: {
                                        select: function(combo, record, index ){
                                            window['PlanApp'].parentRecord = record; 
                                            window['PlanApp'].comboStore.baseParams.distinct = '';
                                            this.collapse();
                                        },
                                        beforequery: function(queryEvent) {
                                            delete queryEvent.combo.lastQuery;
                                            var records = window['PlanApp'].gridPanel.getSelectionModel().getSelections();
                                            if (records && records.length>0){
                                                records = records[0];
                                                
                                                var elements = new Array();
                                                var element = new Object;
                                                element.id = records.get('id');
                                                elements.push(element);
                                                
                                                window['PlanApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                                            } 
                                            this.setValue(queryEvent.query);
                                        },
                                        blur: function(field) {						
                                            if(field.getRawValue() == '')
                                                window['PlanApp'].parentRecord = false;
                                            else {
                                                var record = field.getStore().getAt(field.getStore().find('name',field.getRawValue(), 0, true, true));
                                                
                                                if(record&&record.get('name') == field.getRawValue())
                                                    window['PlanApp'].parentRecord = record;
                                                else { 
                                                    window['PlanApp'].parentRecord = false;
                                                    window['PlanApp'].formPanel.tabPanel.generalPanel.parentCombo.markInvalid(bundle.getMsg('app.combo.notification.noexistrecord'));
                                                }
                                            } 
                                            window['PlanApp'].comboStore.baseParams.distinct = '';
                                        }
                                    }
                                })]
                            }]
                        },{
                            xtype:'textarea',
                            name: 'comment',
                            fieldLabel: bundle.getMsg('app.form.comment'), 
                            anchor:'-20'
                        }]
                    }), new Ext.grid.GridPanel({
                        ref: 'goalsGridPanel',
                        stripeRows: true,
                        autoExpandColumn: 'plangoalscolcode',
                        title: bundle.getMsg('goal.tab.label'),
                        iconCls: Ext.ux.Icon('gnome-settings-default-applications'),
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader()
                        }),
                        sm: new Ext.grid.RowSelectionModel({
                            listeners: {
                                selectionchange: function(selectionModel) {
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                                }
                            }
                        }),
                        columns: [{
                            id: 'plangoalscolcode',
                            header: bundle.getMsg('app.form.name'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'name'
                        }],
                        tbar: [new Ext.Toolbar.TextItem(bundle.getMsg('goal.field.label')+'<span style="color:red;"><sup>*</sup></span>'+': '),new Ext.form.ComboBox({
                            ref: '../goalCombo',
                            store: new Ext.data.Store({
                                url: config.app_host + '/goal/request/method/load',
                                baseParams:{
                                    component: 'combo'						
                                },
                                reader: new Ext.data.JsonReader(),
                                listeners: {
                                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) { 
                                        alertNoRecords(records, bundle.getMsg('goal.tab.label').toLowerCase());
                                    },
                                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                                }
                            }),
                            name: 'goalCombo',
                            width: 360,
                            emptyText: bundle.getMsg('app.form.typehere'),
                            minChars: config.app_characteramounttofind,
                            displayField: 'name',
                            typeAhead: false,
                            allowBlank:false,
                            loadingText: bundle.getMsg('app.msg.wait.searching'),
                            pageSize: config.app_elementsongrid/2,
                            hideTrigger:true,
                            tpl: new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                '<h3>{name}</h3>',
                                '{comment}',
                                '</div></tpl>'
                                ),
                            itemSelector: 'div.search-item',
                            listeners: {
                                select: function(combo, record, index){					
                                    window['PlanApp'].goalRecord = record;
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.getStore().baseParams.distinct = ''; 
                                    this.collapse();
                                },
                                beforequery: function(queryEvent) { 
                                    delete queryEvent.combo.lastQuery;
                                    var elements = new Array();
                                    
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().each(function(record){
                                        var element = new Object;
                                        element.id = record.get('id');
                                        elements.push(element);
                                    });
                                    
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.getStore().baseParams.distinct = Ext.encode(elements); 
                                    this.setValue(queryEvent.query);
                                },
                                blur: function(field) {				
                                    if(field.getRawValue() == '')
                                        window['PlanApp'].goalRecord = false;
                                    else {
                                        var record = field.getStore().getAt(field.getStore().findExact('name', field.getRawValue()));
                                        
                                        if(record&&record.get('name') == field.getRawValue())
                                            window['PlanApp'].goalRecord = record;
                                        else 
                                            window['PlanApp'].goalRecord = false;
                                    }
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.getStore().baseParams.distinct = ''; 
                                }
                            }
                        }), 
                        '->' ,{
                            tooltip: bundle.getMsg('app.form.addrow'),
                            iconCls: Ext.ux.Icon('table_row_insert'),
                            listeners: {
                                click: function(button, eventObject) {
                                    if(window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.isValid() && window['PlanApp'].goalRecord) {
                                        window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().add(window['PlanApp'].goalRecord);
                                        window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.reset();
                                    }
                                }
                            }
                        },{
                            ref: '../removeBtn',
                            tooltip: bundle.getMsg('app.form.deleterow'),
                            disabled: true,
                            iconCls: Ext.ux.Icon('table_row_delete'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var records = window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getSelectionModel().getSelections();
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().remove(records);
                                }
                            }
                        }],
                        listeners:{
                            keypress:function(e){		
                                if(e.getKey()==46){
                                    var records = window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getSelectionModel().getSelections();
                                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().remove(records);
                                }
                            }
                        }
                    }), new Ext.grid.GridPanel({
                        ref: 'personsGridPanel',
                        stripeRows: true,
                        autoExpandColumn: 'planaccesscolcode',
                        title: bundle.getMsg('plan.field.access'),
                        iconCls: Ext.ux.Icon('key'),
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader()
                        }),
                        
                        view: new Ext.grid.GridView({
                            markDirty: false
                        }),
                        sm: new Ext.grid.RowSelectionModel({
                            listeners: {
                                selectionchange: function(selectionModel) {
                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                                }
                            }
                        }),
                        
                        columns: [{
                            id: 'planaccesscolcode',
                            header: bundle.getMsg('app.form.name'),
                            width: 100, 
                            sortable: true, 
                            dataIndex: 'full_name'
                        },{
                            header: bundle.getMsg('app.form.readonly'),
                            width: 80, 
                            sortable: true, 
                            align: 'center',
                            renderer: function(val) {
                                if(val == 1)
                                    return '<img src="'+config.app_host+'/images/icons/famfamfam/tick.png" height="12"/>';
                                return '';
                            },
                            dataIndex: 'readonly'
                        }],
                        tbar: [{
                            xtype: 'tbtext',
                            name: 'textCombo',
                            text: bundle.getMsg('app.languaje.findby.label')+'&nbsp;'
                        },{
                            ref: '../findbyRadioGroup',
                            xtype: 'radiogroup',
                            name: 'planfindByTypeRadioGroup',
                            width: 125,
                            layout: 'form',
                            itemCls: 'x-check-group-alt',
                            items: [{									
                                checked: true,
                                name: 'planfindByTypeRadioGroup',
                                boxLabel: bundle.getMsg('team.field.person'), 
                                inputValue: 1
                            },{
                                name: 'planfindByTypeRadioGroup',
                                boxLabel: bundle.getMsg('group.field.label'), 
                                inputValue: 2
                            }],
                            listeners: {
                                change: function(radioGroup, radio) {
                                    if(radio)
                                        switch(radio.inputValue) {
                                            case 1:
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.setVisible(true);
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.setVisible(false);
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.reset();
                                                break;
                                            
                                            case 2:
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.setVisible(true);
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.setVisible(false);
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.reset();		
                                                break;
                                            default:
                                                break;
                                        }	
                                }
                            }
                        }, new Ext.form.ComboBox({
                            ref: '../findbypersonCombo',
                            store: window['UserApp'].comboStore,
                            name: 'planfindbypersonCombo',
                            width: 270,
                            hidden: false,
                            emptyText: bundle.getMsg('app.form.typehere'),
                            minChars: config.app_characteramounttofind,
                            displayField: 'full_name',
                            typeAhead: false,
                            loadingText: bundle.getMsg('app.msg.wait.searching'),
                            pageSize: config.app_elementsongrid/2,
                            hideTrigger:true,
                            allowBlank:false,
                            tpl: new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                '<img src="{picture}" height="30px" align="right" hspace="10" /><h3>{full_name}</h3>{email_address}',
                                '</div></tpl>'
                                ),
                            itemSelector: 'div.search-item',
                            listeners: {
                                select: function(combo, record, index ){
                                    window['PlanApp'].recordPerson = record;
                                    window['UserApp'].comboStore.baseParams.distinct = '';
                                    this.collapse();
                                },
                                beforequery: function(queryEvent) { 
                                    delete queryEvent.combo.lastQuery;
                                    var elements = new Array();
                                    
                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().each(function(record){
                                        var element = new Object;
                                        element.id = record.get('id');
                                        elements.push(element);
                                    });
                                    
                                    window['UserApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                                    
                                    this.setValue(queryEvent.query);
                                },
                                blur: function(field) {		
                                    if(field.getRawValue() == '')
                                        window['PlanApp'].recordPerson = false;
                                    else {
                                        var record = field.getStore().getAt(field.getStore().find('full_name',field.getRawValue(), 0, true, true));								 
                                        if(record && record.get('full_name') == field.getRawValue())
                                            window['PlanApp'].recordPerson = record;
                                        else 
                                            window['PlanApp'].recordPerson = false;
                                    }
                                    window['UserApp'].comboStore.baseParams.distinct = '';
                                }
                            }
                        }), new Ext.form.ComboBox({
                            ref: '../findbyteamCombo',
                            fieldLabel : bundle.getMsg('plan.field.parent'),
                            store: window['TeamApp'].comboStore,
                            name: 'planfindbyteamCombo',
                            width: 270,
                            //editable: false,
                            hidden: true,				
                            emptyText: bundle.getMsg('app.form.typehere'),
                            minChars: config.app_characteramounttofind,
                            displayField: 'name',
                            typeAhead: false,
                            loadingText: bundle.getMsg('app.msg.wait.searching'),
                            pageSize: config.app_elementsongrid/2,
                            hideTrigger: true,
                            //triggerAction: 'all',
                            forceSelection: true,
                            tpl: new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                '<h3>{name}</h3>',
                                '{comment}',
                                '</div></tpl>'
                                ),
                            itemSelector: 'div.search-item',
                            listeners: {
                                select: function(combo, record, index ){
                                    window['PlanApp'].recordTeam = record;
                                    this.collapse();
                                },
                                blur: function(field) {
                                    if(field.getRawValue() == '')
                                        window['PlanApp'].recordTeam = false;
                                    else {
                                        var record = field.getStore().getAt(field.getStore().find('name',field.getRawValue(), 0, true, true));								 
                                        if(record&&record.get('name') == field.getRawValue())
                                            window['PlanApp'].recordTeam = record;
                                        else 
                                            window['PlanApp'].recordTeam = false;
                                    }
                                }
                            }
                        }), '->', {
                            tooltip: bundle.getMsg('app.form.addrow'),
                            iconCls: Ext.ux.Icon('table_row_insert'),
                            listeners: {
                                click: function(button, eventObject) {
                                    if((window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo && window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.isValid() && window['PlanApp'].recordPerson) || (window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo && window['PlanApp'].recordTeam)) 								
                                        if(window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyRadioGroup.items.items[1].checked) {
                                            var mask = new Ext.LoadMask(window['PlanApp'].formPanel.tabPanel.personsGridPanel.getEl(), {
                                                msg: bundle.getMsg('app.layout.loading')+'...'
                                            });
                                            
                                            mask.show();
                                            
                                            var elements = new Array();
                                            window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().each(function(record){
                                                var element = new Object;
                                                element.id = record.get('id');
                                                elements.push(element);
                                            });
                                            
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/person/request/method/load',
                                                params:{
                                                    component: 'combo',
                                                    type: 'persons',
                                                    teamid: window['PlanApp'].recordTeam.get('id'),
                                                    plan: 1,
                                                    distinct: Ext.encode(elements)
                                                },
                                                reader: new Ext.data.JsonReader(),
                                                callback: function(options, success, response) {
                                                    var persons = Ext.decode(response.responseText);
                                                    for(var i = 0; persons.data && i < persons.data.length; i++) {
                                                        if(window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().findExact('username', persons.data[i].sfGuardUser.username) != -1)
                                                            window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.reset();
                                                        else {
                                                            persons.data[i].full_name = persons.data[i].name;
                                                            persons.data[i].email_address = persons.data[i].sfGuardUser.email_address;
                                                            window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().add(new Ext.data.Record(persons.data[i]));
                                                        }
                                                    }
                                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.reset();
                                                    mask.hide();
                                                }
                                            });
                                        }
                                        else{
                                            if(window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().findExact('username', window['PlanApp'].recordPerson.get('username')) != -1)
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.markInvalid(bundle.getMsg('plan.combo.notification.existrecord'));
                                            else {
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().add(window['PlanApp'].recordPerson);
                                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.reset();
                                            }
                                        }
                                }
                            }
                        },{
                            ref: '../removeBtn',
                            tooltip: bundle.getMsg('app.form.deleterow'),
                            disabled: true,
                            iconCls: Ext.ux.Icon('table_row_delete'),
                            listeners: {
                                click: function(button, eventObject) {
                                    var records = window['PlanApp'].formPanel.tabPanel.personsGridPanel.getSelectionModel().getSelections();
                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().remove(records);
                                }
                            }
                        }],
                        listeners:{
                            keypress:function(e){		
                                if(e.getKey()==46){
                                    var records = window['PlanApp'].formPanel.tabPanel.personsGridPanel.getSelectionModel().getSelections();
                                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().remove(records);
                                }
                            },
                            rowdblclick : function(grid, rowIndex){
                                var records = grid.getSelectionModel().getSelections();
                                grid.getStore().remove(records);
                                for(var i = 0; i < records.length; i++){
                                    records[i].set('readonly', !records[i].get('readonly'));
                                    grid.getStore().insert(rowIndex, records[i]);
                                }
                            }
                        }
                    }), {
                        ref: 'notesContainer',
                        title: bundle.getMsg('note.tab.label'),	
                        iconCls: Ext.ux.Icon('note'),
                        layout: 'fit',
                        items: [this.notesPanel],
                        listeners: {
                            activate: function() {
                                var mask = new Ext.LoadMask(window['PlanApp'].notesPanel.getEl(), {
                                    msg: bundle.getMsg('app.layout.loading')+'...'
                                });
                                mask.show();
                                var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                
                                window['PlanApp'].notesPanel.items.items[0].getBottomToolbar().store.removeAll();
                                window['PlanApp'].notesPanel.items.items[0].getBottomToolbar().store.baseParams.entityid = record ? 'plan-'+record.id : '';
                                window['PlanApp'].notesPanel.items.items[0].getBottomToolbar().store.load({
                                    callback: function(){
                                        mask.hide();
                                    }
                                });
                            }
                        }
                    
                    }],
                    listeners: {
                        tabchange: function(panel, tab){
                            if(tab.title == bundle.getMsg('goal.tab.label'))
                                window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.reset();
                            else if(tab.title == bundle.getMsg('team.field.personal'))
                                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.reset(); 
                        }
                    }
                })]
            });
            
            // task components -------------------------------------------------
            
            this.totalTask = 0;
            
            this.afterTasksLoad = function(store, records, options) { 
                alertNoRecords(records);
                if(config.app_showmessageonstoreloadsuccessful)
                    loadStoreSuccessful(store, records, options);
                
                for(var i = 0; i < records.length; i++){
                    records[i].set('name', records[i].get('Event').name);
                    records[i].set('reminderid', records[i].get('Event').reminderid);
                    records[i].set('local', records[i].get('Local').name);
                    records[i].set('tasktype', records[i].get('Tasktype').name);
                    if(records[i].get('Taskstatus').Calendar)
                        records[i].set('taskstatus', records[i].get('Taskstatus').Calendar.name);
                    records[i].set('picture', config.app_host+'/images/avatar.png');
                    if(records[i].get('Person') && records[i].get('Person').sfGuardUser)
                        records[i].set('responsible', records[i].get('Person').sfGuardUser.first_name + ' ' + records[i].get('Person').sfGuardUser.last_name);
                    if(records[i].get('Person') && records[i].get('Person').picture && records[i].get('Person').picture !='')
                        records[i].set('picture', records[i].get('Person').picture);
                    if(records[i].get('Task') && records[i].get('Task').Event && records[i].get('Task').Event.name !='')
                        records[i].set('subtask', records[i].get('Task').Event.name);
                    
                    var composition = '';
                    if(records[i].get('serialid'))
                        composition += '1';
                    else
                        composition += '0';
                    if(records[i].get('multipartid'))
                        composition += '1';
                    else
                        composition += '0';
                    records[i].set('composition', composition);
                }
                if(store.groupField && store.groupField!=''){
                    store.clearGrouping();
                    store.groupBy('taskstatus', true);
                }
            };
            
            this.taskStore = new Ext.data.GroupingStore({
                url: config.app_host + '/task/request/method/load',
                baseParams:{
                    component: 'grid',
                    entityid: config.app_entityid,
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: this.afterTasksLoad,
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField: 'taskstatus'
            });
            
            this.taskComboStore = new Ext.data.Store({
                url: config.app_host + '/task/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: this.afterTasksLoad,
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.taskFilters = new Ext.ux.grid.GridFilters({
                encode: true,
                local: false,
                menuFilterText: bundle.getMsg('app.languaje.find.label'),
                filters: [{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'date',
                    dataIndex: 'start',
                    beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                    afterText: bundle.getMsg('app.languaje.find.afterthan'),
                    onText: bundle.getMsg('app.languaje.find.ondate'),
                    dateFormat: Date.patterns.NonISO8601Short
                },{
                    type: 'date',
                    dataIndex: 'end',
                    beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                    afterText: bundle.getMsg('app.languaje.find.afterthan'),
                    onText: bundle.getMsg('app.languaje.find.ondate'),
                    dateFormat: Date.patterns.NonISO8601Short
                },{
                    type: 'string',
                    dataIndex: 'responsible'
                },{
                    type: 'string',
                    dataIndex: 'tasktype'
                },{
                    type: 'string',
                    dataIndex: 'local'
                },{
                    type: 'string',
                    dataIndex: 'taskstatus'
                }]
            });
            
            this.taskGridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelTask',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('evolution-tasks'),
                title: config.app_showgridtitle ? bundle.getMsg("task.grid.title") : '',
                autoExpandColumn: 'taskcolname',
                store: this.taskStore,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['PlanApp'].taskGridPanel);
                    }
                },{
                    id: 'close',
                    qtip: bundle.getMsg('app.languaje.close.label'),
                    handler: function() {
                        window['PlanApp'].taskGridPanel.getStore().removeAll(); 
                        if(!config.multientityapp || (config.multientityapp && config.app_entityid))
                            window['PlanApp'].cardPanel.getLayout().setActiveItem(0); 
                        else {
                            var menu = Ext.getCmp('principal-menu-item-home');
                            menu.toggle(true);
                        }
                    }
                }],
                keys: [panelKeysMap],
                
                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getStore().load();
                    },
                    rowclick : function(grid, rowIndex, eventObject) {
                        App.selectionChange(grid.getSelectionModel());
                    },
                    rowdblclick : function(grid, rowIndex, eventObject) {
                        if(grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden)
                            grid.updateBtn.fireEvent('click', grid.updateBtn);
                    }
                },
                
                columns: [{
                    header: '&nbsp;&nbsp;', 
                    width: 30,
                    dataIndex: 'isinvitation',
                    renderer: function(value) {
                        if(value)
                            return '<div class="mail-calendar-cat-color ext-cal-picker-icon" style="background-color:#D5B816;">&nbsp;</div>';
                        return '&nbsp;';
                    }
                },{
                    id:'taskcolname', 
                    header: bundle.getMsg('app.form.name'), 
                    width: 400, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Long1, 
                    header: bundle.getMsg('schedule.field.begin.date'), 
                    width: 115, 
                    sortable: true, 
                    dataIndex: 'start'
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Long1, 
                    header: bundle.getMsg('schedule.field.end.date'), 
                    width: 115, 
                    sortable: true, 
                    dataIndex: 'end'
                },{
                    header: bundle.getMsg('task.field.responsible'), 
                    width: 200, 
                    sortable: true, 
                    dataIndex: 'responsible'
                },{
                    header: bundle.getMsg('app.form.percentage'), 
                    width: 80, 
                    hidden: true, 
                    sortable: true, 
                    dataIndex: 'percentage',
                    renderer: window['PlanApp'].percentageRenderer
                },{
                    header: bundle.getMsg('tasktype.field.label'), 
                    width: 100, 
                    sortable: true, 
                    hidden: true, 
                    dataIndex: 'tasktype'
                },{
                    header: bundle.getMsg('local.field.label'), 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'local'
                },{
                    header: bundle.getMsg('taskstatus.field.label'), 
                    width: 120, 
                    hidden: true, 
                    sortable: true, 
                    dataIndex: 'taskstatus'
                }],	
                
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
                
                plugins: [new Ext.ux.grid.GridFilters({
                    encode: true,
                    local: false,
                    menuFilterText: bundle.getMsg('app.languaje.find.label'),
                    filters: [{
                        type: 'string',
                        dataIndex: 'name'
                    },{
                        type: 'date',
                        dataIndex: 'start',
                        beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                        afterText: bundle.getMsg('app.languaje.find.afterthan'),
                        onText: bundle.getMsg('app.languaje.find.ondate'),
                        dateFormat: Date.patterns.NonISO8601Short
                    },{
                        type: 'date',
                        dataIndex: 'end',
                        beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                        afterText: bundle.getMsg('app.languaje.find.afterthan'),
                        onText: bundle.getMsg('app.languaje.find.ondate'),
                        dateFormat: Date.patterns.NonISO8601Short
                    },{
                        type: 'string',
                        dataIndex: 'responsible'
                    },{
                        type: 'string',
                        dataIndex: 'tasktype'
                    },{
                        type: 'string',
                        dataIndex: 'local'
                    },{
                        type: 'string',
                        dataIndex: 'taskstatus'
                    }]
                })],
                
                stripeRows: true,
                
                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['PlanApp'].taskGridPanel.getSelectionModel().clearSelections();
                            window['PlanApp'].taskGridPanel.updateBtn.fireEvent('click', window['PlanApp'].taskGridPanel.updateBtn, false, hideApply, callback);
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
                            
                            var finalFn = function(){
                                var showWindowFn = function(record){
                                    App.mask.hide();
                                    window['PlanApp'].taskShowWindow(button.getEl(), hideApply, callback, function(){
                                        window['PlanApp'].taskFormPanel.nameField.removeClass('x-item-disabled');
                                        window['PlanApp'].taskFormPanel.typeCombo.removeClass('x-item-disabled');
                                        window['PlanApp'].taskFormPanel.localCombo.removeClass('x-item-disabled');
                                        
                                        window['PlanApp'].taskFormPanel.typeCombo.triggers[1].setDisplayed(App.permissions.indexOf('managetasktype') != -1 || App.permissions.indexOf('managetasktypeadd') != -1);
                                        window['PlanApp'].taskFormPanel.responsibleCombo.triggers[1].setDisplayed(App.permissions.indexOf('manageuser') != -1 || App.permissions.indexOf('manageuseradd') != -1);
                                        window['PlanApp'].taskFormPanel.statusCombo.triggers[1].setDisplayed(App.permissions.indexOf('managetaskstatus') != -1 || App.permissions.indexOf('managetaskstatusadd') != -1);
                                        window['PlanApp'].taskFormPanel.localCombo.triggers[1].setDisplayed(App.permissions.indexOf('managelocal') != -1 || App.permissions.indexOf('managelocaladd') != -1);
                                        
                                        var fielddisabled = record && record.data.Creator.id != record.data.Person.id && !App.isAdvanced();
                                        
                                        window['PlanApp'].taskFormPanel.nameField.setReadOnly(fielddisabled);
                                        if(fielddisabled)
                                            window['PlanApp'].taskFormPanel.nameField.addClass('x-item-disabled');
                                        
                                        window['PlanApp'].taskFormPanel.typeCombo.setReadOnly(fielddisabled);
                                        if(fielddisabled)
                                            window['PlanApp'].taskFormPanel.typeCombo.addClass('x-item-disabled');
                                        
                                        window['PlanApp'].taskFormPanel.localCombo.setReadOnly(fielddisabled);
                                        if(fielddisabled)
                                            window['PlanApp'].taskFormPanel.localCombo.addClass('x-item-disabled');
                                        
                                        window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.setDisabled(fielddisabled);
                                        window['PlanApp'].taskFormPanel.tabPanel.extraPanel.setDisabled(fielddisabled);
                                        window['PlanApp'].taskPanel.participantsGridPanel.setDisabled(fielddisabled);
                                        window['PlanApp'].taskPanel.relatedsGridPanel.setDisabled(fielddisabled);
                                        
                                        window['PlanApp'].taskPanel.notesContainer.setDisabled(!record);
                                        
                                        window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.setValue('frequencyTypeDaily', record && record.get('dailyrepetition') && record.get('dailyrepetition') != '');
                                        window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.setValue('frequencyTypeWeekly', record && record.get('weeklyrepetition') && record.get('weeklyrepetition') != '');
                                        window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.setValue('frequencyTypeMonthly', record && record.get('monthlyrepetition') && record.get('monthlyrepetition') != '');
                                        window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.setValue('frequencyTypeYearly', record && record.get('yearlyrepetition') && record.get('yearlyrepetition') != '');
                                    });
                                };
                                
                                var loadTask = function(record){
                                    record.set('periodictask', record.get('breakingrepetition') && record.get('breakingrepetition')!='');
                                    record.set('manuallyprogrammed', true); // IMPORTANT, do not delete!
                                    
                                    window['PlanApp'].editingRecord = record;
                                    window['PlanApp'].taskFormPanel.getForm().loadRecord(record);
                                    
                                    window['PlanApp'].responsibleRecord = record.get('Person');
                                    
                                    window['PlanApp'].subtaskRecord = new Object;
                                    window['PlanApp'].subtaskRecord.id = record.get('parentid');
                                    
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.setValue([record.get('start'), record.get('end')]);
                                    window['PlanApp'].taskFormPanel.typeCombo.setValue(record.get('tasktypeid'));
                                    window['PlanApp'].taskFormPanel.statusCombo.setValue(record.get('taskstatusid'));
                                    window['PlanApp'].taskFormPanel.localCombo.setValue(record.get('localid'));
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.reminderCombo.setValue(record.get('reminderid'));
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.setValue(record.get('durationvalue'));
                                    window['PlanApp'].taskFormPanel.percentageSlider.setValue(parseInt(record.get('percentage')));
                                    
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.setValue('hours', record.get('durationtype') == 'H');
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.setValue('days', record.get('durationtype') != 'H');
                                    
                                    window['PlanApp'].taskFormPanel.tabPanel.extraPanel.originRadioGroup.setValue(record.get('activityorigin'));
                                    window['PlanApp'].taskFormPanel.tabPanel.extraPanel.typeRadioGroup.setValue(record.get('activitytype'));
                                    window['PlanApp'].taskFormPanel.tabPanel.extraPanel.isprincipalCheckBox.setValue(record.get('isprincipal'));
                                    window['PlanApp'].taskFormPanel.tabPanel.extraPanel.subtaskCombo.setRawValue(record.get('subtask'));
                                    
                                    var i = 0;
                                    
                                    var repetition = '';
                                    if(record.get('dailyrepetition') && record.get('dailyrepetition') != ''){
                                        repetition = Ext.decode(record.get('dailyrepetition'));
                                        
                                        window['PlanApp'].taskDailyRepetitionFormPanel.amountField.setValue(repetition.dailyRepetitionDaysAmount);
                                        
                                        window['PlanApp'].taskDailyRepetitionFormPanel.typeRadioGroup.setValue('naturaldays', repetition.dailyRepetitionDaysType == '0');
                                        window['PlanApp'].taskDailyRepetitionFormPanel.typeRadioGroup.setValue('laboraldays', repetition.dailyRepetitionDaysType == '1');
                                    }
                                    if(record.get('weeklyrepetition') && record.get('weeklyrepetition') != ''){
                                        repetition = Ext.decode(record.get('weeklyrepetition'));
                                        
                                        window['PlanApp'].taskWeeklyRepetitionFormPanel.amountField.setValue(repetition.weeklyRepetitionWeeksAmount);           
                                        for (i = 0; i < Date.dayNames.length; i++)
                                            window['PlanApp'].taskdaysCheckBoxGroup.setValue('weeklyRepetitionDay'+i, repetition.weeklyRepetitionDays.indexOf(i+'') >-1);
                                    
                                    }
                                    if(record.get('monthlyrepetition') && record.get('monthlyrepetition') != ''){
                                        repetition = Ext.decode(record.get('monthlyrepetition'));
                                        
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.fixedvariantRadio.setValue(repetition.monthlyRepetitionVariant == '0');
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.dayField.setValue(repetition.monthlyRepetitionDayNumber);
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.jumpField.setValue(repetition.monthlyRepetitionVariantNonOrdMonthJump);
                                        
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.ordinalvariantRadio.setValue(repetition.monthlyRepetitionVariant == '1');
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.ordinaldayCombo.setValue(repetition.monthlyRepetitionOrdinalDay);
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.dayCombo.setValue(repetition.monthlyRepetitionDay);
                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.jumpField.setValue(repetition.monthlyRepetitionVariantOrdMonthJump);
                                    }
                                    if(record.get('yearlyrepetition') && record.get('yearlyrepetition') != ''){
                                        repetition = Ext.decode(record.get('yearlyrepetition'));
                                        
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.fixedvariantRadio.setValue(repetition.yearlyRepetitionVariant == '0');
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.monthCombo.setValue(repetition.yearlyRepetitionVariantNonOrdMonth);
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.dayField.setValue(repetition.yearlyRepetitionVariantNonOrdDayNumber);
                                        
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.ordinalvariantRadio.setValue(repetition.yearlyRepetitionVariant == '1');
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.ordinaldayCombo.setValue(repetition.yearlyRepetitionVariantOrd);
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.dayCombo.setValue(repetition.yearlyRepetitionVariantOrdDay);
                                        window['PlanApp'].taskYearlyRepetitionFormPanel.monthCombo.setValue(repetition.yearlyRepetitionVariantOrdMonth);
                                    }
                                    
                                    if(record.get('breakingrepetition') && record.get('breakingrepetition') != ''){
                                        var breaking = Ext.decode(record.get('breakingrepetition'));
                                        
                                        window['PlanApp'].taskBreakingRepetitionFormPanel.numbervariantRadio.setValue(breaking.breakingRepetitionVariant == '0');
                                        window['PlanApp'].taskBreakingRepetitionFormPanel.numbervariantField.setValue(breaking.breakingRepetitionNumberAmount);
                                        
                                        window['PlanApp'].taskBreakingRepetitionFormPanel.datevariantRadio.setValue(breaking.breakingRepetitionVariant == '1');
                                        window['PlanApp'].taskBreakingRepetitionFormPanel.datevariantField.setValue(Date.parseDate(breaking.breakingRepetitionDate, Date.patterns.NonISO8601Short));
                                    }
                                    
                                    window['PlanApp'].taskPanel.participantsGridPanel.getStore().removeAll();
                                    if(record.get('participants') && record.get('participants')!=''){
                                        var participants = Ext.decode(record.get('participants'));
                                        for(i = 0; participants && i < participants.length; i++)
                                            window['PlanApp'].taskPanel.participantsGridPanel.getStore().add(new Ext.data.Record(participants[i]));
                                    }
                                    
                                    // 
                                    window['PlanApp'].taskPanel.relatedsGridPanel.getStore().removeAll();
                                    if(record.get('relateds') && record.get('relateds')!=''){
                                        var relateds = Ext.decode(record.get('relateds'));															
                                        if(relateds)
                                            for(i = 0; relateds && i < relateds.length; i++)
                                                window['PlanApp'].taskPanel.relatedsGridPanel.getStore().add(new Ext.data.Record(relateds[i]));
                                    }
                                    
                                    showWindowFn(record);
                                };
                                
                                var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
                                if (record){                                    
                                    if(config.app_logueduserdata.personid == record.get('created_by')){
                                        App.mask.hide();
                                        var loadFn = function(id){
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/task/request/method/load',
                                                params: {
                                                    component: 'single',
                                                    id: id
                                                },
                                                callback : function(options, success, response) {
                                                    var task = Ext.decode(response.responseText);
                                                    
                                                    var record = new Ext.data.Record(task.data[0]);
                                                    record.set('name', record.get('Event').name);
                                                    record.set('start', Date.parseDate(record.get('Event').start, Date.patterns.ISO8601Long));
                                                    record.set('end', Date.parseDate(record.get('Event').end, Date.patterns.ISO8601Long));
                                                    record.set('local', record.get('Local').name);
                                                    record.set('tasktype', record.get('Tasktype').name);
                                                    record.set('taskstatus', record.get('Taskstatus').Calendar.name);
                                                    record.set('responsible', record.get('Person').sfGuardUser.first_name + ' ' + record.get('Person').sfGuardUser.last_name);
                                                    
                                                    loadTask(record);
                                                }
                                            }); 
                                        };
                                        
                                        switch(record.get('composition')){
                                            case '01': // multiparticipant task
                                                Ext.Msg.show({
                                                    title: bundle.getMsg('app.msg.warning.title'),
                                                    msg: bundle.getMsg('task.action.multiparttask'),
                                                    buttons: {
                                                        yes:bundle.getMsg('task.action.serialtask.editserie'),
                                                        no:bundle.getMsg('task.action.serialtask.edittask'),
                                                        cancel:bundle.getMsg('app.form.cancel')
                                                    },
                                                    fn: function(btn, text){
                                                        switch(btn){
                                                            case 'yes':
                                                                App.mask.show();
                                                                loadFn(record.get('multipartid'));
                                                                break;
                                                            case 'no':
                                                                App.mask.show();
                                                                loadTask(record);
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    },
                                                    animEl: 'elId',
                                                    icon: Ext.MessageBox.QUESTION
                                                }); 
                                                break;
                                            case '10': // serial task
                                                Ext.Msg.show({
                                                    title: bundle.getMsg('app.msg.warning.title'),
                                                    msg: bundle.getMsg('task.action.serialtask'),
                                                    buttons: {
                                                        yes:bundle.getMsg('task.action.serialtask.editserie'),
                                                        no:bundle.getMsg('task.action.serialtask.edittask'),
                                                        cancel:bundle.getMsg('app.form.cancel')
                                                    },
                                                    fn: function(btn, text){
                                                        switch(btn){
                                                            case 'yes':
                                                                App.mask.show();
                                                                loadFn(record.get('serialid'));
                                                                break;
                                                            case 'no':
                                                                App.mask.show();
                                                                loadTask(record);
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    },
                                                    animEl: 'elId',
                                                    icon: Ext.MessageBox.QUESTION
                                                }); 
                                                break;
                                            default:
                                                loadTask(record);
                                                break;
                                        }
                                    }
                                    else
                                        loadTask(record);
                                }
                                else 
                                    showWindowFn(record);
                            };
                            
                            syncLoad([
                                window['TasktypeApp'].comboStore,
                                window['TaskstatusApp'].comboStore,
                                window['LocalApp'].comboStore,
                                window['ReminderApp'].comboStore
                                ], finalFn);
                        
                        }
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject) {
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            var deleteFn = function(array){
                                                var plan = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                                                
                                                var msg = App.mask.msg;
                                                if(array.length > 1)
                                                    App.mask.msg = bundle.getMsg('task.action.deleting.findingelements');
                                                else
                                                    App.mask.msg = bundle.getMsg('task.action.deleting.oneelement')+'...';
                                                App.mask.show();
                                                
                                                new Ext.data.Connection().request({
                                                    url: config.app_host+'/task/request/method/explore',
                                                    params: {
                                                        plan: plan.get('id'),
                                                        ids: Ext.encode(array)
                                                    },
                                                    method: 'POST',
                                                    callback : function(options, success, response) {
                                                        App.mask.hide();
                                                        App.mask.msg = msg;
                                                        
                                                        var json = Ext.decode(response.responseText);
                                                        
                                                        var elements = json.message;
                                                        var total = elements.length;
                                                        
                                                        var processElement = function(elements, nextFn, response) {
                                                            var start = (elements.length-total)*-1;
                                                            if(elements && elements.length > 0){
                                                                if(elements.length > 1){
                                                                    Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('task.action.deleting.description'), start+1, total) + '...');
                                                                    Ext.MessageBox.updateProgress(start/total, ' ');
                                                                }
                                                                
                                                                new Ext.data.Connection().request({
                                                                    url: config.app_host + '/task/request/method/delete',
                                                                    method: 'POST',
                                                                    params: {
                                                                        plan: plan.get('id'),
                                                                        ids: '['+elements[0]+']'
                                                                    },
                                                                    callback : function(options, success, response) { 
                                                                        elements.splice(0,1);
                                                                        nextFn(elements, processElement, response);
                                                                    }
                                                                });
                                                            }
                                                            else{
                                                                Ext.MessageBox.hide(); 
                                                                requestSuccessful(response);
                                                                window['PlanApp'].taskGridPanel.getStore().load();
                                                            }
                                                        };
                                                        
                                                        processElement(elements, processElement);
                                                    }
                                                });
                                            
                                            };
                                            
                                            var records = window['PlanApp'].taskGridPanel.getSelectionModel().getSelections();
                                            
                                            var array = new Array(); 
                                            var serial = new Array(); 
                                            var multipart = new Array(); 
                                            for (var i = 0; i < records.length; i++){
                                                array.push(records[i].get('id'));
                                                if(records[i].get('serialid'))
                                                    serial.push(records[i].get('serialid'));
                                                if(records[i].get('multipartid'))
                                                    multipart.push(records[i].get('multipartid'));
                                            }
                                            
                                            
                                            var composition = '';
                                            if(serial.length > 0)
                                                composition += '1';
                                            else
                                                composition += '0';
                                            if(multipart.length > 0)
                                                composition += '1';
                                            else
                                                composition += '0';
                                            
                                            switch(composition){
                                                case '01': // multiparticipant task
                                                    Ext.Msg.show({
                                                        title: bundle.getMsg('app.msg.warning.title'),
                                                        msg: bundle.getMsg('task.action.multiparttask'),
                                                        buttons: {
                                                            yes: bundle.getMsg('task.action.serialtask.deleteserie'),
                                                            no: bundle.getMsg('task.action.serialtask.deletetask'),
                                                            cancel:bundle.getMsg('app.form.cancel')
                                                        },
                                                        fn: function(btn, text){
                                                            switch(btn){
                                                                case 'yes':
                                                                    array = multipart;
                                                                case 'no':
                                                                    deleteFn(array);
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        },
                                                        animEl: 'elId',
                                                        icon: Ext.MessageBox.QUESTION
                                                    });
                                                    break;
                                                case '10': // serial task
                                                    Ext.Msg.show({
                                                        title: bundle.getMsg('app.msg.warning.title'),
                                                        msg: bundle.getMsg('task.action.serialtask'),
                                                        buttons: {
                                                            yes: bundle.getMsg('task.action.serialtask.deleteserie'),
                                                            no: bundle.getMsg('task.action.serialtask.deletetask'),
                                                            cancel:bundle.getMsg('app.form.cancel')
                                                        },
                                                        fn: function(btn, text){
                                                            switch(btn){
                                                                case 'yes':
                                                                    array = serial;
                                                                case 'no':
                                                                    deleteFn(array);
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        },
                                                        animEl: 'elId',
                                                        icon: Ext.MessageBox.QUESTION
                                                    });
                                                    break;
                                                case '11': // serial & multiparticipant task
                                                    Ext.Msg.show({
                                                        title: bundle.getMsg('app.msg.warning.title'),
                                                        msg: bundle.getMsg('task.action.serialmultiparttask'),
                                                        buttons: {
                                                            yes: bundle.getMsg('task.action.serialtask.deleteserie'),
                                                            no: bundle.getMsg('task.action.serialtask.deletetask'),
                                                            cancel:bundle.getMsg('app.form.cancel')
                                                        },
                                                        fn: function(btn, text){
                                                            switch(btn){
                                                                case 'yes':
                                                                    array = serial;
                                                                    for(var i = 0; i < multipart.length; i++)
                                                                        array.push(multipart[i]);
                                                                case 'no':
                                                                    deleteFn(array);
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        },
                                                        animEl: 'elId',
                                                        icon: Ext.MessageBox.QUESTION
                                                    });
                                                    break;
                                                default:
                                                    deleteFn(array);
                                                    break;
                                            }
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }, 100, this);
                        }
                    }
                }, '->', {
                    ref: '../filtersBtn',
                    text: bundle.getMsg('app.form.applyfilters'),
                    iconCls: Ext.ux.Icon('table_gear'),
                    menu: {
                        items:[{
                            text: bundle.getMsg('task.action.filter.day'),
                            listeners: {
                                click: function() {
                                    window['PlanApp'].taskGridPanel.filters.getFilter('start').setValue({
                                        'on': new Date()
                                    });
                                    window['PlanApp'].taskGridPanel.filters.getFilter('start').setActive(true);
                                    window['PlanApp'].taskGridPanel.filters.reload();
                                }
                            }
                        },{
                            text: bundle.getMsg('task.action.filter.month'),
                            listeners: {
                                click: function() {
                                    var date = new Date();
                                    
                                    window['PlanApp'].taskGridPanel.filters.getFilter('start').setValue({
                                        'after': date.getFirstDateOfMonth().add(Date.DAY, -1)
                                    });
                                    window['PlanApp'].taskGridPanel.filters.getFilter('start').setActive(true);
                                    
                                    window['PlanApp'].taskGridPanel.filters.getFilter('end').setValue({
                                        'before': date.getLastDateOfMonth().add(Date.DAY, 1)
                                    });
                                    window['PlanApp'].taskGridPanel.filters.getFilter('end').setActive(true);
                                    
                                    window['PlanApp'].taskGridPanel.filters.reload();
                                }
                            }
                        },'-',{
                            text: bundle.getMsg('task.action.filter.all'),
                            listeners: {
                                click: function(button) {
                                    window['PlanApp'].taskGridPanel.filters.clearFilters();
                                //                                    Ext.fly(window['PlanApp'].taskInfoTextItem.getEl()).update('');
                                }
                            }
                        }]
                    }
                },{
                    text: bundle.getMsg('task.action.importtasks'),
                    iconCls: Ext.ux.Icon('database_refresh'),
                    ref: '../importBtn',
                    disabled: true,
                    listeners: {
                        click: function(button, eventObject) { 
                            var plan = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                            
                            function submitFn(button, eventObject, callback){
                                var tasks = new Array();
                                var records = window['PlanApp'].importGridPanel.getSelectionModel().getSelections();
                                if (records.length==0){
                                    Ext.Msg.show({
                                        title: bundle.getMsg('app.msg.error.title'),
                                        msg: bundle.getMsg('task.action.importtasks.errorselectone'),
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                    return;
                                }
                                for (var i = 0; i < records.length; i++)
                                    tasks.push(records[i].data);
                                
                                var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                    msg: bundle.getMsg('task.action.importtasks.process')+'...'
                                });
                                mask.show();
                                
                                new Ext.data.Connection().request({
                                    url: config.app_host + '/task/request/method/importtasks',
                                    params: {
                                        tasks: Ext.encode(tasks),
                                        plan: plan.get('id')
                                    },
                                    callback : function(options, success, response) {
                                        mask.hide();
                                        var object = Ext.util.JSON.decode(response.responseText);	
                                        Ext.Msg.show({
                                            title: bundle.getMsg('app.msg.info.title'),
                                            msg: bundle.getMsg(object.message),
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        window['PlanApp'].taskGridPanel.getStore().load({
                                            params:{
                                                start: window['PlanApp'].gridPanel.getBottomToolbar().cursor
                                            }
                                        });
                                        window['PlanApp'].window.hide();
                                    }
                                });
                            }
                            
                            function cancelFn(){
                                window['PlanApp'].window.hide();
                            }
                            
                            window['PlanApp'].window = App.showWindow(bundle.getMsg('task.action.importtasks.comment')+'...', 800, 450, window['PlanApp'].importGridPanel, 
                                submitFn,
                                cancelFn,
                                button.getEl(),
                                false,
                                false,
                                false,
                                true
                                );
                            //        , manageable, printFn, menuConfig, hideApply, afterShow
                            
                            window['PlanApp'].importGridPanel.getStore().load({
                                params:{
                                    plan: plan.get('parentid')
                                }
                            });
                        
                        }
                    }
                }],
                
                bbar: new Ext.PagingToolbar({
                    pageSize: parseInt(config.app_elementsongrid),
                    store: this.taskStore,
                    plugins: new Ext.ux.ProgressBarPager(),
                    items: [{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['PlanApp'].taskGridPanel.filters.clearFilters();
                        } 
                    }],
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.form.bbar.displaymsg'),
                    emptyMsg: String.format(bundle.getMsg('app.form.bbar.emptymsg'), bundle.getMsg('app.form.elements').toLowerCase())
                }),
                
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:false, 
                    listeners: {
                        selectionchange : function(selectionModel) {
                            var records = selectionModel.getSelections();
                            var deleteable = true;
                            for (var i = 0; i < records.length; i++){
                                if (!records[i].get('deleteable'))
                                    deleteable = false;
                            }
                            
                            selectionModel.grid.removeBtn.setDisabled(!deleteable || selectionModel.getCount() < 1); 
                            selectionModel.grid.updateBtn.setDisabled(selectionModel.getCount() != 1);
                        }
                    }
                })
            });
            
            this.taskGridPanel.getView().getRowClass = function(record, index, rowParams, store) {
                if (!record.get('deleteable')) 
                    return 'row-italic';
            }; 
            
            
            var sm = new Ext.grid.CheckboxSelectionModel();
            this.importStore = new Ext.data.GroupingStore({
                url: config.app_host + '/task/request/method/load',
                baseParams:{
                    component: 'grid',
                    limit: config.app_elementsongrid * 5
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: this.afterTasksLoad
                },
                groupField: 'taskstatus'
            });
            this.importGridPanel = this.taskGridPanel.cloneConfig({
                iconCls: '',
                title: '',
                tools:[],
                tbar:[],
                bbar:[],
                sm: sm,
                autoExpandColumn: 'importtaskcolname',
                store: this.importStore,
                plugins: [this.taskFilters],
                columns: [sm, {
                    id:'importtaskcolname', 
                    header: bundle.getMsg('app.form.name'), 
                    width: 270, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Long1, 
                    header: bundle.getMsg('schedule.field.begin.date'), 
                    width: 130, 
                    sortable: true, 
                    dataIndex: 'start'
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Long1, 
                    header: bundle.getMsg('schedule.field.end.date'), 
                    width: 130, 
                    sortable: true, 
                    dataIndex: 'end'
                },{
                    header: bundle.getMsg('task.field.responsible'), 
                    width: 170, 
                    sortable: true, 
                    dataIndex: 'responsible'
                },{
                    header: bundle.getMsg('taskstatus.field.label'), 
                    width: 120, 
                    sortable: true, 
                    hidden: true, 
                    dataIndex: 'taskstatus'
                }],
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                })
            });
            
            
            /* ------------------------------ dailyRepetitionFormPanel ------------------------------ */
            this.taskDailyRepetitionFormPanel = new Ext.FormPanel({
                flex: 1,
                labelWidth: 30,
                title: bundle.getMsg('task.field.programmingdetail.daily'),
                iconCls: Ext.ux.Icon('calendar_view_day'),
                hidden: true,
                labelAlign: 'right',
                bodyStyle:'padding:5px 5px 0',	
                items: [{
                    xtype: 'compositefield',
                    fieldLabel: bundle.getMsg('task.field.each.label'),
                    anchor: '-20',
                    items: [{
                        ref: '../amountField',
                        xtype: 'spinnerfield',
                        name: 'dailyRepetitionDaysAmount',
                        value: 1,
                        minValue: 1,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;',
                        width: 15
                    },{
                        ref: '../typeRadioGroup',
                        xtype: 'radiogroup',
                        itemCls: 'x-check-group-alt',
                        width: 200,
                        items: [{
                            boxLabel: (bundle.getMsg('task.field.each.naturaldays')).toLowerCase(), 
                            id: 'naturaldays', 
                            name: 'dailyRepetitionDaysType', 
                            inputValue: 0, 
                            checked: true
                        },{
                            boxLabel: (bundle.getMsg('task.field.each.laboraldays')).toLowerCase(), 
                            id: 'laboraldays', 
                            name: 'dailyRepetitionDaysType', 
                            inputValue: 1
                        }]
                    }]
                }]
            });
            
            
            /* ------------------------------ weeklyRepetitionFormPanel ------------------------------ */
            this.taskdaysCheckBoxGroup = new Ext.form.CheckboxGroup({
                itemCls: 'x-check-group-alt',
                flex: 1,
                columns: 1,
                items: []
            });
            
            
            for (var i = 0; i < Date.dayNames.length; i++){
                window['PlanApp'].taskdaysCheckBoxGroup.items.push({
                    boxLabel: Date.dayNames[i], 
                    id: 'weeklyRepetitionDay'+i,
                    name: 'weeklyRepetitionDays',
                    inputValue: i,
                    checked: false
                });
            }
            
            this.taskWeeklyRepetitionFormPanel = new Ext.FormPanel({
                flex: 1,
                labelWidth: 75,
                title: bundle.getMsg('task.field.programmingdetail.weekly'),
                iconCls: Ext.ux.Icon('calendar_view_week'),
                hidden: true,
                bodyStyle:'padding:5px 5px 0',	
                items: [{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: bundle.getMsg('task.field.repeateach.label'),
                    items: [{
                        ref: '../amountField',
                        xtype: 'spinnerfield',
                        name: 'weeklyRepetitionWeeksAmount',
                        value: 1,
                        minValue: 1,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+(bundle.getMsg('task.field.repeat.weekly')).toLowerCase(),
                        width: 90
                    },window['PlanApp'].taskdaysCheckBoxGroup]
                }]
            });
            
            
            /* ------------------------------ monthlyRepetitionFormPanel ------------------------------ */
            this.taskMonthlyRepetitionFormPanel = new Ext.FormPanel({
                flex: 1,
                labelWidth: 75,
                title: bundle.getMsg('task.field.programmingdetail.monthly'),
                iconCls: Ext.ux.Icon('calendar'),
                hidden: true,
                bodyStyle:'padding:5px 5px 0',	
                items: [{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: bundle.getMsg('task.field.repeat.label'),
                    items: [{
                        ref: '../fixedvariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('app.languaje.find.ondate'), 
                        name: 'monthlyRepetitionVariant', 
                        inputValue: 0, 
                        checked: true,
                        width: 50,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('monthlyRepetitionVariantOrdMonthJump').setDisabled(checked);
                                Ext.getCmp('monthlyRepetitionDay').setDisabled(checked);
                                Ext.getCmp('monthlyRepetitionOrdinalDay').setDisabled(checked);
                                if(checked){
                                    Ext.getCmp('monthlyRepetitionVariantOrdMonthJump').reset();
                                    Ext.getCmp('monthlyRepetitionDay').reset();
                                    Ext.getCmp('monthlyRepetitionOrdinalDay').reset();
                                }
                            }
                        }
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;',
                        width: 10
                    },{
                        ref: '../dayField',
                        xtype: 'spinnerfield',
                        id: 'monthlyRepetitionDayNumber',
                        name: 'monthlyRepetitionDayNumber',
                        value: 1,
                        minValue: 1,
                        maxValue: 31,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + bundle.getMsg('task.field.ofeach.label'),
                        width: 80
                    },{
                        ref: '../jumpField',
                        xtype: 'spinnerfield',
                        id: 'monthlyRepetitionVariantNonOrdMonthJump',
                        name: 'monthlyRepetitionVariantNonOrdMonthJump',
                        value: 1,
                        minValue: 1,
                        maxValue: 12,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (bundle.getMsg('task.field.ofeach.month')).toLowerCase(),
                        width: 60
                    }]
                },{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        ref: '../ordinalvariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('task.field.on.label'), 
                        name: 'monthlyRepetitionVariant', 
                        inputValue: 1, 
                        width: 30,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('monthlyRepetitionDayNumber').setDisabled(checked);
                                Ext.getCmp('monthlyRepetitionVariantNonOrdMonthJump').setDisabled(checked);
                                if(checked){
                                    Ext.getCmp('monthlyRepetitionDayNumber').reset();
                                    Ext.getCmp('monthlyRepetitionVariantNonOrdMonthJump').reset();
                                }
                            }
                        }
                    },new Ext.form.ComboBox({
                        ref: '../ordinaldayCombo',
                        editable: false,
                        id: 'monthlyRepetitionOrdinalDay',
                        name: 'monthlyRepetitionOrdinalDay',
                        store: new Ext.data.ArrayStore({
                            fields: ['id', 'comment', 'name'],
                            data : [
                            ['PER', '1er', 'Primer'],
                            ['SDO', '2do', 'Segundo'],
                            ['TRO', '3er', 'Tercer'],
                            ['CTO', '4to', 'Cuarto'],
                            ['UMO', 'Ultimo', 'Ultimo'],
                            ]
                        }),
                        valueField: 'id',
                        displayField: 'name',
                        tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                        typeAhead: true,
                        disabled: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        width: 100
                    }),new Ext.form.ComboBox({
                        ref: '../dayCombo',
                        id: 'monthlyRepetitionDay',
                        name: 'monthlyRepetitionDay',
                        editable: false,
                        store: window['ScheduleApp'].daysStore,
                        valueField: 'id',
                        displayField: 'name',
                        tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                        typeAhead: true,
                        disabled: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        width: 90
                    }),{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;' + (bundle.getMsg('task.field.ofeach.label')).toLowerCase(),
                        width: 60
                    },{
                        ref: '../jumpField',
                        xtype: 'spinnerfield',
                        id: 'monthlyRepetitionVariantOrdMonthJump',
                        name: 'monthlyRepetitionVariantOrdMonthJump',
                        value: 1,
                        minValue: 1,
                        maxValue: 12,
                        disabled: true,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (bundle.getMsg('task.field.ofeach.month')).toLowerCase(),
                        width: 60
                    }]
                }]
            });
            
            
            /* ------------------------------ yearlyRepetitionFormPanel ------------------------------ */ 
            this.taskYearlyRepetitionFormPanel = new Ext.FormPanel({
                flex: 1,
                labelWidth: 75,
                title: bundle.getMsg('task.field.programmingdetail.yearly'),
                iconCls: Ext.ux.Icon('calendar_view_month'),
                hidden: true,
                bodyStyle:'padding:5px 5px 0',	
                items: [{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: 'Repetir',
                    items: [{
                        ref: '../fixedvariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('task.field.onmonth.label'), 
                        name: 'yearlyRepetitionVariant', 
                        inputValue: 0, 
                        checked: true,
                        width: 75,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('yearlyRepetitionVariantOrd').setDisabled(checked);
                                Ext.getCmp('yearlyRepetitionVariantOrdDay').setDisabled(checked);
                                Ext.getCmp('yearlyRepetitionVariantOrdMonth').setDisabled(checked);
                                if(checked){
                                    Ext.getCmp('yearlyRepetitionVariantOrd').reset();
                                    Ext.getCmp('yearlyRepetitionVariantOrdDay').reset();
                                    Ext.getCmp('yearlyRepetitionVariantOrdMonth').reset();
                                }
                            }
                        }
                    },new Ext.form.ComboBox({
                        ref: '../monthCombo',
                        id: 'yearlyRepetitionVariantNonOrdMonth',
                        name: 'yearlyRepetitionVariantNonOrdMonth',
                        editable: false,
                        store: window['ScheduleApp'].monthsStore,
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
                            change: function(combo, newValue, oldValue ){
                                var dt = new Date(newValue+'/10/2007 03:05:01 PM GMT-0600');
                                Ext.getCmp('yearlyRepetitionVariantNonOrdDayNumber').reset();
                                Ext.getCmp('yearlyRepetitionVariantNonOrdDayNumber').setMaxValue(dt.getDaysInMonth());
                            }
                        }
                    }),{
                        xtype: 'displayfield', 
                        value: '&nbsp;' + (bundle.getMsg('app.languaje.find.ondate')).toLowerCase(),
                        width: 40
                    },{
                        ref: '../dayField',
                        xtype: 'spinnerfield',
                        id: 'yearlyRepetitionVariantNonOrdDayNumber',
                        name: 'yearlyRepetitionVariantNonOrdDayNumber',
                        value: 1,
                        minValue: 1,
                        maxValue: 31,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    }]
                },{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        ref: '../ordinalvariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('task.field.on.label'), 
                        name: 'yearlyRepetitionVariant', 
                        inputValue: 1, 
                        width: 30,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('yearlyRepetitionVariantNonOrdMonth').setDisabled(checked);
                                Ext.getCmp('yearlyRepetitionVariantNonOrdDayNumber').setDisabled(checked);
                                if(checked){
                                    Ext.getCmp('yearlyRepetitionVariantNonOrdMonth').reset();
                                    Ext.getCmp('yearlyRepetitionVariantNonOrdDayNumber').reset();
                                }
                            }
                        }
                    },new Ext.form.ComboBox({
                        ref: '../ordinaldayCombo',
                        id: 'yearlyRepetitionVariantOrd',
                        name: 'yearlyRepetitionVariantOrd',
                        editable: false,
                        store: new Ext.data.ArrayStore({
                            fields: ['id', 'comment', 'name'],
                            data : [
                            ['PER', '1er', 'Primer'],
                            ['SDO', '2do', 'Segundo'],
                            ['TRO', '3er', 'Tercer'],
                            ['CTO', '4to', 'Cuarto'],
                            ['UMO', 'Ultimo', 'Ultimo'],
                            ]
                        }),
                        valueField: 'id',
                        displayField: 'name',
                        tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                        typeAhead: true,
                        disabled: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        width: 100
                    }),new Ext.form.ComboBox({
                        ref: '../dayCombo',
                        id: 'yearlyRepetitionVariantOrdDay',
                        name: 'yearlyRepetitionVariantOrdDay',
                        editable: false,
                        store: window['ScheduleApp'].daysStore,
                        valueField: 'id',
                        displayField: 'name',
                        tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                        typeAhead: true,
                        disabled: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        width: 90
                    }),{
                        xtype: 'displayfield', 
                        value: '&nbsp;' + (bundle.getMsg('app.form.since')).toLowerCase(),
                        width: 20
                    },new Ext.form.ComboBox({
                        ref: '../monthCombo',
                        id: 'yearlyRepetitionVariantOrdMonth',
                        name: 'yearlyRepetitionVariantOrdMonth',
                        editable: false,
                        store: window['ScheduleApp'].monthsStore,
                        valueField: 'id',
                        displayField: 'name',
                        tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                        typeAhead: true,
                        disabled: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        width: 90
                    })]
                }]
            });
            
            
            /* ------------------------------ breakingRepetitionFormPanel ------------------------------ */ 
            this.taskBreakingRepetitionFormPanel = new Ext.FormPanel({
                height: 85,
                labelWidth: 1,
                title: bundle.getMsg('task.field.programmingdetail.break'),
                iconCls: Ext.ux.Icon('calendar_delete'),
                hidden: true,
                bodyStyle:'padding:5px 5px 0',	
                items: [{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        ref: '../numbervariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('task.field.breakrepetitionafter.label'), 
                        name: 'breakingRepetitionVariant',
                        inputValue: 0, 
                        checked: true,
                        width: 150,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('breakingRepetitionDate').setDisabled(checked);
                                if(checked)
                                    Ext.getCmp('breakingRepetitionDate').reset();
                            }
                        }
                    },{
                        ref: '../numbervariantField',
                        xtype: 'spinnerfield',
                        id: 'breakingRepetitionNumberAmount',
                        name: 'breakingRepetitionNumberAmount',
                        value: 2,
                        minValue: 1,
                        allowDecimals: false,
                        accelerate: true,
                        width: 60
                    },{
                        xtype: 'displayfield', 
                        value: '&nbsp;&nbsp;&nbsp;&nbsp;' + (bundle.getMsg('task.field.breakrepetition.times')).toLowerCase(),
                        width: 70
                    }]
                },{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        ref: '../datevariantRadio',
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('task.field.breakrepetitionon.label'), 
                        name: 'breakingRepetitionVariant', 
                        inputValue: 1, 
                        width: 90,
                        listeners: {
                            check: function(radio, checked){
                                Ext.getCmp('breakingRepetitionNumberAmount').setDisabled(checked);
                                if(checked)
                                    Ext.getCmp('breakingRepetitionNumberAmount').reset();
                            }
                        }
                    },{
                        ref: '../datevariantField',
                        xtype:'datefield',
                        id: 'breakingRepetitionDate',
                        name: 'breakingRepetitionDate',
                        disabled: true,
                        value: new Date(),
                        width: 110
                    }]
                }]
            });
            
            
            this.taskFormPanel = new Ext.FormPanel({
                labelWidth: 75,
                height: 270,
                labelAlign: 'top',
                url: config.app_host + '/task/request/method/presave',
                bodyStyle:'padding:5px 5px 0',						
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    border: false,
                    defaults:{
                        border:false
                    }, 
                    items:[{
                        columnWidth:.6,
                        layout: 'form',
                        items: [{
                            ref: '../../nameField',
                            xtype:'textfield',
                            name: 'name',
                            allowBlank: false,
                            fieldLabel: bundle.getMsg('app.form.title')+'<span style="color:red;"><sup>*</sup></span>', 
                            emptyText: bundle.getMsg('task.field.name.hint'),
                            anchor:'-20'
                        }]
                    },{
                        columnWidth:.4,
                        layout: 'form',
                        items: [new Ext.form.ClearableCombo({
                            ref: '../../typeCombo',
                            fieldLabel: bundle.getMsg('tasktype.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                            anchor: '-20',
                            store: window['TasktypeApp'].comboStore,
                            valueField: 'id', 
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{name}:{comment}" class="x-combo-list-item">{name}</div></tpl>',
                            typeAhead: true,
                            forceSelection: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            emptyText: bundle.getMsg('app.form.select'),
                            allowBlank: false,
                            triggerConfig: {
                                tag:'span', 
                                cls:'x-form-twin-triggers', 
                                style:'padding-right:2px',
                                cn:[{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger"
                                },{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger x-form-plus-trigger"
                                }]
                            },
                            listeners: {
                                focus: function(combo) {
                                    if(!combo.readOnly && !combo.disabled)
                                        combo.getStore().load();
                                }
                            },
                            onTrigger2Click: function(){ 
                                var obj = new Object;
                                obj.params = [window['PlanApp'].taskFormPanel.typeCombo];
                                obj.fn = function(params){
                                    var cmp = params[0];
                                    var obj = params[1];
                                    var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                        msg: bundle.getMsg('app.layout.loading')+'...'
                                    });
                                    mask.show();
                                    cmp.store.load({
                                        callback: function(records, options, success){
                                            cmp.setValue(obj.data.id);
                                            mask.hide();
                                        }
                                    });
                                };
                                window['TasktypeApp'].showWindow(window['PlanApp'].window.getEl(), true, obj);
                            }
                        })]
                    }]
                },{
                    layout:'column',
                    border: false,
                    defaults:{
                        border:false
                    }, 
                    items:[{
                        columnWidth:.4,
                        layout: 'form',
                        items: [new Ext.form.ClearableCombo({
                            ref: '../../responsibleCombo',
                            fieldLabel : bundle.getMsg('task.field.responsible')+'<span style="color:red;"><sup>*</sup></span>',
                            name : 'responsible',
                            anchor:'-20',
                            store: window['UserApp'].comboStore,
                            minChars: config.app_characteramounttofind,
                            displayField: 'full_name',
                            tpl: new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                '<img src="{picture}" height="30px" align="right" hspace="10" /><h3>{full_name}</h3>{email_address}',
                                '</div></tpl>'
                                ),
                            typeAhead: false,
                            emptyText: bundle.getMsg('app.form.typehere'),
                            loadingText: bundle.getMsg('app.msg.wait.searching'),
                            pageSize: config.app_elementsongrid/2,
                            itemSelector: 'div.search-item',
                            triggerConfig: {
                                tag:'span', 
                                cls:'x-form-twin-triggers', 
                                style:'padding-right:2px',
                                cn:[{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    hidden: true, 
                                    cls: "x-form-trigger"
                                },{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger x-form-plus-trigger"
                                }]
                            },
                            listeners: {
                                select: function(combo, record, index ){
                                    this.setValue(record.get('full_name'));	
                                    window['PlanApp'].responsibleRecord = record.data;
                                    window['PlanApp'].responsibleRecord.id =record.get('id');
                                    this.collapse(); 
                                },
                                beforequery: function(queryEvent) {
                                    window['PlanApp'].prepareDistinctFilter(queryEvent);                                    
                                    this.setValue(queryEvent.query);
                                },
                                blur: function(field) {
                                    if(field.getRawValue() == '')
                                        window['PlanApp'].responsibleRecord = false;
                                    else {
                                        var record = field.getStore().getAt(field.getStore().find('full_name',field.getRawValue(), 0, true, true));								 
                                        if(record&&record.get('full_name') == field.getRawValue())
                                            window['PlanApp'].responsibleRecord = record;
                                        else 
                                            window['PlanApp'].responsibleRecord = false;
                                    }
                                    this.store.baseParams.groups = '';
                                }
                            },
                            onTrigger2Click: function(){ 
                                var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                    msg: bundle.getMsg('app.layout.loading')+'...'
                                });
                                mask.show();
                                
                                var finalFn = function(){
                                    mask.hide();
                                    
                                    var obj = new Object;
                                    obj.params = [window['PlanApp'].taskFormPanel.responsibleCombo];
                                    obj.fn = function(params){
                                        var cmp = params[0];
                                        var obj = params[1];
                                        
                                        cmp.setValue(obj.data.first_name + ' ' + obj.data.last_name);
                                        window['PlanApp'].responsibleRecord = obj.data;
                                    
                                    };
                                    
                                    window['UserApp'].showWindow(window['PlanApp'].window.getEl(), false, true, obj);
                                };
                                
                                syncLoad([
                                    window['UserApp'].groupsComboStore,
                                    window['UserApp'].permissionsComboStore,
                                    window['UserApp'].comboStore
                                    ], finalFn);
                            },
                            allowBlank: false
                        })]
                    },{
                        columnWidth:.2,
                        layout: 'form',
                        items: [new Ext.form.ClearableCombo({
                            ref: '../../statusCombo',
                            fieldLabel: bundle.getMsg('taskstatus.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                            anchor: '-20',
                            store: window['TaskstatusApp'].comboStore,
                            valueField: 'id', 
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{name}" class="x-combo-list-item"><div class="mail-calendar-cat-color ext-cal-picker-icon" style="background-color:#{customcolor}"></div>{name}</div></tpl>',
                            typeAhead: true,
                            forceSelection: true,
                            mode: 'taskstatus',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            emptyText: bundle.getMsg('app.form.select'),
                            allowBlank: false,
                            triggerConfig: {
                                tag:'span', 
                                cls:'x-form-twin-triggers', 
                                style:'padding-right:2px',
                                cn:[{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger"
                                },{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger x-form-plus-trigger"
                                }]
                            },
                            listeners: {
                                focus: function(combo) {
                                    var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
                                    if (record)
                                        combo.getStore().load({
                                            params:{
                                                entityid: config.app_entityid,
                                                restriction: 'next',
                                                id: record.get('taskstatusid')
                                            }
                                        });
                                    else
                                        combo.getStore().load({
                                            params:{
                                                entityid: config.app_entityid,
                                                restriction: 'onlyparents'
                                            }
                                        });
                                }
                            },
                            onTrigger2Click: function(){ 
                                var obj = new Object;
                                obj.params = [window['PlanApp'].taskFormPanel.statusCombo];
                                obj.fn = function(params){
                                    var cmp = params[0];
                                    var obj = params[1];
                                    var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                        msg: bundle.getMsg('app.layout.loading')+'...'
                                    });
                                    mask.show();
                                    cmp.store.load({
                                        callback: function(records, options, success){
                                            cmp.setValue(obj.data.id);
                                            mask.hide();
                                        }
                                    });
                                };
                                window['TaskstatusApp'].showWindow(window['PlanApp'].window.getEl(), true, obj);
                            }
                        })]
                    },{
                        columnWidth:.22,
                        layout: 'form',
                        items: [new Ext.form.ClearableCombo({
                            ref: '../../localCombo',
                            fieldLabel: bundle.getMsg('local.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                            anchor: '-20',
                            store: window['LocalApp'].comboStore,
                            valueField: 'id', 
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{name}:{comment}" class="x-combo-list-item">{name}</div></tpl>',
                            typeAhead: true,
                            forceSelection: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            emptyText: bundle.getMsg('app.form.select'),
                            allowBlank: false,
                            triggerConfig: {
                                tag:'span', 
                                cls:'x-form-twin-triggers', 
                                style:'padding-right:2px',
                                cn:[{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger"
                                },{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger x-form-plus-trigger"
                                }]
                            },
                            listeners: {
                                focus: function(combo) {
                                    combo.getStore().load({
                                        params:{
                                            entityid: config.app_entityid
                                        }
                                    });
                                }
                            },
                            onTrigger2Click: function(){ 
                                var obj = new Object;
                                obj.params = [window['PlanApp'].taskFormPanel.localCombo];
                                obj.fn = function(params){
                                    var cmp = params[0];
                                    var obj = params[1];
                                    var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                        msg: bundle.getMsg('app.layout.loading')+'...'
                                    });
                                    mask.show();
                                    cmp.store.load({
                                        callback: function(records, options, success){
                                            cmp.setValue(obj.data.id);
                                            mask.hide();
                                        }
                                    });
                                };
                                window['LocalApp'].showWindow(window['PlanApp'].window.getEl(), true, obj);
                            }
                        })]
                    },{
                        columnWidth:.18,
                        layout: 'form',
                        items: [new Ext.Slider({
                            ref: '../../percentageSlider',
                            fieldLabel: bundle.getMsg('app.form.percentage'),
                            increment: 5,
                            minValue: 0,
                            maxValue: 100,
                            plugins: new Ext.slider.Tip({
                                getText: function(thumb){
                                    return window['PlanApp'].percentageRenderer(thumb.value);
                                }
                            }),
                            anchor:'-20'
                        })]
                    }]
                }, new Ext.TabPanel({
                    ref: 'tabPanel',
                    height: 150,
                    anchor: '-20',
                    defaults:{
                        autoHeight:false
                    }, 
                    deferredRender: false,		
                    plain: true,
                    activeTab: 0,
                    items:[{
                        ref: 'timePanel',
                        title: bundle.getMsg('schedule.field.label')+'<x style="color:red;"><sup>*</sup></x>',	
                        iconCls: Ext.ux.Icon('clock'),
                        layout: 'form',
                        bodyStyle:'padding:5px 10px 0',
                        items: [{
                            layout:'column',
                            border: false,
                            defaults:{
                                border:false
                            }, 
                            items:[{
                                columnWidth:.19,
                                layout: 'form',
                                items: [{
                                    ref: '../../manuallyprogrammedCheckBox',
                                    xtype: 'checkbox',
                                    name: 'manuallyprogrammed',
                                    boxLabel: bundle.getMsg('task.field.programed.label')+': ', 
                                    listeners: {
                                        check: function(checkbox, checked) {
                                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.setDisabled(checked);
                                            
                                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.setDisabled(!checked);
                                            
                                            if(checked)
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.reset();
                                            else
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.reset();
                                        }
                                    }
                                }]
                            },{
                                columnWidth:.58,
                                layout: 'form',
                                items: [{
                                    ref: '../../periodRangeField',
                                    disabled: true,
                                    xtype: 'sgarqbase.daterangefield',
                                    fieldLabel: bundle.getMsg('event.field.period')+'<span style="color:red;"><sup>*</sup></span>',
                                    toText: bundle.getMsg('calendar.field.toText'),
                                    allDayText: bundle.getMsg('calendar.field.allDayText'),
                                    dateFormat: Date.patterns.NonISO8601Short,
                                    singleLine: true,
                                    showAllDay: false,
                                    allowBlank: false,
                                    anchor:'-20',
                                    listeners: {
                                        change: window['PlanApp'].validateDateRange
                                    }
                                
                                }]
                            },{
                                columnWidth:.23,
                                layout: 'form',
                                items: [{
                                    ref: '../../durationCompositeField',
                                    xtype: 'compositefield',
                                    fieldLabel: bundle.getMsg('task.field.period.label')+'<span style="color:red;"><sup>*</sup></span>', 
                                    combineErrors: false,
                                    anchor:'-10',
                                    items: [{
                                        ref: 'amountField',
                                        xtype: 'spinnerfield',
                                        name: 'duration',
                                        allowBlank:false,
                                        // value: 0,
                                        minValue: 1,
                                        allowDecimals: false,
                                        accelerate: true,
                                        flex: 1,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                window['PlanApp'].validateDurationVsPeriod();
                                            }
                                        }
                                    },{
                                        ref: 'periodRadioGroup',
                                        xtype: 'radiogroup',
                                        width: 110,
                                        items: [{
                                            boxLabel: bundle.getMsg('task.field.period.hours'), 
                                            id: 'hours', 
                                            name: 'task_period', 
                                            inputValue: false
                                        },{
                                            boxLabel: bundle.getMsg('task.field.period.days'), 
                                            id: 'days',
                                            name: 'task_period', 
                                            inputValue: true, 
                                            checked: true
                                        }]
                                    }]
                                }]
                            }]
                        },{
                            layout:'column',
                            border: false,
                            defaults:{
                                border:false
                            }, 
                            items:[{
                                columnWidth: .19,
                                layout: 'form',
                                items: [{
                                    ref: '../../periodicCheckBox',
                                    xtype: 'checkbox',
                                    boxLabel: bundle.getMsg('task.field.frequency.label')+': ', 
                                    name: 'periodictask',
                                    listeners: {
                                        check: function(checkbox, checked) {
                                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.reset();
                                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.setDisabled(!checked);
                                            if(checked) {
                                                window['PlanApp'].validateDurationVsPeriod();
                                            }else{
                                                window['PlanApp'].window.setHeight(360);
                                            }
                                        }
                                    }
                                }]
                            },{
                                columnWidth: .58,
                                layout: 'form',
                                items: [{
                                    ref: '../../frequencyRadioGroup',
                                    disabled: true,
                                    xtype: 'radiogroup',
                                    itemCls: 'x-check-group-alt',
                                    anchor: '-20',
                                    items: [{
                                        boxLabel: bundle.getMsg('task.field.frequency.daily'), 
                                        id: 'frequencyTypeDaily', 
                                        name: 'frequencyType', 
                                        inputValue: 1
                                    },{
                                        boxLabel: bundle.getMsg('task.field.frequency.weekly'), 
                                        id: 'frequencyTypeWeekly', 
                                        name: 'frequencyType', 
                                        inputValue: 2
                                    },{
                                        boxLabel: bundle.getMsg('task.field.frequency.monthly'), 
                                        id: 'frequencyTypeMonthly', 
                                        name: 'frequencyType', 
                                        inputValue: 3
                                    },{
                                        boxLabel: bundle.getMsg('task.field.frequency.yearly'), 
                                        id: 'frequencyTypeYearly', 
                                        name: 'frequencyType', 
                                        inputValue: 4
                                    }],
                                    listeners: {
                                        change : function(radioGroup, radio) {
                                            window['PlanApp'].taskDailyRepetitionFormPanel.hide();
                                            window['PlanApp'].taskWeeklyRepetitionFormPanel.hide();
                                            window['PlanApp'].taskMonthlyRepetitionFormPanel.hide();
                                            window['PlanApp'].taskYearlyRepetitionFormPanel.hide();
                                            window['PlanApp'].taskBreakingRepetitionFormPanel.hide();
                                            if(radio)
                                                switch(radio.inputValue){
                                                    case 1:
                                                        window['PlanApp'].window.setHeight(510);
                                                        window['PlanApp'].taskDailyRepetitionFormPanel.show();
                                                        window['PlanApp'].taskBreakingRepetitionFormPanel.show();
                                                        break;
                                                    case 2:
                                                        window['PlanApp'].window.setHeight(640);
                                                        window['PlanApp'].taskWeeklyRepetitionFormPanel.show();
                                                        window['PlanApp'].taskBreakingRepetitionFormPanel.show();
                                                        break;
                                                    case 3:
                                                        window['PlanApp'].window.setHeight(540);
                                                        window['PlanApp'].taskMonthlyRepetitionFormPanel.show();
                                                        window['PlanApp'].taskBreakingRepetitionFormPanel.show();
                                                        break;
                                                    case 4:
                                                        window['PlanApp'].window.setHeight(540);
                                                        window['PlanApp'].taskYearlyRepetitionFormPanel.show();
                                                        window['PlanApp'].taskBreakingRepetitionFormPanel.show();
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            if(window['PlanApp'].window){
                                                window['PlanApp'].window.doLayout();
                                                window['PlanApp'].window.center();
                                            }
                                        }
                                    }
                                }]
                            },{
                                columnWidth: .23,
                                layout: 'form',
                                items: [new Ext.form.ClearableCombo({
                                    ref: '../../reminderCombo',
                                    fieldLabel: bundle.getMsg('reminder.field.label'),
                                    anchor: '-20',
                                    store: window['ReminderApp'].comboStore,
                                    valueField: 'id', 
                                    displayField: 'name',
                                    tpl: '<tpl for="."><div ext:qtip="{name}:{comment}" class="x-combo-list-item">{name}</div></tpl>',
                                    typeAhead: true,
                                    forceSelection: true,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    selectOnFocus:true,
                                    emptyText: bundle.getMsg('app.form.select'),
                                    triggerConfig: {
                                        tag:'span', 
                                        cls:'x-form-twin-triggers', 
                                        style:'padding-right:2px',
                                        cn:[{
                                            tag: "img", 
                                            src: Ext.BLANK_IMAGE_URL, 
                                            cls: "x-form-trigger"
                                        },{
                                            tag: "img", 
                                            src: Ext.BLANK_IMAGE_URL, 
                                            cls: "x-form-trigger x-form-plus-trigger"
                                        }]
                                    },
                                    listeners: {
                                        focus: function(combo) {
                                            combo.getStore().load();
                                        }
                                    },
                                    onTrigger2Click: function(){ 
                                        var obj = new Object;
                                        obj.params = [window['PlanApp'].taskFormPanel.tabPanel.timePanel.reminderCombo];
                                        obj.fn = function(params){
                                            var cmp = params[0];
                                            var obj = params[1];
                                            var mask = new Ext.LoadMask(window['PlanApp'].window.getEl(), {
                                                msg: bundle.getMsg('app.layout.loading')+'...'
                                            });
                                            mask.show();
                                            cmp.store.load({
                                                callback: function(records, options, success){
                                                    cmp.setValue(obj.data.id);
                                                    mask.hide();
                                                }
                                            });
                                        };
                                        window['ReminderApp'].showWindow(window['PlanApp'].window.getEl(), true, obj);
                                    }
                                })]
                            }]
                        }]
                    },{
                        ref: 'extraPanel',
                        title: bundle.getMsg('task.field.extratab'),
                        iconCls: Ext.ux.Icon('ccsm', 'myicons'),
                        labelWidth: 75,
                        height: 240,
                        labelAlign: 'top',
                        bodyStyle:'padding:5px 10px 0',
                        items: [{
                            layout:'column',
                            border: false,
                            defaults:{
                                border:false
                            }, 	
                            items:[{
                                columnWidth:.6,
                                layout: 'form',
                                items:[new Ext.form.ComboBox({
                                    ref: '../../subtaskCombo',
                                    fieldLabel: bundle.getMsg('task.field.subtask'),
                                    store: window['PlanApp'].taskComboStore,
                                    anchor: '-30', 
                                    emptyText: bundle.getMsg('app.form.typehere'),
                                    minChars: config.app_characteramounttofind,
                                    displayField: 'subtask',
                                    typeAhead: false,
                                    loadingText: bundle.getMsg('app.msg.wait.searching'),
                                    pageSize: config.app_elementsongrid / 2,
                                    hideTrigger: true,
                                    tpl: new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                        '<img src="{picture}" height="30px" align="right" hspace="10" title="{responsible}"/><h3>{name}</h3><b>{local}</b><br/>{[this.renderDate(values.start)]} - {[this.renderDate(values.end)]}',
                                        '</div></tpl>', {
                                            renderDate: function(date){
                                                return date.format(Date.patterns.NonISO8601Long1);
                                            }
                                        }),
                                    itemSelector: 'div.search-item',
                                    listeners: {
                                        select: function(combo, record, index ){
                                            this.setValue(record.get('name'));
                                            window['PlanApp'].subtaskRecord = record; 
                                            window['PlanApp'].taskComboStore.baseParams.distinct = '';
                                            this.collapse();
                                        },
                                        beforequery: function(queryEvent) { 
                                            delete queryEvent.combo.lastQuery;
                                            var elements = new Array();
                                            
                                            var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
                                            if (record){ 
                                                var element = new Object;
                                                element.id = record.get('id');
                                                elements.push(element); 
                                            }
                                            
                                            window['PlanApp'].taskComboStore.baseParams.distinct = Ext.encode(elements);
                                            
                                            this.setValue(queryEvent.query);
                                        },
                                        blur: function(field) {	 
                                            if(field.getRawValue() == '')
                                                window['PlanApp'].subtaskRecord = false;
                                            else {
                                                var record = field.getStore().getAt(field.getStore().find('name',field.getRawValue(), 0, true, true));								 
                                                if(record && record.get('name') == field.getRawValue())
                                                    window['PlanApp'].subtaskRecord = record;
                                                else 
                                                    window['PlanApp'].subtaskRecord = false;
                                            }
                                            window['PlanApp'].taskComboStore.baseParams.distinct = '';
                                        }
                                    }
                                }),{
                                    ref: '../../isprincipalCheckBox',
                                    xtype:'checkbox',
                                    name: 'isprincipal',
                                    boxLabel: bundle.getMsg('task.field.isprincipal')                               
                                }]
                            },{
                                columnWidth:.2,
                                layout: 'form',
                                items:[{
                                    ref: '../../originRadioGroup',
                                    xtype: 'radiogroup',
                                    fieldLabel: bundle.getMsg('task.field.origin'),
                                    itemCls: 'x-check-group-alt',
                                    columns: 1,
                                    items: [{
                                        id: 'own', 
                                        boxLabel: bundle.getMsg('task.field.origin.own'), 
                                        name: 'activityorigin', 
                                        inputValue: 1, 
                                        checked: true
                                    }, {
                                        id: 'external', 
                                        boxLabel: bundle.getMsg('task.field.origin.external'), 
                                        name: 'activityorigin', 
                                        inputValue: 2
                                    }]
                                }]
                            },{
                                columnWidth:.2,
                                layout: 'form',
                                items:[{
                                    ref: '../../typeRadioGroup',
                                    xtype: 'radiogroup',
                                    fieldLabel: bundle.getMsg('tasktype.field.label'),
                                    itemCls: 'x-check-group-alt',
                                    columns: 1,
                                    items: [{
                                        boxLabel: bundle.getMsg('task.field.type.activity'), 
                                        name: 'activitytype', 
                                        inputValue: 1, 
                                        checked: true
                                    }, {
                                        boxLabel: bundle.getMsg('task.field.type.insurance'), 
                                        name: 'activitytype', 
                                        inputValue: 2
                                    }]
                                }]
                            }]
                        }],
                        listeners: {
                            activate: function(panel) {
                                panel.doLayout();
                            }
                        }
                    }]
                })]
            });
            
            this.taskPanel = new Ext.TabPanel({
                activeTab: 0,
                anchor:'-20',
                plain:true,			
                items:[{
                    ref: 'generalPanel',
                    title: bundle.getMsg('app.form.generaldata'),
                    layout:'vbox',
                    border: false,
                    defaults:{
                        border:false
                    }, 
                    layoutConfig: {
                        align : 'stretch',
                        pack: 'start'
                    },
                    items: [window['PlanApp'].taskFormPanel, window['PlanApp'].taskDailyRepetitionFormPanel, window['PlanApp'].taskWeeklyRepetitionFormPanel, window['PlanApp'].taskMonthlyRepetitionFormPanel, window['PlanApp'].taskYearlyRepetitionFormPanel, window['PlanApp'].taskBreakingRepetitionFormPanel]
                }, new Ext.grid.GridPanel({
                    ref: 'participantsGridPanel',
                    stripeRows: true,
                    autoExpandColumn: 'colcode',
                    title: bundle.getMsg('task.field.participants'),
                    iconCls: Ext.ux.Icon('group'),
                    store: new Ext.data.Store({
                        reader: new Ext.data.JsonReader()
                    }),
                    view: new Ext.grid.GridView({
                        markDirty: false
                    }),
                    sm: new Ext.grid.RowSelectionModel({
                        listeners: {
                            selectionchange: function(selectionModel) {
                                window['PlanApp'].taskPanel.participantsGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                            }
                        }
                    }),
                    columns: [{
                        id:'colcode',
                        header: bundle.getMsg('app.form.longname'),
                        width: 120, 
                        sortable: true, 
                        dataIndex: 'full_name'
                    },{
                        header: bundle.getMsg('task.field.assitancerequired'),
                        width: 120, 
                        sortable: true, 
                        align: 'center',
                        renderer: function(val) {
                            if(val == 1)
                                return '<img src="'+config.app_host+'/images/icons/famfamfam/tick.png" height="12"/>';
                            return '';
                        },
                        dataIndex: 'readonly'
                    }],
                    tbar: [{
                        xtype: 'tbtext',
                        name: 'textCombo',
                        text: bundle.getMsg('app.languaje.findby.label')+'&nbsp;'
                    },{
                        ref: '../findbyRadioGroup',
                        xtype: 'radiogroup',
                        name: 'planfindByTypeRadioGroup',
                        width: 125,
                        layout: 'form',
                        itemCls: 'x-check-group-alt',
                        items: [{									
                            checked: true,
                            name: 'planfindByTypeRadioGroup',
                            boxLabel: bundle.getMsg('team.field.person'), 
                            inputValue: 1
                        },{
                            name: 'planfindByTypeRadioGroup',
                            boxLabel: bundle.getMsg('group.field.label'), 
                            inputValue: 2
                        }],
                        listeners: {
                            change: function(radioGroup, radio) {
                                if(radio)
                                    switch(radio.inputValue) {
                                        case 1:
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.setVisible(true);
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.setVisible(false);
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.reset();
                                            break;
                                        
                                        case 2:
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.setVisible(true);
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.setVisible(false);
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.reset();		
                                            break;
                                        default:
                                            break;
                                    }	
                            }
                        }
                    }, new Ext.form.ComboBox({
                        ref: '../findbypersonCombo',
                        store: window['UserApp'].comboStore,
                        name: 'planfindbypersonCombo',
                        width: 270,
                        hidden: false,
                        emptyText: bundle.getMsg('app.form.typehere'),
                        minChars: config.app_characteramounttofind,
                        displayField: 'full_name',
                        typeAhead: false,
                        loadingText: bundle.getMsg('app.msg.wait.searching'),
                        pageSize: config.app_elementsongrid/2,
                        hideTrigger:true,
                        allowBlank:false,
                        tpl: new Ext.XTemplate(
                            '<tpl for="."><div class="search-item">',
                            '<img src="{picture}" height="30px" align="right" hspace="10" /><h3>{full_name}</h3>{email_address}',
                            '</div></tpl>'
                            ),
                        itemSelector: 'div.search-item',
                        listeners: {
                            select: function(combo, record, index ){
                                window['PlanApp'].recordPerson = record;
                                window['UserApp'].comboStore.baseParams.distinct = '';
                                this.collapse();
                            },
                            beforequery: function(queryEvent) { 
                                window['PlanApp'].prepareDistinctFilter(queryEvent);                                
                                this.setValue(queryEvent.query);
                            },
                            blur: function(field) {		
                                if(field.getRawValue() == '')
                                    window['PlanApp'].recordPerson = false;
                                else {
                                    var record = field.getStore().getAt(field.getStore().find('full_name',field.getRawValue(), 0, true, true));								 
                                    if(record && record.get('full_name') == field.getRawValue())
                                        window['PlanApp'].recordPerson = record;
                                    else 
                                        window['PlanApp'].recordPerson = false;
                                }
                                window['UserApp'].comboStore.baseParams.distinct = '';
                            }
                        }
                    }), new Ext.form.ComboBox({
                        ref: '../findbyteamCombo',
                        fieldLabel : bundle.getMsg('plan.field.parent'),
                        store: window['TeamApp'].comboStore,
                        name: 'planfindbyteamCombo',
                        width: 270,
                        //editable: false,
                        hidden: true,				
                        emptyText: bundle.getMsg('app.form.typehere'),
                        minChars: config.app_characteramounttofind,
                        displayField: 'name',
                        typeAhead: false,
                        loadingText: bundle.getMsg('app.msg.wait.searching'),
                        pageSize: config.app_elementsongrid/2,
                        hideTrigger: true,
                        //triggerAction: 'all',
                        forceSelection: true,
                        tpl: new Ext.XTemplate(
                            '<tpl for="."><div class="search-item">',
                            '<h3>{name}</h3>',
                            '{comment}',
                            '</div></tpl>'
                            ),
                        itemSelector: 'div.search-item',
                        listeners: {
                            select: function(combo, record, index ){
                                window['PlanApp'].recordTeam = record;
                                this.collapse();
                            },
                            blur: function(field) {
                                if(field.getRawValue() == '')
                                    window['PlanApp'].recordTeam = false;
                                else {
                                    var record = field.getStore().getAt(field.getStore().find('name',field.getRawValue(), 0, true, true));								 
                                    if(record&&record.get('name') == field.getRawValue())
                                        window['PlanApp'].recordTeam = record;
                                    else 
                                        window['PlanApp'].recordTeam = false;
                                }
                            }
                        }
                    }), '->', {
                        tooltip: bundle.getMsg('app.form.addrow'),
                        iconCls: Ext.ux.Icon('table_row_insert'),
                        listeners: {
                            click: function(button, eventObject) {
                                if((window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo && window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.isValid() && window['PlanApp'].recordPerson) || (window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo && window['PlanApp'].recordTeam)) 								
                                    if(window['PlanApp'].taskPanel.participantsGridPanel.findbyRadioGroup.items.items[1].checked) {
                                        var mask = new Ext.LoadMask(window['PlanApp'].taskPanel.participantsGridPanel.getEl(), {
                                            msg: bundle.getMsg('app.layout.loading')+'...'
                                        });
                                        
                                        mask.show();
                                        
                                        var elements = new Array();
                                        
                                        var element = new Object;
                                        if(window['PlanApp'].responsibleRecord && window['PlanApp'].responsibleRecord.id!=''){
                                            element.id = window['PlanApp'].responsibleRecord.id;
                                            elements.push(element);
                                        }
                                        window['PlanApp'].taskPanel.participantsGridPanel.getStore().each(function(record){
                                            element = new Object;
                                            element.id = record.get('id');
                                            elements.push(element);
                                        });
                                        
                                        new Ext.data.Connection().request({
                                            url: config.app_host + '/person/request/method/load',
                                            params:{
                                                component: 'combo',
                                                type: 'persons',
                                                teamid: window['PlanApp'].recordTeam.get('id'),
                                                plan: 1,
                                                distinct: Ext.encode(elements)
                                            },
                                            reader: new Ext.data.JsonReader(),
                                            callback: function(options, success, response) {
                                                var persons = Ext.decode(response.responseText);
                                                for(var i = 0; i < persons.data.length; i++) {
                                                    if(window['PlanApp'].taskPanel.participantsGridPanel.getStore().findExact('username', persons.data[i].sfGuardUser.username) != -1)
                                                        window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.reset();
                                                    else {
                                                        persons.data[i].full_name = persons.data[i].name;
                                                        persons.data[i].email_address = persons.data[i].sfGuardUser.email_address;
                                                        window['PlanApp'].taskPanel.participantsGridPanel.getStore().add(new Ext.data.Record(persons.data[i]));
                                                    }
                                                }
                                                window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.reset();
                                                mask.hide();
                                            }
                                        });
                                    }
                                    else{
                                        if(window['PlanApp'].taskPanel.participantsGridPanel.getStore().findExact('username', window['PlanApp'].recordPerson.get('username')) != -1)
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.markInvalid(bundle.getMsg('plan.combo.notification.existrecord'));
                                        else {
                                            window['PlanApp'].taskPanel.participantsGridPanel.getStore().add(window['PlanApp'].recordPerson);
                                            window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.reset();
                                        }
                                    }
                            }
                        }
                    },{
                        ref: '../removeBtn',
                        tooltip: bundle.getMsg('app.form.deleterow'),
                        disabled: true,
                        iconCls: Ext.ux.Icon('table_row_delete'),
                        listeners: {
                            click: function(button, eventObject) {
                                var records = window['PlanApp'].taskPanel.participantsGridPanel.getSelectionModel().getSelections();
                                window['PlanApp'].taskPanel.participantsGridPanel.getStore().remove(records);
                            }
                        }
                    }],
                    listeners:{
                        keypress:function(e){		
                            if(e.getKey()==46)
                                window['PlanApp'].deleteParticipant();
                        },
                        rowdblclick : function(grid, rowIndex){
                            var records = grid.getSelectionModel().getSelections();
                            grid.getStore().remove(records);
                            for(var i = 0; i < records.length; i++){
                                records[i].set('readonly', !records[i].get('readonly'));
                                grid.getStore().insert(rowIndex, records[i]);
                            }
                        }
                    }
                }), new Ext.grid.GridPanel({
                    ref: 'relatedsGridPanel',
                    stripeRows: true,
                    autoExpandColumn: 'colcode',
                    title: bundle.getMsg('task.field.relateds'),
                    iconCls: Ext.ux.Icon('page_link'),
                    store: new Ext.data.Store({
                        reader: new Ext.data.JsonReader(),
                        listeners: {
                            add: function(store, records, index) { 
                                var dt;
                                if(window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startDate.isValid() &&
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.isValid() &&
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endDate.isValid() &&
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.isValid())
                                    for(var i = 0; i < records.length; i++){
                                        switch(records[i].get('relation')){
                                            case 'CC':
                                                dt = new Date(records[i].get('start'));
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startDate.setValue(dt);
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.setValue(dt.format(Date.patterns.ShortTime));
                                                break;
                                            case 'CF':
                                                dt = new Date(records[i].get('start'));
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endDate.setValue(dt);
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.setValue(dt.format(Date.patterns.ShortTime));
                                                break;
                                            case 'FC':
                                                dt = new Date(records[i].get('end'));
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startDate.setValue(dt);
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.setValue(dt.format(Date.patterns.ShortTime));
                                                break;
                                            case 'FF':
                                                dt = new Date(records[i].get('end'));
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endDate.setValue(dt);
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.setValue(dt.format(Date.patterns.ShortTime));
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                            }
                        }
                    }),
                    sm: new Ext.grid.RowSelectionModel({
                        listeners: {
                            selectionchange: function(selectionModel) {
                                window['PlanApp'].taskPanel.relatedsGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                            }
                        }
                    }),
                    columns: [{
                        id:'colcode',
                        header: bundle.getMsg('app.form.name'),
                        width: 120, 
                        sortable: true, 
                        dataIndex: 'name'
                    },{
                        xtype: 'datecolumn', 
                        format: Date.patterns.NonISO8601Long1, 
                        header: bundle.getMsg('schedule.field.begin.date'), 
                        width: 115, 
                        sortable: true, 
                        dataIndex: 'start'
                    },{
                        xtype: 'datecolumn', 
                        format: Date.patterns.NonISO8601Long1, 
                        header: bundle.getMsg('schedule.field.end.date'), 
                        width: 115, 
                        sortable: true, 
                        dataIndex: 'end'
                    },{
                        header: bundle.getMsg('task.field.relation'),
                        width: 120, 
                        sortable: true, 
                        dataIndex: 'relationcomment'
                    }],
                    tbar: [new Ext.Toolbar.TextItem(bundle.getMsg('task.field.label')+': '), new Ext.form.ComboBox({
                        ref: '../taskCombo',
                        store: window['PlanApp'].taskComboStore,
                        width: 440, 
                        emptyText: bundle.getMsg('app.form.typehere'),
                        minChars: config.app_characteramounttofind,
                        displayField: 'name',
                        typeAhead: false,
                        loadingText: bundle.getMsg('app.msg.wait.searching'),
                        pageSize: config.app_elementsongrid/2,
                        hideTrigger:true,
                        allowBlank:false,
                        tpl: new Ext.XTemplate(
                            '<tpl for="."><div class="search-item">',
                            '<img src="{picture}" height="30px" align="right" hspace="10" title="{responsible}"/><h3>{name}</h3><b>{local}</b><br/>{[this.renderDate(values.start)]} - {[this.renderDate(values.end)]}',
                            '</div></tpl>', {
                                renderDate: function(date){
                                    return date.format(Date.patterns.NonISO8601Long1);
                                }
                            }),
                        itemSelector: 'div.search-item',
                        listeners: {
                            select: function(combo, record, index ){
                                this.setValue(record.get('name'));
                                window['PlanApp'].relatedRecord = record; 
                                window['PlanApp'].taskComboStore.baseParams.distinct = '';
                                this.collapse();
                            },
                            beforequery: function(queryEvent) { 
                                delete queryEvent.combo.lastQuery;
                                var elements = new Array();
                                
                                var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
                                if (record){ 
                                    var element = new Object;
                                    element.id = record.get('id');
                                    elements.push(element); 
                                }
                                
                                window['PlanApp'].taskPanel.relatedsGridPanel.getStore().each(function(record){
                                    var element = new Object;
                                    element.id = record.get('id');
                                    elements.push(element);
                                });
                                
                                window['PlanApp'].taskComboStore.baseParams.distinct = Ext.encode(elements);
                                
                                this.setValue(queryEvent.query);
                            },
                            blur: function(field) {	 
                                if(field.getRawValue() == '')
                                    window['PlanApp'].relatedRecord = false;
                                else {
                                    var record = field.getStore().getAt(field.getStore().find('name',field.getRawValue(), 0, true, true));								 
                                    if(record && record.get('name') == field.getRawValue())
                                        window['PlanApp'].relatedRecord = record;
                                    else 
                                        window['PlanApp'].relatedRecord = false;
                                }
                                window['PlanApp'].taskComboStore.baseParams.distinct = '';
                            }
                        }
                    }),new Ext.Toolbar.TextItem('&nbsp;&nbsp;'+bundle.getMsg('task.field.relatedtype')+': '),new Ext.form.ComboBox({
                        ref: '../relationCombo',
                        editable: false,
                        width: 200, 
                        store: new Ext.data.ArrayStore({
                            fields: ['id', 'name', 'comment'],
                            data : [
                            ['CC', bundle.getMsg('task.field.relatedtype.cc'), bundle.getMsg('task.field.relatedtype.cc.comment')],
                            ['CF', bundle.getMsg('task.field.relatedtype.cf'), bundle.getMsg('task.field.relatedtype.cf.comment')],
                            ['FC', bundle.getMsg('task.field.relatedtype.fc'), bundle.getMsg('task.field.relatedtype.fc.comment')],
                            ['FF', bundle.getMsg('task.field.relatedtype.ff'), bundle.getMsg('task.field.relatedtype.ff.comment')],
                            ]
                        }),
                        valueField: 'id',
                        displayField: 'name',
                        tpl: new Ext.XTemplate('<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">',
                            '<img src="'+config.app_host+'/images/icons/myicons/{id}.png" height="20px" align="right" hspace="10"/><h3>{name}</h3>',
                            '</div></tpl>'),
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        emptyText: bundle.getMsg('app.form.select'),
                        allowBlank: false
                    }),'->',{
                        tooltip: bundle.getMsg('app.form.addrow'),
                        iconCls: Ext.ux.Icon('table_row_insert'),
                        listeners: {
                            click: function(button, eventObject) {
                                if(window['PlanApp'].taskPanel.relatedsGridPanel.taskCombo.isValid() && window['PlanApp'].taskPanel.relatedsGridPanel.relationCombo.isValid() && window['PlanApp'].relatedRecord){
                                    window['PlanApp'].relatedRecord.set('relation', window['PlanApp'].taskPanel.relatedsGridPanel.relationCombo.getValue());
                                    window['PlanApp'].relatedRecord.set('relationcomment', window['PlanApp'].taskPanel.relatedsGridPanel.relationCombo.getRawValue());
                                    
                                    window['PlanApp'].taskPanel.relatedsGridPanel.getStore().insert(window['PlanApp'].taskPanel.relatedsGridPanel.getStore().getCount(), window['PlanApp'].relatedRecord);
                                    
                                    window['PlanApp'].taskPanel.relatedsGridPanel.taskCombo.reset();
                                    window['PlanApp'].taskPanel.relatedsGridPanel.relationCombo.reset();
                                }
                            }
                        }
                    },{
                        ref: '../removeBtn',
                        tooltip: bundle.getMsg('app.form.deleterow'),
                        disabled: true,
                        iconCls: Ext.ux.Icon('table_row_delete'),
                        listeners: {
                            click: function(button, eventObject) {
                                window['PlanApp'].deleteRelated();
                            }
                        }
                    }],
                    listeners:{
                        keypress:function(e){		
                            if(e.getKey()==46)
                                window['PlanApp'].deleteRelated();
                        }
                    }
                }), {
                    ref: 'notesContainer',
                    title: bundle.getMsg('note.tab.label'),	
                    iconCls: Ext.ux.Icon('note'),
                    layout: 'fit',
                    items: [this.taskNotesPanel],
                    listeners: {
                        activate: function() {
                            var mask = new Ext.LoadMask(window['PlanApp'].taskNotesPanel.getEl(), {
                                msg: bundle.getMsg('app.layout.loading')+'...'
                            });
                            mask.show();
                            
                            var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
                            
                            window['PlanApp'].taskNotesPanel.items.items[0].getBottomToolbar().store.removeAll();
                            window['PlanApp'].taskNotesPanel.items.items[0].getBottomToolbar().store.baseParams.entityid = record ? 'task-'+record.id : '';
                            window['PlanApp'].taskNotesPanel.items.items[0].getBottomToolbar().store.load({
                                callback: function(){
                                    mask.hide();
                                }
                            });
                        }
                    }
                
                }]
            });
            
            this.cardPanel = new Ext.Panel({
                id: 'gridPanelPlan',
                layout:'card',
                activeItem: 0, // index or id
                border: false,
                items: [this.gridPanel, this.taskGridPanel],
                listeners: {
                    activate:function(panel){
                        if(panel.getLayout().activeItem.id == window['PlanApp'].gridPanel.id)
                            window['PlanApp'].gridPanel.fireEvent('activate', window['PlanApp'].gridPanel); 
                        else
                            panel.getLayout().setActiveItem(0); 
                    },
                    render:function(){
                        window['PlanApp'].taskShowWindow();
                        window['PlanApp'].window.hide();
                    }
                }
            });
        
        },
        
        getGanttParams : function(records){
            var obj = new Object;
            obj.data = '';
            obj.progress = '';
            obj.constrains = '';
            
            for (var i = 0; i < records.length; i++){
                var name = Ext.util.Format.ellipsis(records[i].get('Event').name, 45);
                var start = Date.parseDate(records[i].get('Event').start, Date.patterns.ISO8601Long);
                var end = Date.parseDate(records[i].get('Event').end, Date.patterns.ISO8601Long);
                if(obj.data == '')
                    obj.data = '['+records[i].get('id')+',0," '+name+'","'+start.format('Y-m-d')+'","'+end.format('Y-m-d')+'","'+records[i].get('responsible')+'"]';
                else
                    obj.data = obj.data+',['+records[i].get('id')+',0," '+name+'","'+start.format('Y-m-d')+'","'+end.format('Y-m-d')+'","'+records[i].get('responsible')+'"]';
                
                if(obj.progress == '')
                    obj.progress = '['+records[i].get('id')+','+records[i].get('percentage')/100+']';
                else
                    obj.progress = obj.progress+',['+records[i].get('id')+','+records[i].get('percentage')/100+']';
                
                if(records[i].get('relateds') && records[i].get('relateds')!=''){
                    var relateds = Ext.decode(records[i].get('relateds'));															
                    if(relateds)
                        for (var j = 0; relateds && j < relateds.length; j++)
                            switch(relateds[j].relation){
                                case 'CC':
                                    if(obj.constrains == '')
                                        obj.constrains = '['+records[i].get('id')+','+relateds[j].id+',0]';
                                    else
                                        obj.constrains = obj.constrains+',['+records[i].get('id')+','+relateds[j].id+',0]';
                                    break;
                                case 'CF':
                                    if(obj.constrains == '')
                                        obj.constrains = '['+records[i].get('id')+','+relateds[j].id+',1]';
                                    else
                                        obj.constrains = obj.constrains+',['+records[i].get('id')+','+relateds[j].id+',1]';
                                    break;
                                case 'FC':
                                    if(obj.constrains == '')
                                        obj.constrains = '['+records[i].get('id')+','+relateds[j].id+',2]';
                                    else
                                        obj.constrains = obj.constrains+',['+records[i].get('id')+','+relateds[j].id+',2]';
                                    break;
                                case 'FF':
                                    if(obj.constrains == '')
                                        obj.constrains = '['+records[i].get('id')+','+relateds[j].id+',3]';
                                    else
                                        obj.constrains = obj.constrains+',['+records[i].get('id')+','+relateds[j].id+',3]';
                                    break;
                                default:
                                    break;
                            }
                }
            }
            
            return obj;
        },
        
        deleteParticipant : function(){
            var records = window['PlanApp'].taskPanel.participantsGridPanel.getSelectionModel().getSelections();	
            window['PlanApp'].taskPanel.participantsGridPanel.getStore().remove(records);						
        },
        
        deleteRelated : function(){
            var records = window['PlanApp'].taskPanel.relatedsGridPanel.getSelectionModel().getSelections();
            window['PlanApp'].taskPanel.relatedsGridPanel.getStore().remove(records);					
        },
        
        updateTaskCost : function(){
        
        },
        
        taskShowWindow : function(animateTarget, hideApply, callback, afterShow){
            var resetFn = function(){
                window['PlanApp'].editingRecord = false;
                window['PlanApp'].subtaskRecord = false;
                
                var dt = new Date();
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startDate.setValue(dt.add(Date.YEAR, -10));
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endDate.setValue(dt.add(Date.YEAR, 10));
                
                window['PlanApp'].taskPanel.participantsGridPanel.getStore().removeAll();
                window['PlanApp'].taskPanel.relatedsGridPanel.getStore().removeAll();
                
                window['PlanApp'].taskPanel.participantsGridPanel.findbypersonCombo.reset();
                window['PlanApp'].taskPanel.participantsGridPanel.findbyteamCombo.reset();
                
                window['PlanApp'].taskPanel.relatedsGridPanel.taskCombo.reset();
                window['PlanApp'].taskPanel.relatedsGridPanel.relationCombo.reset();
                
                window['PlanApp'].forceplanMode = false;
                
                window['PlanApp'].taskNotesPanel.contentEditor.editor.reset();
                if(window['PlanApp'].taskNotesPanel.getLayout().setActiveItem)
                    window['PlanApp'].taskNotesPanel.getLayout().setActiveItem(0);
            };
            
            window['PlanApp'].window = App.showWindow(bundle.getMsg('task.window.title'), 860, 360, window['PlanApp'].taskPanel, 
                function(button, eventObject){
                    var record = window['PlanApp'].editingRecord;
                    
                    var daterage = window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.getValue();
                    if(window['PlanApp'].taskFormPanel.nameField.isValid() && 
                        window['PlanApp'].taskFormPanel.typeCombo.isValid() && 
                        window['PlanApp'].taskFormPanel.responsibleCombo.isValid() && 
                        window['PlanApp'].taskFormPanel.statusCombo.isValid() && 
                        window['PlanApp'].taskFormPanel.localCombo.isValid() && 
                        !window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.isValid() && (!daterage[0] || !daterage[1])
                            )
                        return;
                    
                    var participants = new Array();
                    window['PlanApp'].taskPanel.participantsGridPanel.getStore().each(function(record){
                        participants.push(record.data);
                    });
                    
                    var relateds = new Array();
                    window['PlanApp'].taskPanel.relatedsGridPanel.getStore().each(function(record){
                        relateds.push(record.data);
                    });
                    
                    var plan = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
					var frequency = window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.getValue();
					
                    window['PlanApp'].taskFormPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: record ? record.get('id') : '',
                            serialid: record ? record.get('serialid') : '',
                            multipartid: record ? record.get('multipartid') : '',
                            
                            entityid: config.app_entityid,
                            startdate: daterage[0] ? daterage[0].format(Date.patterns.NonISO8601Long) : '',
                            enddate: daterage[1] ? daterage[1].format(Date.patterns.NonISO8601Long): '',
                            
                            percentage: window['PlanApp'].taskFormPanel.percentageSlider.getValue(),
                            
                            responsible_id: window['PlanApp'].responsibleRecord && window['PlanApp'].responsibleRecord.id && window['PlanApp'].responsibleRecord.id != '' ? window['PlanApp'].responsibleRecord.id: '',
                            subtask_id: window['PlanApp'].subtaskRecord && window['PlanApp'].subtaskRecord.id && window['PlanApp'].subtaskRecord.id != '' ? window['PlanApp'].subtaskRecord.id : '',
                            
                            plan: plan && plan.get('id') != '' ? plan.get('id') : '',
                            institutional: plan && plan.get('virtual') === false ? 'true' : '',
                            
                            tasklocalid: window['PlanApp'].taskFormPanel.localCombo.getValue(),
                            taskstatusid: window['PlanApp'].taskFormPanel.statusCombo.getValue(),
                            tasktypeid: window['PlanApp'].taskFormPanel.typeCombo.getValue(),
                            reminderid: window['PlanApp'].taskFormPanel.tabPanel.timePanel.reminderCombo.getValue(),
                            
                            dailyRepetition: window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.getValue() && frequency && frequency.id == 'frequencyTypeDaily' ? Ext.encode(window['PlanApp'].taskDailyRepetitionFormPanel.getForm().getValues()) : '',
                            weeklyRepetition: window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.getValue() && frequency && frequency.id == 'frequencyTypeWeekly' ? Ext.encode(window['PlanApp'].taskWeeklyRepetitionFormPanel.getForm().getValues()) : '',
                            monthlyRepetition: window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.getValue() && frequency && frequency.id == 'frequencyTypeMonthly' ? Ext.encode(window['PlanApp'].taskMonthlyRepetitionFormPanel.getForm().getValues()) : '',
                            yearlyRepetition: window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.getValue() && frequency && frequency.id == 'frequencyTypeYearly' ? Ext.encode(window['PlanApp'].taskYearlyRepetitionFormPanel.getForm().getValues()) : '',
                            breakingRepetition: window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodicCheckBox.getValue() ? Ext.encode(window['PlanApp'].taskBreakingRepetitionFormPanel.getForm().getValues()) : '',
                            
                            participants: Ext.encode(participants),
                            relateds: Ext.encode(relateds),
                            
                            cost: window['PlanApp'].totalTask
                        },
                        success: function(form, action) {
                            var elements = action.result.data;
                            window['PlanApp'].saveTasksByElements(elements, participants, form, action, button, record, resetFn, callback);
                        
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    resetFn();
                    window['PlanApp'].taskFormPanel.getForm().reset();
                    window['PlanApp'].window.hide();
                }, 
                animateTarget, false, false, false, false, afterShow);
        },
        
        saveTasksByElements : function(elements, participants, form, action, button, record, resetFn, callback){
            if(!participants)
                participants = new Array(); 
            
            var total = elements.length;
                            
            var ids = new Array();
            var ids2delete = new Array();
            var uncompleted = new Array();
            var processElement = function(elements, nextFn, response) {
                var start = (elements.length-total)*-1;
                if(elements && elements.length > 0){
                    if(elements.length > 1){
						var totalvisual = total-(participants.length+1);
						var startvisual = start+1;
						if(startvisual>totalvisual)
							startvisual = totalvisual;
                        Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('task.action.saving.description'), startvisual, totalvisual) + '...');
                        Ext.MessageBox.updateProgress(start/total, ' ');
                    }
                        
                    if(elements[0].serialid && ids.length > 0)
                        elements[0].serialid = ids[elements[0].serialid-1];
                                    
                    if(elements[0].multipartid && ids.length > 0)
                        elements[0].multipartid = ids[elements[0].multipartid-1];
                                    
                    new Ext.data.Connection().request({
                        url: config.app_host + '/task/request/method/save',
                        method: 'POST',
                        params: {
                            element: Ext.encode(elements[0])
                        },
                        callback : function(options, success, response) { 
                            var object = Ext.util.JSON.decode(response.responseText);
                            if(!object.success){
                                uncompleted.push(elements[0]);
                                if(elements[0].serialid && elements[0].serialid > 0 && ids2delete.indexOf(elements[0].serialid) == -1)
                                    ids2delete.push(elements[0].serialid);
                                if(elements[0].multipartid && elements[0].multipartid > 0 && ids2delete.indexOf(elements[0].multipartid) == -1)
                                    ids2delete.push(elements[0].multipartid);
                            }
                                    
                            if(object.data){
                                ids.push(object.data.id);
                                                
                                if (object.data.mailline)
                                    executeMailline(Ext.util.JSON.decode(object.data.mailline), true);
                            }
                                            
                            elements.splice(0, 1);
                            nextFn(elements, processElement, response);
                        }
                    });
                }
                else {
                    //                    new Ext.data.Connection().request({
                    //                        url: config.app_host + '/task/request/method/delete',
                    //                        method: 'POST',
                    //                        params: {
                    //                            ids: Ext.encode(ids2delete)
                    //                        },
                    //                        callback : function(options, success, response) { 
                    Ext.MessageBox.hide(); 
                    
                    if(form && action)
                        checkSesionExpired(form, action);
                        
                    window['PlanApp'].taskGridPanel.getStore().load({
                        params:{
                            start: window['PlanApp'].taskGridPanel.getBottomToolbar().cursor
                        },
                        callback: function(records, options, success ){
                            if(uncompleted.length > 0)
                                console.log('uncomplete: ', uncompleted);
                        }
                    });
                                
                    if(form && action)
                        submitFormSuccessful('PlanApp', form, action, button, !record, resetFn, callback);
                    else
                        callback();
                //                        }
                //                    });
                }
            };
            processElement(elements, processElement);
        },
        
        validateDateRange : function(){
            window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.clearInvalid();
            var daterage = window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.getValue();
            if(!daterage[0] || !daterage[1])
                return;
            
            var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();	
            if(!window['PlanApp'].forceplanMode
                && window['PlanApp'].responsibleRecord && window['PlanApp'].responsibleRecord.id != '' 
                && window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.isValid()){
                new Ext.data.Connection().request({
                    url: config.app_host + '/task/request/method/validaterange',
                    params: {
                        startdate: daterage[0].format(Date.patterns.NonISO8601Long),
                        enddate: daterage[1].format(Date.patterns.NonISO8601Long),
                        taskid: record ? record.id:'',
                        entityid: config.app_entityid,
                        responsibleid: window['PlanApp'].responsibleRecord && window['PlanApp'].responsibleRecord.id && window['PlanApp'].responsibleRecord.id != '' ? window['PlanApp'].responsibleRecord.id : ''
                    },
                    failure: requestFailed,
                    success: function (response, options) {
                        var object = Ext.util.JSON.decode(response.responseText);
                        if(!object.success) { 
                            var msg = bundle.getMsg(object.message);
                            
                            switch(object.data){
                                case 's':
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startDate.markInvalid(msg);
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.markInvalid(msg);
                                    Ext.Base.msg(bundle.getMsg('app.msg.info.title'), msg);
                                    break;
                                case 'e':
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endDate.markInvalid(msg);
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.markInvalid(msg);
                                    Ext.Base.msg(bundle.getMsg('app.msg.info.title'), msg);
                                    break;
                                default:
                                    window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.markInvalid(msg);
                                    Ext.Base.msg(bundle.getMsg('app.msg.info.title'), msg);
                                    
                                    msg = ''; 
                                    var header = String.format(bundle.getMsg('task.duplicated.period')+':', object.data.length>1 ? 's' : '', object.data.length > 1 ? 'n' : '');
                                    var footer = bundle.getMsg('task.duplicated.period.confirm');
                                    for(var i = 0; i < object.data.length && i < 5; i++)
                                        if(msg == '')
                                            msg = String.format(bundle.getMsg('task.duplicated.period.detail'), i+1, object.data[i].Event.name, object.data[i].Creator.sfGuardUser.first_name + ' ' +object.data[i].Creator.sfGuardUser.last_name, object.data[i].Person.sfGuardUser.first_name + ' ' +object.data[i].Person.sfGuardUser.last_name);
                                        else
                                            msg = msg + '<br/>'+String.format(bundle.getMsg('task.duplicated.period.detail'), i+1, object.data[i].Event.name, object.data[i].Creator.sfGuardUser.first_name + ' ' +object.data[i].Creator.sfGuardUser.last_name, object.data[i].Person.sfGuardUser.first_name + ' ' +object.data[i].Person.sfGuardUser.last_name);
                                    
                                    Ext.Msg.show({
                                        title: bundle.getMsg('app.msg.warning.title'),
                                        msg: header+'<hr/><code>'+msg+'</code>'+'<hr/>'+footer,
                                        buttons: Ext.Msg.YESNO,
                                        fn: function(btn, text){
                                            window['PlanApp'].forceplanMode = btn == 'yes'; 
                                            if(window['PlanApp'].forceplanMode)
                                                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.clearInvalid();
                                        },
                                        icon: Ext.MessageBox.WARNING
                                    });
                                    
                                    break;
                            }
                        }
                    }
                });
            }
            
            if(window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.isValid() &&
                dateDifference(daterage[0], daterage[1], 'D') == 0){
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.setMaxValue(window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.getValue());
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.endTime.setMinValue(window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.startTime.getValue());
            }
            
            if(window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.isValid()){
                var diff = dateDifference(daterage[0], daterage[1], 'H');
                
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.setValue(diff);
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.setValue('hours', true);
                window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.setValue('days', false);
                
                window['PlanApp'].validateDurationVsPeriod();
            }
        },
        
        validateDurationVsPeriod : function(){
            var record = window['PlanApp'].taskGridPanel.getSelectionModel().getSelected();
            var exception = record && record && record.get('frequencytype') && record.get('frequencytype')>0;
            
            
            var permitabledays = 1;
            if(window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.getValue() && window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.periodRadioGroup.getValue().id == 'hours')
                permitabledays = 24;
            if(!window['PlanApp'].taskFormPanel.tabPanel.timePanel.frequencyRadioGroup.disabled){
                var dt = new Date();
                Ext.getCmp('frequencyTypeDaily').setDisabled(window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.getValue() > permitabledays && !exception);
                Ext.getCmp('frequencyTypeWeekly').setDisabled(window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.getValue() > permitabledays * 7 && !exception);
                Ext.getCmp('frequencyTypeMonthly').setDisabled(window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.getValue() > permitabledays * dt.getDaysInMonth() && !exception);
                Ext.getCmp('frequencyTypeYearly').setDisabled(window['PlanApp'].taskFormPanel.tabPanel.timePanel.durationCompositeField.amountField.getValue() > permitabledays * 365 && !exception);
            }
        },
        
        selectionChange: function(selectionModel) {
            var records = selectionModel.getSelections();
            var isvirtual = true;
            var isson = false;
            var isowner = true;
            var hastasks = records.length > 0;
            var hasbaseline = false;
            var deleteable = true;
            
            for(var i = 0; i < records.length; i++){
                if(records[i].data.virtual === false)
                    isvirtual = false;
                if(records[i].data.parentid != '')
                    isson = true;
                if(records[i].data.baseline != '')
                    hasbaseline = true;
                if(records[i].data.conttasks < 1)
                    hastasks = false;
                
                if(parseInt(records[i].get('created_by')) != parseInt(config.app_logueduserdata.personid))
                    isowner = false;
                
                if (!records[i].get('deleteable'))
                    deleteable = false;
            } 
            
            selectionModel.grid.removeBtn.setDisabled(!deleteable || selectionModel.getCount() < 1 || isvirtual || (!isowner && !App.isAdvanced()));
            selectionModel.grid.calendarBtn.setDisabled(selectionModel.getCount() != 1 || !isvirtual);
            selectionModel.grid.ganttBtn.setDisabled(selectionModel.getCount() != 1 || !hastasks); 
            selectionModel.grid.updateBtn.setDisabled(selectionModel.getCount() != 1 || isvirtual || (!isowner && !App.isAdvanced()));
            selectionModel.grid.baselineBtn.setDisabled(selectionModel.grid.updateBtn.disabled);
            
            Ext.getCmp('exportPlan').setDisabled(selectionModel.getCount() != 1 || !hastasks); 
            
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlan4Year.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlan4YearSummary.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlan4Month.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            window['PlanApp'].gridPanel.reportBtn.menu.reportCompletementPlan4Month.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlan4Self.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlanControl.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            window['PlanApp'].gridPanel.reportBtn.menu.reportPlanExecution.setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            
            Ext.getCmp('baselineExploreOption').setDisabled(selectionModel.getCount() != 1 || !hasbaseline);
            
            if(records.length == 1){ 
                var hasspecialpremissions = records[0].get('name') == config.app_logueduser;
                var specialpremissionread = true;
                
                var persons = records[0].get('PlanPersonRelation');
                for(i = 0; persons && i < persons.length; i++) 
                    if(persons[i].personid == config.app_logueduserdata.personid ){ 
                        hasspecialpremissions = true;
                        
                        if(specialpremissionread && (persons[i].readonly == 0 || persons[i].readonly == '0'))
                            specialpremissionread = false;
                        break;
                    }
                
                
                window['PlanApp'].taskGridPanel.addBtn.setVisible((
                    (isowner || App.isAdvanced()) || 
                    (hasspecialpremissions && !specialpremissionread)));
                window['PlanApp'].taskGridPanel.updateBtn.setVisible(window['PlanApp'].taskGridPanel.addBtn.isVisible());
                window['PlanApp'].taskGridPanel.removeBtn.setVisible(window['PlanApp'].taskGridPanel.addBtn.isVisible());
                
                window['PlanApp'].taskGridPanel.importBtn.setDisabled(!isson);
                window['PlanApp'].taskGridPanel.importBtn.setVisible(window['PlanApp'].taskGridPanel.addBtn.isVisible());
                
                selectionModel.grid.baselineBtn.setDisabled(!window['PlanApp'].taskGridPanel.addBtn.isVisible());
            }
            else 
                window['PlanApp'].taskGridPanel.importBtn.setDisabled(true);
            
            selectionModel.grid.planBtn.setDisabled(records.length != 1 || (!isowner && !App.isAdvanced()) && !hasspecialpremissions);
            
            selectionModel.grid.reportBtn.setDisabled(selectionModel.grid.planBtn.disabled);
        },
        
        prepareDistinctFilter: function(queryEvent) {
            delete queryEvent.combo.lastQuery;
            var elements = new Array();
                                
            var element = new Object;
            if(window['PlanApp'].responsibleRecord && window['PlanApp'].responsibleRecord.id!=''){
                element.id = window['PlanApp'].responsibleRecord.id;
                elements.push(element);
            }
                                
            window['PlanApp'].taskPanel.participantsGridPanel.getStore().each(function(record){
                var element = new Object;
                element.id = record.get('id');
                elements.push(element);
            });
                                
            window['UserApp'].comboStore.baseParams.distinct = Ext.encode(elements);
        },
        
        getPlanTasksFn: function(process, callback) {
            var msg=App.mask.msg;
            App.mask.msg=bundle.getMsg('plan.action.export.findingtasks')+'...';
            App.mask.show();
            
            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
            
            new Ext.data.Connection().request({
                url: config.app_host+'/plan/request/method/explore',
                params: {
                    id: record ? record.get('id') : '',
                    institutional: record.get('virtual') === false ? 'true' : '',
                    noserialmultipart: 'true'
                },
                method: 'POST',
                callback : function(options, success, response) {
                    App.mask.hide();
                    App.mask.msg = msg;
                    
                    var json = Ext.decode(response.responseText); 
                                        
                    var obj = new Object;
                    obj.json = json;
                    obj.tasks = json.message;
                    obj.total = obj.tasks.length;
                    obj.record = record;
                                     
                    process(obj, callback);
                }
            });
        },
        
        duplicatePlanFn: function(button, eventObject) {
            var processFn = function(){
                var dt = new Date()
                    
                var year = dt.format('Y');
                var valid = false;
                var newplanid = 0;
                    
                if(window['PlanApp'].reportPeriodForm.yearField.isValid()){
                    year = window['PlanApp'].reportPeriodForm.yearField.getValue();
                    valid = true;
                }
                    
                window['PlanApp'].reportPeriodForm.getForm().reset(); 
                window['PlanApp'].window.hide();
                
                if(valid){
                    var elements = new Array();  
                    var processTask = function(obj, nextFn) {
                        var tasks = obj.tasks;
                        var total = obj.total;
                
                        var start = (tasks.length-total)*-1;
                        if(tasks && tasks.length>0){
                            var currenttask = Ext.util.Format.ellipsis(tasks[0].name, 30);
                            
                            Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('plan.action.duplicate.description'), start+1, total) + '...');
                            Ext.MessageBox.updateProgress(start/total, currenttask);
                            
                            new Ext.data.Connection().request({
                                url: 'task/request/method/gettaskelements',
                                method: 'POST',
                                params: {   
                                    id: tasks[0].id,
                                    year: year,
                                    planid: newplanid
                                },
                                callback : function(options, success, response) {
                                    var json = Ext.decode(response.responseText); 
                                    if(json.success)
                                        for(var i = 0; json.data && i < json.data.length; i++) 
                                            elements.push(json.data[i]);                                      
                                    
                                    window['PlanApp'].saveTasksByElements(elements, null, null, null, button, record, null,  function(){
                                        elements = new Array();  
                                        
                                        obj.tasks.splice(0,1);
                                        nextFn(obj, processTask);
                                    
                                        window['PlanApp'].gridPanel.getStore().load({
                                            params:{
                                                start: window['PlanApp'].gridPanel.getBottomToolbar().cursor,
                                                type: window['PlanApp'].gridPanel.typeInstitutionalBtn.pressed ? 'institutional': 'personal'
                                            }
                                        });   
                                    });
                                    
                                }
                            });
                        }
                        else{
                            Ext.MessageBox.hide();
                        }
                    };
                    
                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                    
                    var msg=App.mask.msg;
                    App.mask.msg=bundle.getMsg('plan.action.duplicate.createplan')+'...';
                    App.mask.show();
                    
                    new Ext.data.Connection().request({
                        url: 'plan/request/method/save',
                        method: 'POST',
                        params: {   
                            id: '',
                            name: record.get('name') + ' (C)',
                            comment: String.format(bundle.getMsg('plan.action.duplicate.createplancomment'), year, record.get('name')),
                            start: '01/01/'+year,
                            entityid: config.app_entityid
                        },
                        callback : function(options, success, response) {
                            App.mask.hide();
                            App.mask.msg = msg;
                            
                            var json = Ext.decode(response.responseText); 
                            if(json.success){
                                newplanid = json.data.id;
                                window['PlanApp'].getPlanTasksFn(processTask, processTask);
                            }
                            else {
                                var data = Ext.decode(json.message);
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: String.format(bundle.getMsg('plan.action.duplicate.plancopyexist'), data.data.name),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            newplanid = data.data.id;
                                            window['PlanApp'].getPlanTasksFn(processTask, processTask);
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION,
                                    closable: false
                                });
                            }
                        }
                    });
                }
            };
            
            window['PlanApp'].getPeriod('report1', processFn);
        },
        
        exportPlanFn: function(button, eventObject) {
            var processTask = function(obj, nextFn) {
                var tasks = obj.tasks;
                var total = obj.total;
                var record = obj.record;
                var json = obj.json;
                
                var start = (tasks.length-total)*-1;
                if(tasks && tasks.length>0){
                    var currenttask = Ext.util.Format.ellipsis(tasks[0].name, 30);
                            
                    Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('plan.action.export.description'), start+1, total) + '...');
                    Ext.MessageBox.updateProgress(start/total, currenttask);
                            
                    new Ext.data.Connection().request({
                        url: 'plan/request/method/export',
                        method: 'POST',
                        params: {   
                            id: record ? record.get('id') : '',
                            taskid: tasks[0].id,
                            institutional: record.get('virtual') === false ? 'true' : '',
                            item: start == 0 ? true : '',
                            location: json.location
                        },
                        callback : function(options, success, response) {
                            obj.tasks.splice(0,1);
                            nextFn(obj, processTask);
                        }
                    });
                }
                else{
                    Ext.MessageBox.hide();        
                    window.open(config.app_host + '/plan/request/method/viewexport/location/'+json.location);
                }
            };
             
            window['PlanApp'].getPlanTasksFn(processTask, processTask);
                    
        },
        
        createBaseLineFn: function(button, eventObject) {
            Ext.Msg.show({
                title: bundle.getMsg('app.msg.warning.title'),
                msg: bundle.getMsg('app.msg.warning.createbaselineselected.text'),
                buttons: Ext.Msg.YESNO,
                fn: function(btn, text){
                    if (btn == 'yes'){
                        var msg = App.mask.msg;
                        App.mask.msg = bundle.getMsg('task.action.deleting.findingelements')+'...';
                        App.mask.show();
                        
                        var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                        new Ext.data.Connection().request({
                            url: config.app_host + '/plan/request/method/gettasks4planorperson',
                            params: {
                                id: record.get('id'),
                                institutional: record.get('virtual') === false ? 'true' : ''
                            },
                            failure: requestFailed,
                            success: requestSuccessful,
                            callback : function(options, success, response) {
                                         
                                var json = Ext.decode(response.responseText);
                                
                                new Ext.data.Connection().request({
                                    url: config.app_host + '/plan/request/method/resetbaseline',
                                    params: {
                                        id: record.get('id'),
                                        institutional: record.get('virtual') === false ? 'true' : ''
                                    },
                                    failure: requestFailed,
                                    success: requestSuccessful,
                                    callback : function(options, success, response) {
                                        App.mask.hide();
                                        App.mask.msg = msg;
                                
                                        var elements = json.data;
                                        var total = elements.length;
                                                        
                                        var processElement = function(elements, nextFn, response) {
                                            var start = (elements.length-total)*-1;
                                            if(elements && elements.length > 0){
                                                if(elements.length > 1){
                                                    Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('task.action.procesing.description'), start+1, total) + '...');
                                                    Ext.MessageBox.updateProgress(start/total, ' ');
                                                }
                                                                
                                                new Ext.data.Connection().request({
                                                    url: config.app_host + '/plan/request/method/createbaseline',
                                                    method: 'POST',
                                                    params: {
                                                        taskid: elements[0].id,
                                                        objid: record.get('id'),
                                                        institutional: record.get('virtual') === false ? 'true' : ''
                                                    },
                                                    callback : function(options, success, response) { 
                                                        elements.splice(0,1);
                                                        nextFn(elements, processElement, response);
                                                    }
                                                });
                                            }
                                            else{
                                                Ext.MessageBox.hide(); 
                                        
                                                window['PlanApp'].store.load({
                                                    params:{
                                                        start: window['PlanApp'].gridPanel.getBottomToolbar().cursor
                                                    }
                                                });
                                            }
                                        };
                                                        
                                        processElement(elements, processElement);
                                    }
                                });
                            }
                        });                       
                    }
                },
                animEl: 'elId',
                icon: Ext.MessageBox.QUESTION,
                closable: false
            });
        },
        
        percentageRenderer: function(value) {
            var result = '<div class="ext-cal-evt ext-cal-evr" align="center" style="background-color:#fa7166;">'+value+'%&nbsp;</div>';
            if(value > 33)
                result = '<div class="ext-cal-evt ext-cal-evr" align="center" style="background-color:#f88015;">'+value+'%&nbsp;</div>';
            if(value > 66)
                result = '<div class="ext-cal-evt ext-cal-evr" align="center" style="background-color:#2e8f0c;">'+value+'%&nbsp;</div>';
            
            return result;
        },
        
        importPlanFn: function(button, eventObject) {
            var processFn = function(url){
                var msg = App.mask.msg;
                App.mask.msg=bundle.getMsg('plan.action.export.findingtasks')+'...';
                App.mask.show();
                
                new Ext.data.Connection().request({
                    url: config.app_host+'/plan/request/method/readimport',
                    params: {
                        url: url ? 'web/'+url : ''
                    },
                    method: 'POST',
                    callback : function(options, success, response) {
                        App.mask.hide();
                        var json = Ext.decode(response.responseText); 
                        
                        var metadata = json.message;
                        
                        Ext.Base.msg('', String.format(bundle.getMsg('plan.action.import.message'), metadata.metadata.author, metadata.metadata.date));
                        
                        App.mask.msg = msg;
                        
                        var processTask = function(start, nextFn) {
                            if(start < metadata.amount){
                                Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), bundle.getMsg('plan.action.export')+ '...');
                                Ext.MessageBox.updateProgress(start/metadata.amount, String.format(bundle.getMsg('plan.action.import.description'), start+1, metadata.amount));
                                
                                new Ext.data.Connection().request({
                                    url: 'task/request/method/getimportelements',
                                    method: 'POST',
                                    params: {
                                        item: start,
                                        url: url ? 'web/'+url : ''
                                    },
                                    callback : function(options, success, response) {
                                        var obj = Ext.decode(response.responseText);                                        
                                        var elements = obj.data;
                                        window['PlanApp'].saveTasksByElements(elements, null, null, null, button, null, null, function(){
                                            start++;
                                            nextFn(start, processTask);
                                        });
                                    }
                                });
                            }
                            else{
                                Ext.MessageBox.hide(); 
                                window['PlanApp'].store.load({
                                    params:{
                                        start: window['PlanApp'].gridPanel.getBottomToolbar().cursor
                                    }
                                });
                            }
                        };
                        
                        processTask(0, processTask);
                    }
                });
            
            };
            
            Ext.getCmp('picture').regex = Date.patterns.OnlyZI1Allowed;
            showPictureForm(false, 'web/uploads/db', processFn);
        },
        
        exploreBaseLineFn: function(button, eventObject) {
            /*
            var mask = new Ext.LoadMask(window['PlanApp'].cardPanel.getEl(), {
                msg: bundle.getMsg('plan.action.explorebaseline.comment')+'...'
            });
            mask.show();
            
            
            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
            
            new Ext.data.Connection().request({
                url: config.app_host + '/plan/request/method/explorebaseline',
                params: {
                    id: record.data.id,
                    id: record.get('id')
                },
                failure: requestFailed,
                callback : function(options, success, response) {
                    mask.hide();
                    var obj = Ext.decode(response.responseText);
                    
                    var msg = '';
                    if(obj && obj.data && obj.data.equal && obj.data.equal.length >= 0)
                        msg += String.format(bundle.getMsg('plan.action.explorebaseline.equal'), obj.data.equal.length) + '<br/>';
                    if(obj && obj.data && obj.data.diff && obj.data.diff.length >= 0)
                        msg += String.format(bundle.getMsg('plan.action.explorebaseline.diff'), obj.data.diff.length) + '<br/>';
                    if(obj && obj.data && obj.data.neww && obj.data.neww.length >= 0)
                        msg += String.format(bundle.getMsg('plan.action.explorebaseline.neww'), obj.data.neww.length) + '<br/>';
                    
                    Ext.Base.msg(bundle.getMsg('app.msg.info.title'), msg); 
                }
            
            });
            */
           
            var msg = App.mask.msg;
            App.mask.msg = bundle.getMsg('task.action.deleting.findingelements')+'...';
            App.mask.show();
                        
            var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
            new Ext.data.Connection().request({
                url: config.app_host + '/plan/request/method/gettasks4planorperson',
                params: {
                    id: record.get('id'),
                    institutional: record.get('virtual') === false ? 'true' : ''
                },
                failure: requestFailed,
                success: requestSuccessful,
                callback : function(options, success, response) {
                                         
                    var json = Ext.decode(response.responseText);
                    
                    App.mask.hide();
                    App.mask.msg = msg;
                                
                    var elements = json.data;
                    var total = elements.length;
                    
                    var result = new Array();
                    var stadistics = '';
                                     
                    window['PlanApp'].source = 'task/reportbaselinetasks';
                    window['PlanApp'].params = new Array();
                    
                    
                                
                    var processElement = function(elements, nextFn, response) {
                        var start = (elements.length-total)*-1;
                        if(elements && elements.length > 0){
                            if(elements.length > 1){
                                stadistics = '';
                                
                                if(result['equal']){
                                    if(stadistics != '')
                                        stadistics +=  '<br/>';
                                    
                                    window['PlanApp'].params['equal'] = new Object;
                                    window['PlanApp'].params['equal'].elements = result['equal'];
                                    window['PlanApp'].params['equal'].title = bundle.getMsg('plan.action.explorebaseline.equal');
                                    
                                    stadistics += String.format(bundle.getMsg('plan.action.explorebaseline.equal'), '<a href="#" onclick="javascript:App.printViewWithObjParam(&#39;PlanApp&#39;,&#39;equal&#39;)" style="text-decoration: none;">'+result['equal'].length+'</a>');
                                }
                                if(result['diff']){
                                    if(stadistics != '')
                                        stadistics +=  '<br/>';
                                    
                                    window['PlanApp'].params['diff'] = new Object;
                                    window['PlanApp'].params['diff'].elements = result['diff'];
                                    window['PlanApp'].params['diff'].title = bundle.getMsg('plan.action.explorebaseline.diff');
                                    
                                    window['PlanApp'].params.title = bundle.getMsg('plan.action.explorebaseline.diff');
                                    stadistics += String.format(bundle.getMsg('plan.action.explorebaseline.diff'), '<a href="#" onclick="javascript:App.printViewWithObjParam(&#39;PlanApp&#39;,&#39;diff&#39;)" style="text-decoration: none;">'+result['diff'].length+'</a>');
                                }
                                if(result['neww']){
                                    if(stadistics != '')
                                        stadistics +=  '<br/>';
                                    
                                    window['PlanApp'].params['neww'] = new Object;
                                    window['PlanApp'].params['neww'].elements = result['neww'];
                                    window['PlanApp'].params['neww'].title = bundle.getMsg('plan.action.explorebaseline.neww');
                                    
                                    window['PlanApp'].params.title = bundle.getMsg('plan.action.explorebaseline.neww');
                                    stadistics += String.format(bundle.getMsg('plan.action.explorebaseline.neww'), '<a href="#" onclick="javascript:App.printViewWithObjParam(&#39;PlanApp&#39;,&#39;neww&#39;)" style="text-decoration: none;">'+result['neww'].length+'</a>');
                                }
                                
                                Ext.MessageBox.progress(String.format(bundle.getMsg('task.action.procesing.description'), start+1, total)+'...', stadistics);
                                Ext.MessageBox.updateProgress(start/total, ' ');
                            }
                                                                
                            new Ext.data.Connection().request({
                                url: config.app_host + '/plan/request/method/explorebaseline',
                                method: 'POST',
                                params: {
                                    taskid: elements[0].id,
                                    objid: record.get('id'),
                                    institutional: record.get('virtual') === false ? 'true' : '',
                                    result: Ext.encode(result)
                                },
                                callback : function(options, success, response) { 
                                    
                                    var json = Ext.decode(response.responseText);
                                    result = json.data;
                                    
                                    elements.splice(0,1);
                                    nextFn(elements, processElement, response);
                                }
                            });
                        }
                        else{
                            Ext.MessageBox.hide(); 
                                    
                            //App.printView(url+'/extra/'+btn, ' ', ' '); 
                            Ext.Msg.show({
                                title: bundle.getMsg('app.msg.info.title'),
                                msg: stadistics,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    };
                                                        
                    processElement(elements, processElement);
                }
            }); 
                        
        },
        
        getPeriod: function(sender, processFn){            
            var height = 190;
            var monthinvisible = sender != 'report1' && sender != 'report1summary';
            window['PlanApp'].reportPeriodForm.monthCombo.setVisible(monthinvisible);
            if(!monthinvisible)
                height = 140;
            
            window['PlanApp'].window = App.showWindow(bundle.getMsg('plan.report.periodrestriction'), 180, height, window['PlanApp'].reportPeriodForm, 
                processFn, 
                function(){
                    window['PlanApp'].window.hide();
                    window['PlanApp'].reportPeriodForm.getForm().reset();
                }, 
                Ext.getBody(),
                false,
                false,
                true
                );
        },
        
        printPlanReport: function(report, record){
            window['PlanApp'].gridPanel.reportBtn.menu.hide(true);
            
            var processFn = function(){
                var dt = new Date()
                    
                var year = dt.format('Y');
                var url = '/task/'+report;
                var valid = false;
                    
                if(window['PlanApp'].reportPeriodForm.yearField.isValid()){
                    year = window['PlanApp'].reportPeriodForm.yearField.getValue();
                    url=url+'/year/'+year;
                    valid = true;
                }
                    
                if(window['PlanApp'].reportPeriodForm.monthCombo.isVisible()){
                    var month = window['PlanApp'].reportPeriodForm.monthCombo.getValue();
                    if(month < 10)
                        month = '0' + month;
                    url = url+'/month/'+month+'/monthname/'+window['PlanApp'].reportPeriodForm.monthCombo.getRawValue();
                    valid = valid==true?true:false;
                }
                else if(window['PlanApp'].reportPeriodForm.monthCombo.isVisible())
                    valid = false; 
                    
                if (record.get('virtual') === false)
                    url += '/plan/' + record.get('id');
                else
                    url += '/person/' + record.get('id');
                    
                window['PlanApp'].reportPeriodForm.getForm().reset(); 
                window['PlanApp'].window.hide();
                
                if(config.app_multientity)
                    url += '/entity/'+config.app_multientity.name;
                else
                    url += '/entity/undefined';
                
                url += '/entityid/'+config.app_entityid;
                if(valid){
                    if(report == 'reportCompletement')
                        Ext.Msg.show({
                            title: bundle.getMsg('app.msg.warning.title'),
                            msg: bundle.getMsg('plan.action.generatereport.aditionalinfo'),
                            buttons: Ext.Msg.YESNO,
                            fn: function(btn, text){
                                App.printView(url+'/extra/'+btn, ' ', ' '); 
                            },
                            animEl: 'elId',
                            icon: Ext.MessageBox.QUESTION
                        });
                    else
                        App.printView(url+'/extra/no', ' ', ' '); 
                }
            };
            
            window['PlanApp'].getPeriod(report, processFn);
        },
        
        showWindow : function(animateTarget){
            var resetFn = function(){
                window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().removeAll();
                window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().removeAll();
                
                window['PlanApp'].notesPanel.contentEditor.editor.reset();
                if(window['PlanApp'].notesPanel.getLayout().setActiveItem)
                    window['PlanApp'].notesPanel.getLayout().setActiveItem(0);
                
                window['PlanApp'].formPanel.tabPanel.goalsGridPanel.goalCombo.reset();
                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyRadioGroup.reset();
                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbypersonCombo.reset();
                window['PlanApp'].formPanel.tabPanel.personsGridPanel.findbyteamCombo.reset();
            };
            
            window['PlanApp'].window = App.showWindow(bundle.getMsg('plan.window.title'), 550, 310, this.formPanel, 
                function(button, eventObject, callback){
                    var record = window['PlanApp'].gridPanel.getSelectionModel().getSelected();
                    
                    var goals = new Array();  
                    window['PlanApp'].formPanel.tabPanel.goalsGridPanel.getStore().each(function(record){
                        goals.push(record.data);  
                    });
                    
                    var persons = new Array();  
                    window['PlanApp'].formPanel.tabPanel.personsGridPanel.getStore().each(function(record){
                        persons.push(record.data);  
                    });	
                    
                    window['PlanApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: record?record.data.id:'',
                            parentid: window['PlanApp'].parentRecord ? window['PlanApp'].parentRecord.id : '',
                            entityid: config.app_entityid,
                            goals: Ext.encode(goals),
                            persons: Ext.encode(persons)
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['PlanApp'].store.load({
                                params:{
                                    start: window['PlanApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('PlanApp', form, action, button, !record, resetFn, callback);
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    window['PlanApp'].formPanel.getForm().reset(); 
                    resetFn();
                    window['PlanApp'].window.hide();
                }, 
                animateTarget);
        },
        
        applySecurity : function(groups, permissions){
            window['PlanApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplanadd') != -1);
            window['PlanApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplanedit') != -1);
            window['PlanApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplandelete') != -1);
            window['PlanApp'].gridPanel.planBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplantoplan') != -1);
            window['PlanApp'].gridPanel.baselineBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplanbaseline') != -1);
            window['PlanApp'].gridPanel.exportBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplanbaseline') != -1);
            window['PlanApp'].gridPanel.reportBtn.setVisible(permissions.indexOf('manageplan') != -1 || permissions.indexOf('manageplanreport') != -1);
            
            window['PlanApp'].taskGridPanel.addBtn.setVisible(permissions.indexOf('managetask') != -1 || permissions.indexOf('managetaskadd') != -1);
            window['PlanApp'].taskGridPanel.updateBtn.setVisible(permissions.indexOf('managetask') != -1 || permissions.indexOf('managetaskedit') != -1);
            window['PlanApp'].taskGridPanel.removeBtn.setVisible(permissions.indexOf('managetask') != -1 || permissions.indexOf('managetaskdelete') != -1);
        }
    }
}();

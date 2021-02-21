/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage resource
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

ResourceApp = function() {
    return {
        init : function(ResourceApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/resource/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid,
                    entityid: config.app_entityid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('resource.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/resource/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('resource.tab.label').toLowerCase());
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
                    dataIndex: 'code'
                },{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'string',
                    dataIndex: 'comment'
                }]
            });
            
            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelResource',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("resource.grid.title") : '',
                autoExpandColumn: 'resourcecolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['ResourceApp'].gridPanel);
                    }
                }],
                keys: [panelKeysMap],
            
                listeners: {
                    activate: function(gridpanel){
                        gridpanel.setDisabled(!config.app_entityid || config.app_entityid == '' || config.app_entityid == '*');
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
                        var text = App.getFiltersText(window['ResourceApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['ResourceApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['ResourceApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['ResourceApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [new Ext.grid.RowNumberer(),{
                    header: bundle.getMsg('resource.field.name'), 
                    width: 160, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id:'resourcecolname', 
                    header: bundle.getMsg('resource.field.comment'), 
                    width: 360, 
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
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['ResourceApp'].gridPanel.getSelectionModel().clearSelections();
                            window['ResourceApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                            var record = window['ResourceApp'].gridPanel.getSelectionModel().getSelected();
                            if (record){
                                window['ResourceApp'].formPanel.getForm().loadRecord(record);
                            }
                            else
                                window['ResourceApp'].formPanel.getForm().reset();
                            window['ResourceApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var records = window['ResourceApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();                                
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/resource/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['ResourceApp'].store.load({
                                                            params:{
                                                                start: window['ResourceApp'].gridPanel.getBottomToolbar().cursor
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
                            window['ResourceApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['ResourceApp'].infoTextItem.getEl()).update('');
                            window['ResourceApp'].gridPanel.getSelectionModel().clearSelections();
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
                if (!record.get('deleteable')) 
                    return 'row-italic';
            };
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/resource/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						        
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            name: 'name',
                            fieldLabel: bundle.getMsg('app.form.name'), 
                            anchor:'-20'
                        }]
                    },{
                        columnWidth:.25,
                        layout: 'form',
                        items: [{
                            xtype: 'compositefield',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('app.form.rate'), 
                            combineErrors: false,
                            items: [{
                                xtype: 'displayfield',
                                value: '$'
                            },{
                                xtype:'numberfield',
                                name: 'rate',
                                flex : 1,
                                minValue: 0
                            },{
                                xtype: 'displayfield',
                                value: '/ hora'
                            }]
                        }]
                    },{
                        columnWidth:.25,
                        layout: 'form',
                        items: [{
                            xtype: 'compositefield',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('app.form.extrarate'), 
                            combineErrors: false,
                            items: [{
                                xtype: 'displayfield',
                                value: '$'
                            },{
                                xtype:'numberfield',
                                name: 'extrarate',
                                flex: 1,
                                minValue: 0
                            },{
                                xtype: 'displayfield',
                                value: '/ hora'
                            }]
                        }]
                    }]
                },{
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('resource.field.comment'),          
                    maxLength: 400, 
                    anchor:'-20'
                }]
            });
            
        },
        
        renderResource : function(data, callback){
            data.generaldata = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+bundle.getMsg('piece.action.nodatatodisplay');
            if(data.comment && data.comment!='')
                data.generaldata = data.comment;
            if(callback){
                callback(data.generaldata);
            }
                
            return data;
        },
        
        showWindow : function(animateTarget, hideApply, callback){
            window['ResourceApp'].window = App.showWindow(bundle.getMsg('resource.window.title'), 370, 230, window['ResourceApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['ResourceApp'].window.submitBtn.id;
                    }
                
                    var records = window['ResourceApp'].gridPanel.getSelectionModel().getSelections();
							
                    window['ResourceApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: records[0] ? records[0].get('id'):'',
                            entityid: config.app_entityid
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['ResourceApp'].store.load({
                                params:{
                                    start: window['ResourceApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('ResourceApp', form, action, button, !records[0], function(){
                                
                                }, callback);
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    window['ResourceApp'].formPanel.getForm().reset();
                    window['ResourceApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(resources, permissions){
            window['ResourceApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageresource') != -1 || permissions.indexOf('manageresourceadd') != -1);
            window['ResourceApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageresource') != -1 || permissions.indexOf('manageresourceedit') != -1);
            window['ResourceApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageresource') != -1 || permissions.indexOf('manageresourcedelete') != -1);            
        }
    }
}();


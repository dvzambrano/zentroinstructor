/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage tasktype
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

TasktypeApp = function() {
    return {
        init : function(TasktypeApp) {
            
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/tasktype/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/tasktype/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {
                        for(var i = 0; i < records.length; i++){
                            records[i].set('icontip', '');
                            if(records[i].get('customicon') && records[i].get('customicon').icon != '' && records[i].get('customicon').icon != 'wand.png')
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfamflag/'+records[i].get('customicon')+'" />');
                            else
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfam/wand.png" />');
                        }
                        alertNoRecords(records, bundle.getMsg('tasktype.tab.label').toLowerCase());
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
			
            this.gridPanel = new Ext.ux.tree.TreeGrid({
                id: 'gridPanelTasktype',
                rootVisible:false,
                iconCls: Ext.ux.Icon('wand'),
                
                region:'center',
                title: config.app_showgridtitle ? bundle.getMsg("tasktype.grid.title") : '',
                autoExpandColumn: 'tasktypemaincolumn',
                enableDD: false,
                useArrows: false,
                lines: true,
                containerScroll: true,
                animate: true,
                columnsText: bundle.getMsg('app.layout.columns'),
                maskConfig: {
                    msg: bundle.getMsg("app.layout.loading")
                },
                keys: [panelKeysMap],
                
                view: new Ext.grid.GroupingView(),
                
                plugins: [this.filters],
                
                tools:[{
                    id:'refresh',
                    qtip: bundle.getMsg('app.languaje.refresh.label'),
                    handler:function(event,toolEl,panel,tc){
                        window['TasktypeApp'].gridPanel.getRootNode().removeAll();
                        window['TasktypeApp'].gridPanel.getLoader().load(window['TasktypeApp'].gridPanel.getRootNode());
                        
                        window['TasktypeApp'].gridPanel.expandBtn.setDisabled(false);
                        window['TasktypeApp'].gridPanel.collapseBtn.setDisabled(true);
                    }
                },{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['TasktypeApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        window.open(config.app_host + '/uploads/tutorial/07 Gestion de Tipos de Tareas.html');
                    }
                }],
                
                columns: [{
                    id:'tasktypemaincolumn', 
                    header: bundle.getMsg('app.form.name'), 
                    width: 400, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    header: bundle.getMsg('app.form.comment'), 
                    width: 700, 
                    sortable: true, 
                    dataIndex: 'comment',
                    tpl: new Ext.XTemplate('{comment:this.renderValue}', {
                        renderValue: formatNull
                    })
                }],
                
                selModel: new Ext.tree.MultiSelectionModel({
                    listeners: {
                        selectionchange: App.selectionChange
                    }
                }),
                
                root: new Ext.tree.AsyncTreeNode({
                    text: 'root',
                    id:'NULL'
                }),
                
                listeners: {
                    click: function(node){
                        App.selectionChange(node.getOwnerTree().getSelectionModel());
                    },
                    beforedblclick: function(){
                        window['TasktypeApp'].gridPanel.updateBtn.fireEvent('click', window['TasktypeApp'].gridPanel.updateBtn);
                        return false;
                    },
                    beforeexpandnode: function(node, deep, anim){
                        node.getOwnerTree().collapseBtn.setDisabled(false);
                    },
                    beforecollapsenode: function(node, deep, anim){
                        node.getOwnerTree().expandBtn.setDisabled(false);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['TasktypeApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['TasktypeApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['TasktypeApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['TasktypeApp'].infoTextItem.getEl()).update('');
                    }
                },
                
                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        component: 'tree',
                        start: 0
                    },
                    dataUrl: config.app_host + '/tasktype/request/method/load',
                    listeners: {
                        load: function(treeLoader, node, response){
                            node.getOwnerTree().treeGridSorter = new Ext.ux.tree.TreeGridSorter(node.getOwnerTree(), {
                                property: node.getOwnerTree().columns[0].dataIndex
                            });
                            node.getOwnerTree().treeGridSorter.doSort(node);
                                
                            if(response.responseText.indexOf('signinForm')>0)
                                showSesionExpiredMsg();                            
                            
                            for(var i = 0; i < node.childNodes.length; i++){
                                if(!node.childNodes[i].attributes.deleteable || node.childNodes[i].attributes.deleteable == 0)
                                    node.childNodes[i].getUI().addClass('row-italic');
                                
                                node.childNodes[i].setIconCls(Ext.ux.Icon('wand'));
                                if(!node.childNodes[i].attributes.comment)
                                    node.childNodes[i].attributes.comment = '';
                                if(node.childNodes[i].attributes && node.childNodes[i].attributes && node.childNodes[i].attributes.customicon && node.childNodes[i].attributes.customicon != ''){
                                    var extension = node.childNodes[i].attributes.customicon;
                                    while(extension.indexOf('.')>-1)
                                        extension = extension.substring(extension.indexOf('.')+1, extension.length);
                                    var icon = node.childNodes[i].attributes.customicon.replace('.'+extension, '');
                                    node.childNodes[i].setIconCls(Ext.ux.Icon(icon, 'famfamfamflag'));
                                }
                            }
                        }
                    }
                }),
                
                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['TasktypeApp'].gridPanel.getSelectionModel().clearSelections();
                            window['TasktypeApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                            var record = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if (record.length==1){
                                var dr = new Ext.data.Record({
                                    name: record[0].attributes.name,
                                    comment: record[0].attributes.comment,
                                    icon: record[0].attributes.customicon && record[0].attributes.customicon != 'wand' ? record[0].attributes.customicon : '',
                                    parentid: record[0].attributes.Tasktype ? record[0].attributes.Tasktype.name : ''
                                });
                                if (!window['TasktypeApp'].parentRecord){
                                    window['TasktypeApp'].parentRecord = new Object;
                                    window['TasktypeApp'].parentRecord.data = new Object;
                                }
                                window['TasktypeApp'].parentRecord.id = record[0].attributes.parentid;
                                window['TasktypeApp'].parentRecord.data.path = record[0].parentNode.getPath();
                                window['TasktypeApp'].formPanel.getForm().loadRecord(dr);
                            }
                            window['TasktypeApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var nodes = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                        
                                            var array = new Array();                                
                                            for (var i=0; i<nodes.length; i++)
                                                array.push(nodes[i].id);
                                        
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/tasktype/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    for (var i=0; i<nodes.length; i++){
                                                        nodes[i].unselect();
                                                        var el = Ext.fly(nodes[i].ui.elNode);
                                                        if(el)
                                                            el.ghost('l', {
                                                                callback: nodes[i].remove, 
                                                                scope: nodes[i], 
                                                                duration: .4
                                                            });
                                                    }
                                                    if(callback){
                                                        if(callback.fn)
                                                            callback.fn(callback.params);
                                                        else
                                                            callback();
                                                    }
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
                },'->','-',{
                    ref: '../expandBtn',
                    iconCls: Ext.ux.Icon('expand-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.expandall'),
                    listeners: {
                        click: function() {
                            var nodes = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].expand(true);
                            else{
                                window['TasktypeApp'].gridPanel.expandAll();
                                window['TasktypeApp'].gridPanel.expandBtn.setDisabled(true);
                                window['TasktypeApp'].gridPanel.collapseBtn.setDisabled(false);
                            }
                        }
                    }
                },{
                    ref: '../collapseBtn',
                    disabled: true,
                    iconCls: Ext.ux.Icon('collapse-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.collapseall'),
                    listeners: {
                        click: function() {
                            var nodes = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].collapse(true);
                            else {
                                window['TasktypeApp'].gridPanel.collapseAll();
                                window['TasktypeApp'].gridPanel.expandBtn.setDisabled(false);
                                window['TasktypeApp'].gridPanel.collapseBtn.setDisabled(true);
                            }
                        }
                    }
                }],
                
                bbar: new Ext.PagingToolbar({
                    pageSize: Number.MAX_VALUE,
                    store: this.store,
                    items:[{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['TasktypeApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['TasktypeApp'].infoTextItem.getEl()).update('');
                            window['TasktypeApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    doRefresh : function(){
                        window['TasktypeApp'].gridPanel.getLoader().load(window['TasktypeApp'].gridPanel.getRootNode());
                        
                        window['TasktypeApp'].gridPanel.expandBtn.setDisabled(false);
                        window['TasktypeApp'].gridPanel.collapseBtn.setDisabled(true);
                    },
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.bbar.msg'),
                    emptyMsg: bundle.getMsg('app.bbar.msg'),
                    listeners: {
                        render: function(toolbar) {
                            toolbar.items.items[4].setDisabled(true);
                        }
                    }
                })
            });
            
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/tasktype/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						        
                keys: [formKeyMaping],
                items: [{
                    xtype:'textfield',
                    name: 'name',
                    fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>', 
                    allowBlank: false,
                    anchor:'-20'
                }, new Ext.form.ComboBox({
                    fieldLabel : bundle.getMsg('tasktype.field.parent'),
                    store: this.comboStore,
                    name: 'parentid',
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
                        '<h3><span>{parent}</span>{icontip} {name}</h3>',
                        '{comment}',
                        '</div></tpl>'
                        ),
                    itemSelector: 'div.search-item',
                    listeners: {
                        beforequery: function(queryEvent) {
                            delete queryEvent.combo.lastQuery;
                            var node = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if (node && node.length>0){
                                node = node[0];
                                        
                                var elements = new Array();
                                var element = new Object;
                                element.id = node.id;
                                elements.push(element);
                                        
                                window['TasktypeApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                            }
                            this.setValue(queryEvent.query);
                        },
                        select: function(combo, record, index ){
                            window['TasktypeApp'].parentRecord = record;
                            window['TasktypeApp'].comboStore.baseParams.distinct = '';
                            this.collapse();
                        },
                        blur: function(field) {		
                            if(field.getRawValue() == '')
                                window['TasktypeApp'].parentRecord = false;
                            else {
                                var record = field.getStore().getAt(field.getStore().findExact('name', field.getRawValue()));								 
                                if(record && record.get('name') == field.getRawValue())
                                    window['TasktypeApp'].parentRecord = record;
                                else 
                                    window['TasktypeApp'].parentRecord = false;
                            }
                            window['TasktypeApp'].comboStore.baseParams.distinct = '';
                        }
                    }
                }), {
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('app.form.comment'),          
                    maxLength: 400, 
                    anchor:'-20'
                }]
            });
        
        },
        
        showWindow : function(animateTarget, hideApply, callback){            
            window['TasktypeApp'].window = App.showWindow(bundle.getMsg('tasktype.window.title'), 700, 280, window['TasktypeApp'].formPanel, 
                function(button){
                    var nodes = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    var node = false;
                    if(nodes && nodes.length>0)
                        node = nodes[0];
                    
                    window['TasktypeApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        //submitEmptyText: false,
                        params: {
                            id: node ? node.id:'',
                            parent_id: window['TasktypeApp'].parentRecord ? window['TasktypeApp'].parentRecord.id :'',
                            path: window['TasktypeApp'].parentRecord ? window['TasktypeApp'].parentRecord.data.path : window['TasktypeApp'].gridPanel.getRootNode().getPath()
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);     
                            if(node)
                                window['TasktypeApp'].gridPanel.expandBtn.setDisabled(false);
                                
                            resetTree(window['TasktypeApp'].gridPanel, node, window['TasktypeApp'].parentRecord ? window['TasktypeApp'].parentRecord : false);
                            
                            submitFormSuccessful('TasktypeApp', form, action, button, !node, function(){
                                window['TasktypeApp'].parentRecord = false;
                            }, callback);
                        },
                        failure: loadFormFailed
                    });
                }, 
                function(){
                    window['TasktypeApp'].parentRecord = false;
                
                    var node = window['TasktypeApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    if(node && node.length>0){
                        node = node[0];
                        window['TasktypeApp'].gridPanel.expandBtn.setDisabled(false);
                        resetTree(window['TasktypeApp'].gridPanel, node, false);
                    }
                
                    window['TasktypeApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['TasktypeApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managetasktype') != -1 || permissions.indexOf('managetasktypeadd') != -1);
            window['TasktypeApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managetasktype') != -1 || permissions.indexOf('managetasktypeedit') != -1);
            window['TasktypeApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managetasktype') != -1 || permissions.indexOf('managetasktypedelete') != -1);            
        }
    }
}();


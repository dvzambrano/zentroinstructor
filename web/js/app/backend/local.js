/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage local
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

LocalApp = function() {
    return {
        init : function(LocalApp) {
            
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/local/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/local/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {
                        for(var i = 0; i < records.length; i++){
                            records[i].set('icontip', '');
                            if(records[i].get('customicon') && records[i].get('customicon').icon != '' && records[i].get('customicon').icon != 'internet-archive.png')
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfamflag/'+records[i].get('customicon')+'" />');
                            else
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfam/internet-archive.png" />');
                        }
                        alertNoRecords(records, bundle.getMsg('local.tab.label').toLowerCase());
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
                id: 'gridPanelLocal',
                rootVisible:false,
                iconCls: Ext.ux.Icon('internet-archive'),
                
                region:'center',
                title: config.app_showgridtitle ? bundle.getMsg("local.grid.title") : '',
                autoExpandColumn: 'localmaincolumn',
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
                        window['LocalApp'].gridPanel.getBottomToolbar().doRefresh();
                    }
                },{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['LocalApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        window.open(config.app_host + '/uploads/tutorial/05 Gestion de Locales.html');
                    }
                }],
                
                columns: [{
                    id:'localmaincolumn', 
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
                        window['LocalApp'].gridPanel.updateBtn.fireEvent('click', window['LocalApp'].gridPanel.updateBtn);
                        return false;
                    },
                    beforeexpandnode: function(node, deep, anim){
                        node.getOwnerTree().collapseBtn.setDisabled(false);
                    },
                    beforecollapsenode: function(node, deep, anim){
                        node.getOwnerTree().expandBtn.setDisabled(false);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['LocalApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['LocalApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['LocalApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['LocalApp'].infoTextItem.getEl()).update('');
                    }
                },
                
                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        component: 'tree',
                        start: 0
                    },
                    dataUrl: config.app_host + '/local/request/method/load',
                    listeners: {
                        beforeload: beforeloadStore,
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
                                
                                node.childNodes[i].setIconCls(Ext.ux.Icon('internet-archive'));
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
                            window['LocalApp'].gridPanel.getSelectionModel().clearSelections();
                            window['LocalApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                            var record = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if (record.length==1){
                                var dr = new Ext.data.Record({
                                    name: record[0].attributes.name,
                                    comment: record[0].attributes.comment,
                                    icon: record[0].attributes.customicon && record[0].attributes.customicon != 'internet-archive' ? record[0].attributes.customicon : '',
                                    parentid: record[0].attributes.Local ? record[0].attributes.Local.name : '',
                                    excluding: record[0].attributes.is_excluding
                                });
                                if (!window['LocalApp'].parentRecord){
                                    window['LocalApp'].parentRecord = new Object;
                                    window['LocalApp'].parentRecord.data = new Object;
                                }
                                window['LocalApp'].parentRecord.id = record[0].attributes.parentid;
                                window['LocalApp'].parentRecord.data.path = record[0].parentNode.getPath();
                                window['LocalApp'].formPanel.getForm().loadRecord(dr);
                            }
                            window['LocalApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var nodes = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                        
                                            var array = new Array();                                
                                            for (var i=0; i<nodes.length; i++)
                                                array.push(nodes[i].id);
                                        
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/local/request/method/delete',
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
                            var nodes = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].expand(true);
                            else{
                                window['LocalApp'].gridPanel.expandAll();
                                window['LocalApp'].gridPanel.expandBtn.setDisabled(true);
                                window['LocalApp'].gridPanel.collapseBtn.setDisabled(false);
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
                            var nodes = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].collapse(true);
                            else {
                                window['LocalApp'].gridPanel.collapseAll();
                                window['LocalApp'].gridPanel.expandBtn.setDisabled(false);
                                window['LocalApp'].gridPanel.collapseBtn.setDisabled(true);
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
                            window['LocalApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['LocalApp'].infoTextItem.getEl()).update('');
                            window['LocalApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    doRefresh : function(){
                        window['LocalApp'].gridPanel.getRootNode().removeAll();
                        window['LocalApp'].gridPanel.getLoader().load(window['LocalApp'].gridPanel.getRootNode());
                        
                        window['LocalApp'].gridPanel.expandBtn.setDisabled(false);
                        window['LocalApp'].gridPanel.collapseBtn.setDisabled(true);
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
                url: config.app_host + '/local/request/method/save',
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
                    fieldLabel : bundle.getMsg('local.field.parent'),
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
                            var node = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if (node && node.length>0){
                                node = node[0];
                                        
                                var elements = new Array();
                                var element = new Object;
                                element.id = node.id;
                                elements.push(element);
                                        
                                window['LocalApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                            }
                            this.setValue(queryEvent.query);
                        },
                        select: function(combo, record, index ){
                            window['LocalApp'].parentRecord = record;
                            window['LocalApp'].comboStore.baseParams.distinct = '';
                            this.collapse();
                        },
                        blur: function(field) {		
                            if(field.getRawValue() == '')
                                window['LocalApp'].parentRecord = false;
                            else {
                                var record = field.getStore().getAt(field.getStore().findExact('name', field.getRawValue()));								 
                                if(record && record.get('name') == field.getRawValue())
                                    window['LocalApp'].parentRecord = record;
                                else 
                                    window['LocalApp'].parentRecord = false;
                            }
                            window['LocalApp'].comboStore.baseParams.distinct = '';
                        }
                    }
                }), {
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('app.form.comment'),          
                    maxLength: 400, 
                    anchor:'-20'
                },{
                    xtype:'checkbox',
                    fieldLabel: '',
                    labelSeparator: '',
                    boxLabel: bundle.getMsg('local.field.excluding'),
                    name: 'excluding'
                }]
            });
        
        },
        
        showWindow : function(animateTarget, hideApply, callback){            
            window['LocalApp'].window = App.showWindow(bundle.getMsg('local.window.title'), 370, 330, window['LocalApp'].formPanel, 
                function(button){
                    var nodes = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    var node = false;
                    if(nodes && nodes.length>0)
                        node = nodes[0];
                    
                    window['LocalApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        //submitEmptyText: false,
                        params: {
                            id: node ? node.id:'',
                            parent_id: window['LocalApp'].parentRecord ? window['LocalApp'].parentRecord.id :'',
                            path: window['LocalApp'].parentRecord ? window['LocalApp'].parentRecord.data.path : window['LocalApp'].gridPanel.getRootNode().getPath(),
                            entityid: config.app_entityid
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);     
                            if(node)
                                window['LocalApp'].gridPanel.expandBtn.setDisabled(false);
                                
                            resetTree(window['LocalApp'].gridPanel, node, window['LocalApp'].parentRecord ? window['LocalApp'].parentRecord : false);
                            
                            submitFormSuccessful('LocalApp', form, action, button, !node, function(){
                                window['LocalApp'].parentRecord = false;
                            }, callback);
                        },
                        failure: loadFormFailed
                    });
                }, 
                function(){
                    window['LocalApp'].parentRecord = false;
                
                    var node = window['LocalApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    if(node && node.length>0){
                        node = node[0];
                        window['LocalApp'].gridPanel.expandBtn.setDisabled(false);
                        resetTree(window['LocalApp'].gridPanel, node, false);
                    }
                
                    window['LocalApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['LocalApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managelocal') != -1 || permissions.indexOf('managelocaladd') != -1);
            window['LocalApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managelocal') != -1 || permissions.indexOf('managelocaledit') != -1);
            window['LocalApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managelocal') != -1 || permissions.indexOf('managelocaldelete') != -1);            
        }
    }
}();


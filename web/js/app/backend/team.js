/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage team
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

TeamApp = function() {
    return {
        init : function(TeamApp) {
            
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/team/request/method/load',
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
                url: config.app_host + '/team/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: function(store, records) {
                        for(var i = 0; i < records.length; i++){
                            records[i].set('icontip', '');
                            if(records[i].get('customicon') && records[i].get('customicon').icon != '' && records[i].get('customicon').icon != 'ppa.png')
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfamflag/'+records[i].get('customicon')+'" />');
                            else
                                records[i].set('icontip', '<img src="'+config.app_host+'/images/icons/famfamfam/ppa.png" />');
                        }
                        alertNoRecords(records, bundle.getMsg('team.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });            
            
            this.filters = new Ext.ux.grid.GridFilters({
                encode: true,
                team: false,
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
                id: 'gridPanelTeam',
                rootVisible:false,
                iconCls: Ext.ux.Icon('ppa'),
                
                region:'center',
                title: config.app_showgridtitle ? bundle.getMsg("team.grid.title") : '',
                autoExpandColumn: 'teammaincolumn',
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
                        window['TeamApp'].gridPanel.getBottomToolbar().doRefresh();
                    }
                },{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['TeamApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
						//window.open(config.app_host + '/uploads/tutorial/05 Gestion de Teames.html');
                    }
                }],
                
                columns: [{
                    id:'teammaincolumn', 
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
                        window['TeamApp'].gridPanel.updateBtn.fireEvent('click', window['TeamApp'].gridPanel.updateBtn);
                        return false;
                    },
                    beforeexpandnode: function(node, deep, anim){
                        node.getOwnerTree().collapseBtn.setDisabled(false);
                    },
                    beforecollapsenode: function(node, deep, anim){
                        node.getOwnerTree().expandBtn.setDisabled(false);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['TeamApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['TeamApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['TeamApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['TeamApp'].infoTextItem.getEl()).update('');
                    }
                },
                
                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        component: 'tree',
                        start: 0
                    },
                    dataUrl: config.app_host + '/team/request/method/load',
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
                                
                                node.childNodes[i].setIconCls(Ext.ux.Icon('ppa'));
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
                            window['TeamApp'].gridPanel.getSelectionModel().clearSelections();
                            window['TeamApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                            var record = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if (record.length==1){
                                var dr = new Ext.data.Record({
                                    name: record[0].attributes.name,
                                    comment: record[0].attributes.comment,
                                    icon: record[0].attributes.customicon && record[0].attributes.customicon != 'ppa' ? record[0].attributes.customicon : '',
                                    responsibleid: record[0].attributes.Responsible && record[0].attributes.Responsible.sfGuardUser ? record[0].attributes.Responsible.sfGuardUser.first_name + ' ' + record[0].attributes.Responsible.sfGuardUser.last_name : '',
                                    parentid: record[0].attributes.Team ? record[0].attributes.Team.name : ''
                                });
                                if (!window['TeamApp'].responsibleRecord){
                                    window['TeamApp'].responsibleRecord = new Object;
                                    window['TeamApp'].responsibleRecord.data = new Object;
                                }
                                if(record[0].attributes.Responsible)
                                    window['TeamApp'].responsibleRecord.id = record[0].attributes.Responsible.id;
                                
                                if (!window['TeamApp'].parentRecord){
                                    window['TeamApp'].parentRecord = new Object;
                                    window['TeamApp'].parentRecord.data = new Object;
                                }
                                window['TeamApp'].parentRecord.id = record[0].attributes.parentid;
                                window['TeamApp'].parentRecord.data.path = record[0].parentNode.getPath();
                                window['TeamApp'].formPanel.getForm().loadRecord(dr);
                                
                                window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().removeAll();
                                for(var i = 0; record[0].attributes.Members && i < record[0].attributes.Members.length; i++){
                                    record[0].attributes.Members[i].sfGuardUser.full_name = record[0].attributes.Members[i].sfGuardUser.first_name + ' ' + record[0].attributes.Members[i].sfGuardUser.last_name;
                                    window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().add(new Ext.data.Record(record[0].attributes.Members[i].sfGuardUser));
                                }
                            }
                            window['TeamApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var nodes = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                        
                                            var array = new Array();                                
                                            for (var i=0; i<nodes.length; i++)
                                                array.push(nodes[i].id);
                                        
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/team/request/method/delete',
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
                            var nodes = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].expand(true);
                            else{
                                window['TeamApp'].gridPanel.expandAll();
                                window['TeamApp'].gridPanel.expandBtn.setDisabled(true);
                                window['TeamApp'].gridPanel.collapseBtn.setDisabled(false);
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
                            var nodes = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].collapse(true);
                            else {
                                window['TeamApp'].gridPanel.collapseAll();
                                window['TeamApp'].gridPanel.expandBtn.setDisabled(false);
                                window['TeamApp'].gridPanel.collapseBtn.setDisabled(true);
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
                            window['TeamApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['TeamApp'].infoTextItem.getEl()).update('');
                            window['TeamApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    doRefresh : function(){
                        window['TeamApp'].gridPanel.getRootNode().removeAll();
                        window['TeamApp'].gridPanel.getLoader().load(window['TeamApp'].gridPanel.getRootNode());
                        
                        window['TeamApp'].gridPanel.expandBtn.setDisabled(false);
                        window['TeamApp'].gridPanel.collapseBtn.setDisabled(true);
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
                url: config.app_host + '/team/request/method/save',
                keys: [formKeyMaping],	
                border:false,
                items: [new Ext.TabPanel({
                    ref: 'tabPanel',
                    deferredRender: false,
                    height: 450,
                    defaults:{
                        autoHeight:false
                    }, 			
                    activeTab: 0,
                    border:false,
                    items:[{
                        ref: 'generalPanel',
                        title: bundle.getMsg('app.form.generaldata'),	
                        border:false,
                        height: 450,
                        bodyStyle: 'padding:5px',
                        items: [{
                            layout:'column',
                            border:false,
                            items:[{
                                columnWidth: 1,
                                layout: 'form',
                                border:false,
                                items: [{
                                    xtype:'textfield',
                                    name: 'name',
                                    fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>', 
                                    allowBlank: false,
                                    anchor:'-20'
                                }, new Ext.form.ComboBox({
                                    store: window['UserApp'].comboStore,
                                    name: 'responsibleid',
                                    fieldLabel: bundle.getMsg('team.combo.label.responsible')+'<span style="color:red;"><sup>*</sup></span>',
                                    anchor: '-20', 
                                    emptyText: bundle.getMsg('app.form.typehere'),
                                    minChars: config.app_characteramounttofind,
                                    displayField: 'full_name',
                                    typeAhead: false,
                                    allowBlank: false,
                                    loadingText: bundle.getMsg('app.msg.wait.searching'),
                                    pageSize: config.app_elementsongrid/2,
                                    hideTrigger:true,
                                    tpl: new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                        '<img src="{picture}" height="30px" align="right" hspace="10" /><h3>{full_name}</h3>{email_address}',
                                        '</div></tpl>'
                                        ),
                                    itemSelector: 'div.search-item',
                                    listeners: {
                                        select: function(combo, record, index ){
                                            window['TeamApp'].responsibleRecord = record;
                                            this.collapse(); 
                                        },
                                        beforequery: function(queryEvent) {
                                            delete queryEvent.combo.lastQuery;
                                            this.setValue(queryEvent.query);
                                        },
                                        blur: function(field) {		
                                            if(field.getRawValue() == '')
                                                window['TeamApp'].responsibleRecord = false;
                                            else
                                            {
                                                var record = field.getStore().getAt(field.getStore().find('full_name',field.getRawValue(), 0, true, true));								 
								  
                                                if(record && record.get('full_name') == field.getRawValue())
                                                    window['TeamApp'].responsibleRecord = record;	
                                                else 
                                                    window['TeamApp'].responsibleRecord = false; 
                                            }
                                        }
                                    }
                                }), new Ext.form.ComboBox({
                                    fieldLabel : bundle.getMsg('team.field.parent'),
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
                                            var node = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                            if (node && node.length>0){
                                                node = node[0];
                                        
                                                var elements = new Array();
                                                var element = new Object;
                                                element.id = node.id;
                                                elements.push(element);
                                        
                                                window['TeamApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                                            }
                                            this.setValue(queryEvent.query);
                                        },
                                        select: function(combo, record, index ){
                                            window['TeamApp'].parentRecord = record;
                                            window['TeamApp'].comboStore.baseParams.distinct = '';
                                            this.collapse();
                                        },
                                        blur: function(field) {		
                                            if(field.getRawValue() == '')
                                                window['TeamApp'].parentRecord = false;
                                            else {
                                                var record = field.getStore().getAt(field.getStore().findExact('name', field.getRawValue()));								 
                                                if(record && record.get('name') == field.getRawValue())
                                                    window['TeamApp'].parentRecord = record;
                                                else 
                                                    window['TeamApp'].parentRecord = false;
                                            }
                                            window['TeamApp'].comboStore.baseParams.distinct = '';
                                        }
                                    }
                                }), {
                                    xtype:'textarea',
                                    name: 'comment',
                                    fieldLabel: bundle.getMsg('app.form.comment'),          
                                    maxLength: 400, 
                                    anchor:'-20'
                                }]
                            }]
                        }]
                    }, new Ext.grid.GridPanel({
                        ref: 'membersGridPanel',
                        stripeRows: true,
                        autoExpandColumn: 'colcode',
                        title: bundle.getMsg('team.field.personal'),
                        iconCls: Ext.ux.Icon('group'),
                        store: new Ext.data.Store({
                            url: config.app_host + '/person/request/method/load',
                            baseParams:{
                                component: 'personsbyteam',
                                teamid: ''
                            },
                            reader: new Ext.data.JsonReader(),
                            listeners: {
                                load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records, options) {           
                                    alertNoRecords(records);
                                },
                                loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                            }
                        }),
                        sm: new Ext.grid.RowSelectionModel({
                            listeners: {
                                selectionchange: function(selectionModel) {
                                    window['TeamApp'].formPanel.tabPanel.membersGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                                }
                            }
                        }),
                        columns: [ new Ext.grid.RowNumberer(),{
                            id:'colcode',
                            header: bundle.getMsg('app.form.name'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'full_name'
                        }],
                        tbar: [new Ext.Toolbar.TextItem(bundle.getMsg('team.field.person')+'<span style="color:red;"><sup>*</sup></span>'+': '),new Ext.form.ComboBox({
                            ref: '../personCombo',
                            store: window['UserApp'].comboStore,
                            name: 'personalCombo',
                            width: 380, 
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
                                    window['TeamApp'].userRecord = record;
                                    window['UserApp'].comboStore.baseParams.distinct = '';
                                    this.collapse();
                                },
                                beforequery: function(queryEvent) {	
                                    delete queryEvent.combo.lastQuery;                                                                               
                                    var elements = new Array();
                                    
                                    if (window['TeamApp'].responsibleRecord){                     
                                        var element = new Object;
                                        element.id = window['TeamApp'].responsibleRecord.id;
                                        elements.push(element);                                        
                                    }
                                    
                                    window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().each(function(record){
                                        var element = new Object;
                                        element.id = record.get('id');
                                        elements.push(element);
                                    });
                                    
                                    window['UserApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                                    
                                    this.setValue(queryEvent.query);
                                },
                                blur: function(field) {		
                                    if(field.getRawValue() == '')
                                        window['TeamApp'].userRecord = false;
                                    else {
                                        var record = field.getStore().getAt(field.getStore().find('full_name',field.getRawValue(), 0, true, true));								 
                                        if(record && record.get('full_name') == field.getRawValue())
                                            window['TeamApp'].userRecord = record;
                                        else 
                                            window['TeamApp'].userRecord = false;
                                    }
                                    window['UserApp'].comboStore.baseParams.distinct = '';
                                }
                            }
                        }),'->',{
                            tooltip: bundle.getMsg('app.form.addrow'),
                            iconCls: Ext.ux.Icon('table_row_insert'),
                            listeners: {
                                click: function(button, eventObject) {
                                    if(window['TeamApp'].formPanel.tabPanel.membersGridPanel.personCombo.isValid() && window['TeamApp'].userRecord){
                                        if(window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().find('username', window['TeamApp'].userRecord.get('username'), 0, true, true) != -1 || (window['TeamApp'].responsibleRecord && window['TeamApp'].userRecord.get('id') == window['TeamApp'].responsibleRecord.id))
                                            window['TeamApp'].formPanel.tabPanel.membersGridPanel.personCombo.markInvalid(bundle.getMsg('team.combo.notification.existrecord'));
                                        else {
                                            window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().add(window['TeamApp'].userRecord);
                                            window['TeamApp'].formPanel.tabPanel.membersGridPanel.personCombo.reset();
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
                                    window['TeamApp'].deletePersonal();
                                }
                            }
                        }],
                        listeners:{
                            keypress:function(e){		
                                if(e.getKey()==46)
                                    window['TeamApp'].deletePersonal();
                            }
                        }
                    })],
                    listeners: {
                        tabchange: function(panel, tab) {
                            if(tab.title == bundle.getMsg('team.field.personal'))
                                window['TeamApp'].formPanel.tabPanel.membersGridPanel.personCombo.reset();
                        }
                    }
                })]
            });	
        },
		
        deletePersonal : function(){
            var records = window['TeamApp'].formPanel.tabPanel.membersGridPanel.getSelectionModel().getSelections();
            window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().remove(records);
        },
        
        showWindow : function(animateTarget, hideApply, callback){            
            window['TeamApp'].window = App.showWindow(bundle.getMsg('team.window.title'), 500, 360, window['TeamApp'].formPanel, 
                function(button){
                    var nodes = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    var node = false;
                    if(nodes && nodes.length>0)
                        node = nodes[0];
                    
                    var persons = new Array();					
                    window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().each(function(record){
                        persons.push(record.get('id'));	
                    });					
                    window['TeamApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        //submitEmptyText: false,
                        params: {
                            id: node ? node.id:'',
                            responsible_id: window['TeamApp'].responsibleRecord ? window['TeamApp'].responsibleRecord.id :'',
                            parent_id: window['TeamApp'].parentRecord ? window['TeamApp'].parentRecord.id :'',
                            path: window['TeamApp'].parentRecord ? window['TeamApp'].parentRecord.data.path : window['TeamApp'].gridPanel.getRootNode().getPath(),
                            entityid: config.app_entityid,
                            persons: Ext.encode(persons)
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);     
                            if(node)
                                window['TeamApp'].gridPanel.expandBtn.setDisabled(false);
                                
                            resetTree(window['TeamApp'].gridPanel, node, window['TeamApp'].parentRecord ? window['TeamApp'].parentRecord : false);
                            
                            submitFormSuccessful('TeamApp', form, action, button, !node, function(){
                                window['TeamApp'].parentRecord = false;
                                window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().removeAll();
                            }, callback);
                        },
                        failure: loadFormFailed
                    });
                }, 
                function(){
                    window['TeamApp'].parentRecord = false;
                
                    var node = window['TeamApp'].gridPanel.getSelectionModel().getSelectedNodes();
                    if(node && node.length>0){
                        node = node[0];
                        window['TeamApp'].gridPanel.expandBtn.setDisabled(false);
                        resetTree(window['TeamApp'].gridPanel, node, false);
                    }
                    window['TeamApp'].formPanel.tabPanel.membersGridPanel.getStore().removeAll();
                
                    window['TeamApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['TeamApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageteam') != -1 || permissions.indexOf('manageteamadd') != -1);
            window['TeamApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageteam') != -1 || permissions.indexOf('manageteamedit') != -1);
            window['TeamApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageteam') != -1 || permissions.indexOf('manageteamdelete') != -1);            
        }
    }
}();


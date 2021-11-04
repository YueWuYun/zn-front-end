//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable,print,high,promptBox,excelImportconfig,createPageIcon} from 'nc-lightapp-front';
import MaterialSgmenuTable from '../component/materialSgmenuTable';
import SgmenuForm from '../component/sgmenuform';
import SgmenuBatchAdd from '../component/sgmenuBatchAdd';
import PrinceQueryTable from '../component/priceQueryTable';
import SupplierBase from "../../supplier_base/main/index.js";
import './index .less';
import '../../../public/uapbdstyle/uapbd_style_common.less'
import NCTabsControl from "../component/TabsControl";

const {NCMessage:Message,NCDiv} = base;
const {NCTabs,NCBackBtn} = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput,ExcelImport} = high;

let pageCode='10140SGMENU_10140SGMENU',appid='0001Z01000000000HXU1',appCode='10140SGMENU',cardPageCode='10140SGMENU_form1';
const urls = {
    'queryDetailUrl':'/nccloud/uapbd/sgmenu/queryDetail.do',
    'saveUrl':'/nccloud/uapbd/sgmenu/saveAction.do',
    'deleteUrl':'/nccloud/uapbd/sgmenu/deleteAction.do',
    'priceQueryUrl':'/nccloud/uapbd/sgmenu/priceQuery.do',
    'batchAddUrl':'/nccloud/uapbd/sgmenu/batchAdd.do',
    'print':'/nccloud/uapbd/sgmenu/print.do',
    'export':'/nccloud/uapbd/sgmenu/export.do'
};
class SgmenuPage extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            title:'',
            pageCode:"10140SGMENU_10140SGMENU",
            modalFormId:'',
            form1:{
              tableId:'material_vendor_table'
            },
            form2:{
                tableId:'vendor_mater_table'
            },
            batchForm:{
                pageCode:'10140SGMENU_batchAdd',
                formId:`batchForm`,
                tableId1:`marbasclass`,
                tableId2:`supplier_table`
            },
            appid:'0001Z01000000000HXU1'//按钮注册
        },this.props.config);
        if(this.config.pageCode == '10140SGMENU_10140SGMENU2')
            cardPageCode = '10140SGMENU_form2';

        this.state = {
            tab:0,
            status:'',
            moduleName:'uapbd',
            billType:'uapbd_sgmenu',
            selectedPKS:'',
            data:'',//导出配置
            editRecord:'',//当前编辑记录
            showReturn:false,//显示返回按钮
            json:{},
            inlt:{},
            isSave:false //用来将子组件form中state对应org值清空
        }
        this.changePage = this.changePage.bind(this);
        this.loadDetailData = this.loadDetailData.bind(this);
        this.loadFormPage = this.loadFormPage.bind(this);
        this.saveAllData = this.saveAllData.bind(this);
        this.onClickSearchBtn = this.onClickSearchBtn.bind(this);
        this.printPage = this.printPage.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.structSelectedRow = this.structSelectedRow.bind(this);

        let callback = (json,status,inlt)=> {
            this.state.json = json;//多语对象
            this.state.inlt = inlt;//用来处理占位符
            /* 国际化处理： 供应商供货目录*/
            this.config.title = this.state.json['10140SGMENU-000026'];
            this.state.title = this.state.json['10140SGMENU-000026'];

            this.initTemplate.call(this,this.props,(template)=>{
                this.state.pageid = template.pageid;
            });
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '10140SGMENU',domainName: 'uapbd',callback});

    }
    initTemplate = (props,callback)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: pageCode//页面id
                //appid: appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        /**
                         * 查询区参照处理
                         */
                        if(meta.queryCondition){
                            meta.queryCondition.items.forEach(item=>{
                                item.isMultiSelectedEnabled = true;
                                item.isShowDisabledData = true;
                                item.isShowUnit=true;
                                /*if(['pk_marbasclass.code','pk_srcmaterial.code'].includes(item.attrcode))
                                    item.isShowUnit=true;*/
                                if(item.attrcode.includes('pk_hierarchy'))
                                    item.isHasDisabledData=true;
                            });
                        }
                        if(meta.queryCondition2){
                            meta.queryCondition2.items.forEach(item=>{
                                item.isMultiSelectedEnabled = true;
                                item.isShowDisabledData = true;
                                item.isShowUnit=true;
                                /*if(item.attrcode=='pk_supplier.code'){
                                    item.isShowUnit=true;
                                }*/
                                if(item.attrcode.includes('pk_hierarchy'))
                                    item.isHasDisabledData=true;
                            });
                        }
                        meta['importLogs'] = {
                            "code": "importLogs",
                            "items": [{
                                label: me.state.json['10140SGMENU-000027'],/* 国际化处理： 行日志*/
                                attrcode: "linelog",
                                col: 4,
                                itemtype: "input",//select
                                visible: true,
                            }
                            ],
                            moduletype: "table",
                            name: "importLogs",
                            pagination: true,
                            vometa: "importLogs",
                            // status: 'browse'
                        }
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        let arr = [];
                        //uapbd 模块名  uapbd_sgmenu 单据类型名 回调函数直接进行复制
                        /*let excelimportconfig = Utils.getImportConfig("uapbd","UAPBD_SGMENU", arr.length,(resultinfo) => {
                            if(resultinfo == 'beginUpload'){
                                arr.push(1);
                                props.modal.show('import', {
                                    content: <ProcessArr toastArr={arr} upParams={{"moduleName":'uapbd',"billType":'UAPBD_SGMENU'}} />
                                });
                            }else{
                                props.table.setAllTableData('importLogs', resultinfo);
                                props.modal.show('hintimportLog');
                            }
                        });*/
                        props.button.setUploadConfig("Excel",excelImportconfig(props,"uapbd","uapbd_sgmenu",true,"",{},()=>{me.onClickSearchBtn()}));
                        props.button.setButtons(button);
                        buttonStatus(props,'browse');
                    }
                    callback && callback(data.template);
                }
            }
        )
    }
    show=(id)=>{
        let dom = document.getElementById(id);
        if(dom)
            dom.style.display='block';
    }
    hide=(id)=>{
        let dom = document.getElementById(id);
        if(dom)
            dom.style.display='none';
    }
    isShow=(id)=>{
        let dom = document.getElementById(id);
        if(dom && dom.style.display == 'block')
            return true;
        return false;
    }

    /**
     * 切换页面显示
     * @param isReturn
     */
    changePage(isReturn){
        let me = this;
        if(isReturn){
            /*me.props.button.setDisabled({
                'Edit':false,
                'Delete':false,
                'Refresh':false,
                'ExportData':false,
                'Output':false
            });*/
            me.hide('return');
            if(me.state.tab == 0){
                me.hide('form1');
                me.show('table1');
                me.show('search1');
                if(me.MaterialSgmenuTable.getHeadTableData().length == 0){
                    buttonStatus(me.props,'browse');
                }else{
                    buttonStatus(me.props,'query');
                }
                me.form1.button.setDisabled({
                    'Edit':false
                });
            }else{
                me.hide('form2');
                me.show('table2');
                me.show('search2');
                if(me.SupplierSgmenuTable.getHeadTableData().length== 0){
                    buttonStatus(me.props,'browse');
                }else{
                    buttonStatus(me.props,'query');
                }
                me.form2.button.setDisabled({
                    'Edit':false
                });
            }
        }else{
            if(me.state.tab == 0){
                me.show('form1');
                me.form1.button.setDisabled({
                    'AddLine':false
                });
                me.hide('table1');
                me.hide('search1');
                if(me.state.status == 'add'){
                    me.form1.button.setButtonVisible('AddLine',false);
                    me.form1.form.setFormStatus(`form`,'edit');
                    me.form1.form.EmptyAllFormValue('form');
                    me.form1.form.EmptyAllFormValue('material_vendor_form');
                    me.form1.cardTable.setTableData('material_vendor_table',{rows:[]});
                }else
                    me.form1.button.setButtonVisible('AddLine',true);
                me.form1.form.resetItemWidth(`form`);
                me.form1.form.resetItemWidth('material_vendor_form');
            }else{
                me.show('form2');
                me.form2.button.setDisabled({
                    'AddLine':false
                });
                me.hide('table2');
                me.hide('search2');
                if(me.state.status == 'add'){
                    me.form2.button.setButtonVisible('AddLine',false);
                    me.form2.form.setFormStatus(`form2`,'edit');
                    me.form2.form.EmptyAllFormValue('form2');
                    me.form2.form.EmptyAllFormValue('vendor_mater_form');
                    me.form2.cardTable.setTableData('vendor_mater_table',{rows:[]});
                }else
                    me.form2.button.setButtonVisible('AddLine',true);
                me.form2.form.resetItemWidth(`form2`);
                me.form2.form.resetItemWidth('vendor_mater_form');
            }
            //me.show('return');
            buttonStatus(me.props,'edit');
        }
    }
    /**
     * 修改查询table数据
     */
    loadDetailData = (props,selectedRow,isRefresh,callback)=>{
        var me = this;
        let tableId = me.state.tab == 0 ? 'material_vendor_table' : 'vendor_mater_table';
        let formId = me.state.tab == 0 ? 'material_vendor_form' : 'vendor_mater_form';
        let orgFormId = me.state.tab == 0 ? 'form' : 'form2';
        let requestParam = {
            pk:me.state.tab == 0 ? (selectedRow.pk_material ? selectedRow.pk_material : 'a') : (selectedRow.pk_supplier ? selectedRow.pk_supplier : 'a'),
            pk_marbasclass:selectedRow.pk_marbasclass ? selectedRow.pk_marbasclass : 'a',
            pk_org:selectedRow.pk_org,
            pageCode:me.state.tab == 0 ? '10140SGMENU_form1' : '10140SGMENU_form2',
            tab:`${me.state.tab}`
        }
        ajax({
            url: urls["queryDetailUrl"],
            data:requestParam,
            success: (res) =>{
                let{data,success,formulamsg}=res;
                if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                    props.dealFormulamsg(
                        formulamsg,
                        {
                            [orgFormId]:'form',
                            [formId]:'form',
                            [tableId]:'cardTable'
                        }
                    );
                }
                if(success){
                    if(data)
                        props.cardTable.setTableData(tableId,data[tableId]);
                    else
                        props.cardTable.setTableData(tableId,{rows:[]});
                    if(callback)
                        callback();
                }
            }
        });
        !isRefresh && props.cardTable.setStatus(tableId,'edit');
    }

    /**
     * 修改--加载页面数据
     * @param selectedRow
     */
    loadFormPage(selectedRow,isRefresh){
        var me = this;
        //因修改并不能更改采购组织和表头form信息，故此处直接将选中行采购组织和表头form信息赋值给对应区域，不去后台获取
        if(me.state.tab == 0){
            me.form1.form.setFormItemsValue('form',{'pk_org':{value:selectedRow.pk_org,display:selectedRow.stockname}});
            me.form1.form.setFormStatus('form','browse');
            me.form1.form.setFormStatus('material_vendor_form','browse');
            me.form1.form.setFormItemsValue('material_vendor_form',{
                'pk_marbasclass':{value:selectedRow[`pk_marbasclass`],display:selectedRow[`classcode`]},
                'pk_marbasclass.name':{value:selectedRow[`classname`]},
                'pk_material':{value:selectedRow['pk_material'],display:selectedRow[`materialcode`]},
                'pk_material.name':{value:selectedRow[`materialname`]},
                'pk_material.materialspec':{value:selectedRow[`materialspec`]},
                'pk_material.materialtype':{value:selectedRow[`materialtype`]},
                'pk_material.pk_measdoc':{value:selectedRow[`pk_measdoc`],display:selectedRow[`measname`]},
                'pk_group':{value:selectedRow[`pk_group`]},
                pk_vendorstock:{value:selectedRow['pk_vendorstock']}
            });
            me.loadDetailData(me.form1,selectedRow,isRefresh,()=>{isRefresh && toast({title:this.state.json['10140SGMENU-000049'],color:'success'});/* 国际化处理： 刷新成功！*/});
        }else{
            me.form2.form.setFormItemsValue('form2',{'pk_org':{value:selectedRow.pk_org,display:selectedRow.stockname}});
            me.form2.form.setFormStatus('form2','browse');
            me.form2.form.setFormStatus('vendor_mater_form','browse');
            me.form2.form.setFormItemsValue('vendor_mater_form',{
                'pk_supplier':{value:selectedRow[`pk_supplier`],display:selectedRow[`suppliercode`]||selectedRow[`pk_supplier.code`] },
                'pk_supplier.name':{value:selectedRow[`suppliername`] || selectedRow[`pk_supplier.name`]},
                'pk_group':{value:selectedRow[`pk_group`]},
                pk_vendorstock:{value:selectedRow['pk_vendorstock']}
            });
            me.loadDetailData(me.form2,selectedRow,isRefresh,()=>{isRefresh && toast({title:this.state.json['10140SGMENU-000049'],color:'success'});/* 国际化处理： 刷新成功！*/});
        }
    }

    /**
     * 卡片界面根据当前卡片值 拼接需要的列表 selectedRow
     * @param obj
     * @returns {*}
     */
    structSelectedRow(obj){
        let me = this;
        let {selectedRow,formid} = obj,dealSelectedRow=null;
        //卡片界面
        if(me.isShow(formid)) {
            //手动拼接loadFormPage方法中selectedRow，避免新增保存后 进行刷新时 加载的记录并不是刚新增的那条
            let pkOrg, formVal;
            if (me.state.tab == 0) {
                pkOrg = me.form1.form.getFormItemsValue(`form`, `pk_org`);
                formVal = me.form1.form.getAllFormValue(`material_vendor_form`);
                if (formVal && formVal.rows && formVal.rows[0] && formVal.rows[0].values) {
                    dealSelectedRow = {
                        pk_org: pkOrg.value,
                        stockname: pkOrg.display,
                        pk_group:formVal.rows[0].values.pk_group.value,
                        pk_vendorstock:me.state.editRecord.pk_head,
                        pk_marbasclass: formVal.rows[0].values.pk_marbasclass.value,
                        classcode: formVal.rows[0].values.pk_marbasclass.display,
                        classname: formVal.rows[0].values['pk_marbasclass.name'].value,
                        pk_material: formVal.rows[0].values.pk_material.value,
                        materialcode: formVal.rows[0].values.pk_material.display,
                        materialname: formVal.rows[0].values['pk_material.name'].value,
                        materialspec: formVal.rows[0].values['pk_material.materialspec'].value,
                        materialtype: formVal.rows[0].values['pk_material.materialtype'].value,
                        pk_measdoc: formVal.rows[0].values['pk_material.pk_measdoc'].value,
                        measname: formVal.rows[0].values['pk_material.pk_measdoc'].display
                    }
                }
            } else {
                pkOrg = me.form2.form.getFormItemsValue(`form2`, `pk_org`);
                formVal = me.form2.form.getAllFormValue(`vendor_mater_form`);
                if (formVal && formVal.rows && formVal.rows[0] && formVal.rows[0].values) {
                    dealSelectedRow = {
                        pk_org: pkOrg.value,
                        stockname: pkOrg.display,
                        pk_group:formVal.rows[0].values.pk_group.value,
                        pk_vendorstock:me.state.editRecord.pk_head,
                        pk_supplier: formVal.rows[0].values.pk_supplier.value,
                        suppliercode: formVal.rows[0].values.pk_supplier.display,
                        suppliername: formVal.rows[0].values['pk_supplier.name'].value
                    }
                }
            }
        }else
            dealSelectedRow = selectedRow;
        return dealSelectedRow;
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        var me = this;
        if(Array.isArray(props)){
            id = props[1];
        }
        let selectedRow = me.state.tab == 1 ? me.SupplierSgmenuTable.getSelectedRow() : me.MaterialSgmenuTable.getSelectedRow();
        let formid = me.state.tab == 0 ? 'form1' : 'form2';
        let selectedHeadRow = me.structSelectedRow({formid,selectedRow});

        switch (id) {
            case 'Add':
                //me.state.status = 'add';
                me.setState({
                    showReturn:false,
                    status:'add',
                    curStatus:'add',
                    isSave:false
                },()=>{
                    me.changePage();
                });
                break;
            case 'Edit':
                if(!me.isShow(formid)){
                    if(!selectedRow){
                        toast({content: me.state.json['10140SGMENU-000028'], color: 'warning'});/* 国际化处理： 请选中需要修改的记录*/
                        return;
                    }
                    me.loadFormPage(selectedRow);
                }
                me.setState({
                    showReturn:false,
                    status:'update',
                    curStatus:'update',
                    isSave:false
                },()=>{
                    me.changePage();
                });
                break;
            case 'Delete':
                if(!selectedHeadRow){
                    toast({content: me.state.json['10140SGMENU-000029'], color: 'warning'});/* 国际化处理： 请选中需要删除的记录*/
                    return;
                }
                promptBox({
                    color:'warning',
                    noFooter:false,
                    userControl:false,
                    title: me.state.json['10140SGMENU-000030'],/* 国际化处理： 确认删除*/
                    content: me.state.json['10140SGMENU-000031'],/* 国际化处理： 您确认要删除所选的数据吗？*/
                    leftBtnName:me.state.json['10140SGMENU-000032'],/* 国际化处理： 确认*/
                    rightBtnName:me.state.json['10140SGMENU-000033'],/* 国际化处理： 取消*/
                    beSureBtnClick:me.deleteSelectedData.bind(this,selectedHeadRow)
                });
                break;
            case 'Refresh':
                //卡片界面
                if(me.isShow(formid)){
                    //手动拼接loadFormPage方法中selectedRow，避免新增保存后 进行刷新时 加载的记录并不是刚新增的那条
                    selectedHeadRow && me.loadFormPage(selectedHeadRow,true);
                    !selectedHeadRow && toast({title:me.state.json['10140SGMENU-000049'],color:'success'});/* 国际化处理： 刷新成功！*/
                }else{
                    me.onClickSearchBtn()
                }
                /*if(me.state.tab == 0){
                    //卡片界面
                    if(me.isShow('form1')){
                        //手动拼接loadFormPage方法中selectedRow，避免新增保存后 进行刷新时 加载的记录并不是刚新增的那条
                        let pkOrg = me.form1.form.getFormItemsValue(`form`,`pk_org`);
                        let formVal = me.form1.form.getAllFormValue(`material_vendor_form`);
                        let dealSelectedRow = null;
                        if(formVal && formVal.rows && formVal.rows[0] && formVal.rows[0].values){
                            dealSelectedRow = {
                                pk_org:pkOrg.value,
                                stockname:pkOrg.display,
                                pk_marbasclass:formVal.rows[0].values.pk_marbasclass.value,
                                classcode:formVal.rows[0].values.pk_marbasclass.display,
                                classname:formVal.rows[0].values['pk_marbasclass.name'].value,
                                pk_material:formVal.rows[0].values.pk_material.value,
                                materialcode:formVal.rows[0].values.pk_material.display,
                                materialname:formVal.rows[0].values['pk_material.name'].value,
                                materialspec:formVal.rows[0].values['pk_material.materialspec'].value,
                                materialtype:formVal.rows[0].values['pk_material.materialtype'].value,
                                pk_measdoc:formVal.rows[0].values['pk_material.pk_measdoc'].value,
                                measname:formVal.rows[0].values['pk_material.pk_measdoc'].display
                            }
                        }
                        dealSelectedRow && me.loadFormPage(dealSelectedRow,true);
                        !dealSelectedRow && toast({title:me.state.json['10140SGMENU-000049'],color:'success'});/!* 国际化处理： 刷新成功！*!/
                    }else{
                        me.onClickSearchBtn()
                    }
                }else{
                    //卡片界面
                    if(me.isShow('form2')){
                        //手动拼接loadFormPage方法中selectedRow，避免新增保存后 进行刷新时 加载的记录并不是刚新增的那条
                        let pkOrg = me.form2.form.getFormItemsValue(`form`,`pk_org`);
                        let formVal = me.form2.form.getAllFormValue(`vendor_material_form`);
                        let dealSelectedRow = null;
                        if(formVal && formVal.rows && formVal.rows[0] && formVal.rows[0].values){
                            dealSelectedRow = {
                                pk_org:pkOrg.value,
                                stockname:pkOrg.display,
                                pk_supplier:formVal.rows[0].values.pk_supplier.value,
                                suppliercode:formVal.rows[0].values.pk_supplier.display,
                                suppliername:formVal.rows[0].values['pk_supplier.name'].value
                            }
                        }
                        dealSelectedRow && me.loadFormPage(dealSelectedRow,true);
                        !dealSelectedRow && toast({title:me.state.json['10140SGMENU-000049'],color:'success'});/!* 国际化处理： 刷新成功！*!/
                    }else{
                        me.onClickSearchBtn()
                    }
                }*/
                break;
            case 'Return':
                me.state.showReturn = false;
                me.setState(me.state,()=>{me.changePage('return');});
                break;
            case 'BatchAdd':
                me.props.modal.show(`modal`,{
                    noFooter:false,
                    userControl:true,
                    hasBackdrop:true,
                    closeByClickBackDrop:true,
                    title:me.state.json['10140SGMENU-000034'],/* 国际化处理： 批量新增*/
                    content:<SgmenuBatchAdd {...{json:me.state.json}} ref={(SgmenuBatchAdd)=>{this.SgmenuBatchAdd=SgmenuBatchAdd}}/>,
                    leftBtnName:me.state.json['10140SGMENU-000034'],/* 国际化处理： 批量新增*/
                    rightBtnName:me.state.json['10140SGMENU-000033'],/* 国际化处理： 取消*/
                    beSureBtnClick:me.batchAddSave.bind(this),
                    cancelBtnClick:()=>{
                        me.props.modal.close('modal');
                    }
                });
                break;
            case 'Save':
                me.saveAllData();
                break;
            case 'Cancel':
                promptBox({
                    noFooter:false,
                    userControl:false,
                    color:'warning',
                    title: me.state.json['10140SGMENU-000035'],/* 国际化处理： 确认取消*/
                    content: me.state.json['10140SGMENU-000036'],/* 国际化处理： 是否确认取消？*/
                    leftBtnName:me.state.json['10140SGMENU-000032'],/* 国际化处理： 确认*/
                    rightBtnName:me.state.json['10140SGMENU-000033'],/* 国际化处理： 取消*/
                    beSureBtnClick:me.cancelEdit.bind(this)
                });
                break;
            case 'PriceQuery':
                let selectedBodyRow = null,clickRecord = null;
                if(me.isShow(formid)){
                    if(me.state.tab == 1)
                        clickRecord = me.form2.cardTable.getClickRowIndex(me.config.form2.tableId);
                    else
                        clickRecord = me.form1.cardTable.getClickRowIndex(me.config.form1.tableId);
                    if(clickRecord && clickRecord.record)
                        selectedBodyRow = {
                            pk_org:clickRecord.record.values.pk_org ? clickRecord.record.values.pk_org.value : '',
                            pk_material:clickRecord.record.values.pk_material ? clickRecord.record.values.pk_material.value : '',
                            pk_supplier:clickRecord.record.values.pk_supplier ? clickRecord.record.values.pk_supplier.value : ''
                        }
                }else{
                    if(me.state.tab == 1)
                        selectedBodyRow = me.SupplierSgmenuTable.getSelectedBodyRow();
                    else
                        selectedBodyRow = me.MaterialSgmenuTable.getSelectedBodyRow();
                }
                /*if(me.state.tab == 1) {
                    if(me.isShow(`form2`)){
                        clickRecord = me.form2.cardTable.getClickRowIndex(me.config.form2.tableId);
                        if(clickRecord && clickRecord.record)
                            selectedBodyRow = {
                                pk_org:clickRecord.record.values.pk_org ? clickRecord.record.values.pk_org.value : '',
                                pk_material:clickRecord.record.values.pk_material ? clickRecord.record.values.pk_material.value : '',
                                pk_supplier:clickRecord.record.values.pk_supplier ? clickRecord.record.values.pk_supplier.value : ''
                            }
                    }else
                        selectedBodyRow = me.SupplierSgmenuTable.getSelectedBodyRow();
                }else{
                    if(me.isShow(`form1`)){
                        clickRecord = me.form1.cardTable.getClickRowIndex(me.config.form1.tableId);
                        if(clickRecord && clickRecord.record  && clickRecord.record.values)
                            selectedBodyRow = {
                                pk_org:clickRecord.record.values.pk_org ? clickRecord.record.values.pk_org.value : '',
                                pk_material:clickRecord.record.values.pk_material ? clickRecord.record.values.pk_material.value : '',
                                pk_supplier:clickRecord.record.values.pk_supplier ? clickRecord.record.values.pk_supplier.value : ''
                            }
                    }else
                        selectedBodyRow = me.MaterialSgmenuTable.getSelectedBodyRow();
                }*/

                if(!selectedBodyRow){
                    toast({content: me.state.json['10140SGMENU-000037'], color: 'warning'});/* 国际化处理： 请在表体中选择一条记录*/
                    return;
                }
                me.PrinceQueryTable.loadHeadTableData(selectedBodyRow,()=>{
                    me.props.modal.show('price',{
                        title:me.state.json['10140SGMENU-000038'],/* 国际化处理： 供应商存货价格查询*/
                        noFooter:true,
                        content:<PrinceQueryTable {...{json:me.state.json}}/>,
                        leftBtnName:'',
                        rightBtnName:''
                    });
                });
                break;
            case 'Export'://导出模板
                me.setState({
                    selectedPKS:''
                },()=>{
                    me.props.modal.show('exportFileModal');
                });
                break;
            case 'ExportData':
                let arr;
                if(me.state.tab == 1) {
                    arr = [selectedHeadRow.pk_supplier,selectedHeadRow.pk_org];
                }else{
                    //pks = me.MaterialSgmenuTable.getSelectedRow();
                    arr = [selectedHeadRow.pk_material || selectedHeadRow.pk_marbasclass,selectedHeadRow.pk_org];
                }
                if(!selectedHeadRow){
                    toast({content: me.state.json['10140SGMENU-000039'], color: 'warning'});/* 国际化处理： 请选择需要导出的记录*/
                    return;
                }
                me.setState({
                    selectedPKS:arr
                },()=>{
                    me.props.modal.show('exportFileModal');
                });
                break;
            case 'Print'://打印
                this.printPage('print',selectedHeadRow);
                break;
            case 'Output'://输出
                let funcnode = '10140SGMENU';
                let nodekey='';
                let currNode={};

                if(me.state.tab == 0) {
                    nodekey = '10140SGMENU';
                    //currNode = me.MaterialSgmenuTable.getSelectedRow();
                }else {
                    nodekey = '10140SGMENU2';
                    //currNode = me.SupplierSgmenuTable.getSelectedRow();
                }
                currNode = selectedHeadRow;
                let config = {
                    funcode:funcnode,//功能节点编码
                    nodekey:nodekey,//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.pk_vendorstock],
                    outputType:'output',
                    userjson:`{tab:'${me.state.tab}',pk_group:'${currNode.pk_group}',pk_org:'${currNode.pk_org}'}`
                }
                me.setState({
                    data:config
                },()=>{me.refs.printOutput.open()});
                //this.printPage.call('output');
                break;
        }
    }
    printPage(flag,selectedHeadRow){
        var me = this;
        let funcnode = '10140SGMENU';
        let nodekey='';
        let currNode={};

        if(me.state.tab == 0) {
            nodekey = '10140SGMENU';
            /*currNode = me.MaterialSgmenuTable.getSelectedRow();
            if(me.state.status == 'add')//处理新增后在卡片页面情况
                currNode = me.state.editRecord;*/
        }else {
            nodekey = '10140SGMENU2';
            /*currNode = me.SupplierSgmenuTable.getSelectedRow();
            if(me.state.status == 'add')
                currNode = me.state.editRecord;*/
        }
        //兼容直接新增留在卡片界面
        if(selectedHeadRow)  currNode = selectedHeadRow;
        if(!currNode.pk_vendorstock){
            toast({content: me.state.json['10140SGMENU-000040'], color: 'warning'});/* 国际化处理： 请选择要打印的记录*/
            return;
        }
        if(flag == 'output'){
            //增加一个参数，设置为false，用用选择默认，使用默认模板打印
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    nodekey:nodekey,//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.pk_vendorstock],
                    outputType:'output',
                    userjson:`{tab:'${me.state.tab}',pk_group:'${currNode.pk_group}',pk_org:'${currNode.pk_org}'}`
                },false
            );
        }else{
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    nodekey:nodekey,//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.pk_vendorstock],
                    userjson:`{tab:'${me.state.tab}',pk_group:'${currNode.pk_group}',pk_org:'${currNode.pk_org}'}`
                }
            );
        }
    }
    /**
     * 批量新增保存
     */
    batchAddSave(callback){
        var me = this;
        let pk_org = me.SgmenuBatchAdd.form.getFormItemsValue(me.config.batchForm.formId,'pk_org');
        me.SgmenuBatchAdd.cardTable.filterEmptyRows(me.config.batchForm.tableId1,[`pk_marbasclass`],`include`);
        me.SgmenuBatchAdd.cardTable.filterEmptyRows(me.config.batchForm.tableId2,[`pk_supplier`],`include`);

        let pk_materials = me.SgmenuBatchAdd.cardTable.getColValue(me.config.batchForm.tableId1,'pk_marbasclass');
        let pk_suppliers = me.SgmenuBatchAdd.cardTable.getColValue(me.config.batchForm.tableId2,'pk_supplier');

        if(pk_materials){
            pk_materials = pk_materials.map((item)=>{
                return item.value;
            });
        }
        if(pk_suppliers){
            pk_suppliers = pk_suppliers.map((item)=>{
                return item.value;
            });
        }
        if(!pk_org.value){
            toast({content:me.state.json['10140SGMENU-000043'],color:'warning'});
            return;
        }
        if(!pk_materials || pk_materials.length==0){
            toast({content:me.state.json['10140SGMENU-000100'],color:'warning'});
            return;
        }
        if(!pk_suppliers || pk_suppliers.length==0){
            toast({content:me.state.json['10140SGMENU-000101'],color:'warning'});
            return;
        }
        //校验公式
        let formData = me.SgmenuBatchAdd.form.getAllFormValue(me.config.batchForm.formId);
        formData.areacode = me.config.batchForm.formId;
        let tableData1 = me.SgmenuBatchAdd.cardTable.getAllData(me.config.batchForm.tableId1);
        tableData1.areacode = me.config.batchForm.tableId1;
        let tableData2 = me.SgmenuBatchAdd.cardTable.getAllData(me.config.batchForm.tableId2);
        tableData2.areacode = me.config.batchForm.tableId2;

        let business = ()=>{
            let requestParam = {
                pk_org:pk_org.value,
                pk_materials:pk_materials ? pk_materials.join(',') : '',
                pk_suppliers:pk_suppliers ? pk_suppliers.join(',') : '',
            }
            ajax({
                url: urls["batchAddUrl"],
                data:requestParam,
                success: (res) =>{
                    let{success}=res;
                    if(success){
                        toast({title:me.state.json['10140SGMENU-000041'],color:'success'});/* 国际化处理： 批量新增成功！*/
                        me.props.modal.close(`modal`);
                        me.onClickSearchBtn(me.props);
                        callback && callback();
                    }
                }
            });
        }
        me.SgmenuBatchAdd.validateToSave({model:formData,pageid:me.config.batchForm.pageCode},()=>{
            me.SgmenuBatchAdd.validateToSave({model:tableData1,pageid:me.config.batchForm.pageCode},()=>{
                me.SgmenuBatchAdd.validateToSave({model:tableData2,pageid:me.config.batchForm.pageCode},business,{[me.config.batchForm.tableId2]:'grid'},'grid');
            },{[me.config.batchForm.tableId1]:'grid'},'grid');
        },{[me.config.batchForm.formId]:'form'},'form');
    }
    /**
     * 删除选中数据
     */
    deleteSelectedData(selectedRow,callback){
        var me = this;
        let tableData;
        let formid = me.state.tab == 0 ? 'form1' : 'form2';
        if(me.state.tab == 0) {
            if(me.isShow(`form1`))
                tableData = me.form1.cardTable.getAllData(me.config.form1.tableId).rows;
            else
                tableData = me.MaterialSgmenuTable.getFormatBodyTableData();
        }else {
            if(me.isShow(`form2`))
                tableData = me.form2.cardTable.getAllData(me.config.form2.tableId).rows;
            else
                tableData = me.SupplierSgmenuTable.getFormatBodyTableData();
        }
        let requestParam = {
            pageid: '10140SGMENU_10140SGMENU2',
            model:{
                areacode:'material_vendor_b',
                areaType:'table',
                rows:tableData
            },
            userjson:`{
                tab:'0',
                pk_org_v:${selectedRow.pk_org_v},
                pk_org:${selectedRow.pk_org},
                pk_group:${selectedRow.pk_group},
                pk_marbasclass:${selectedRow.pk_marbasclass ? selectedRow.pk_marbasclass : 'a'},
                pk_material:${selectedRow.pk_material ? selectedRow.pk_material : 'a'}
            }`
        }
        if(me.state.tab == 1){
            requestParam = {
                pageid: '10140SGMENU_10140SGMENU2',
                model:{
                    areacode:'vendor_mater_b',
                    areaType:'table',
                    rows:tableData
                },
                userjson:`{
                    tab:'1',
                    pk_org_v:${selectedRow.pk_org_v},
                    pk_org:${selectedRow.pk_org},
                    pk_group:${selectedRow.pk_group},
                    pk_supplier:${selectedRow.pk_supplier ? selectedRow.pk_supplier : 'a'}
                }`
            }
        }
        ajax({
            url: urls["deleteUrl"],
            data:requestParam,
            success: (res) =>{
                let{success}=res;
                if(success){
                    toast({title:me.state.json['10140SGMENU-000042'],color:"success"});/* 国际化处理： 删除成功！*/

                    let headData,tempProps,pageInfo;
                    if(me.state.tab == 0){
                        headData = me.MaterialSgmenuTable.getHeadTableData();
                        pageInfo = me.MaterialSgmenuTable.getHeadTablePageInfo();
                        tempProps = `MaterialSgmenuTable`;
                    }else{
                        headData = me.SupplierSgmenuTable.getHeadTableData();
                        pageInfo = me.SupplierSgmenuTable.getHeadTablePageInfo();
                        tempProps = `SupplierSgmenuTable`;
                    }
                    //区别是否是删除后导致改页没有数据，如果是，且当前页大于1，则手动设置当前页-1
                    let isCurrPageNoData = headData.length == 1 && pageInfo.pageIndex > 1;
                    if(me.isShow(formid)){
                        let isListHasData = headData.length > 0 || isCurrPageNoData;
                        if(isListHasData){
                            //重新加载列表数据，确保数据最新
                            me.onClickSearchBtn(me.props,null,true);
                            if(me.state.tab == 0){
                                headData = me.MaterialSgmenuTable.getHeadTableData();
                            }else{
                                headData = me.SupplierSgmenuTable.getHeadTableData();
                            }
                            me.loadFormPage(headData[0]);
                        }else{
                            me[formid].form.EmptyAllFormValue(me.state.tab == 0 ? 'form' : 'form2');
                            if(me.state.tab == 0){
                                me[formid].form.EmptyAllFormValue('material_vendor_form');
                                me[formid].cardTable.setTableData(me.config.form1.tableId,{rows:[]});
                            }else{
                                me[formid].form.EmptyAllFormValue('vendor_mater_form');
                                me[formid].cardTable.setTableData(me.config.form2.tableId,{rows:[]});
                            }
                            me.props.button.setDisabled({
                                'Edit':true,
                                'Delete':true,
                                'ExportData':true,
                                'Print':true,
                                'Output':true
                            });
                        }
                    }else{
                        if(isCurrPageNoData)
                            me[tempProps].setHeadTablePageIndex(null,()=>{me.onClickSearchBtn(me.props);});
                        else
                            me.onClickSearchBtn(me.props);
                    }
                    callback && callback();

                }
            }
        });
    }
    /**
     * 保存
     */
    saveAllData(callback){
        var me = this;
        if(me.state.tab == 0){
            let pk_org_v = me.form1.form.getFormItemsValue(`form`,'pk_org');
            let pk_marbasclass = me.form1.form.getFormItemsValue(`material_vendor_form`,'pk_marbasclass');
            let pk_material = me.form1.form.getFormItemsValue(`material_vendor_form`,'pk_material');
            pk_org_v = pk_org_v ? pk_org_v.value : 'a';
            pk_marbasclass = pk_marbasclass ? pk_marbasclass.value : 'a';
            pk_material = pk_material ? pk_material.value : 'a';
            if(!pk_org_v){
                toast({content: me.state.json['10140SGMENU-000043'], color: 'warning'});/* 国际化处理： 采购组织不能为空*/
                return;
            }
            if(!pk_marbasclass && !pk_material){
                toast({content: me.state.json['10140SGMENU-000044'], color: 'warning'});/* 国际化处理： 物料或物料基本分类信息不能为空*/
                return;
            }
            //排除未选择供应商的记录
            me.form1.cardTable.filterEmptyRows(`material_vendor_table`,[`pk_supplier`],'include');
            let tableData  = me.form1.cardTable.getAllData(`material_vendor_table`);
            tableData.areacode = `material_vendor_table`;
            if(tableData.rows.length == 0){
                toast({content: me.state.json['10140SGMENU-000045'], color: 'warning'});/* 国际化处理： 表体供应商不能为空*/
                return;
            }
            let temp = tableData.rows.filter((item,index)=>{
                return item.values.pk_vendorstock.value;
            });
            let status = me.state.status;
            if(temp && temp.length > 0)
                status = 'edit';
            //校验公式
            let orgFormData = me.form1.form.getAllFormValue('form');
            orgFormData.areacode = 'form';
            let formData = me.form1.form.getAllFormValue('material_vendor_form');
            formData.areacode = 'material_vendor_form';
            let business = ()=>{
                let requestParam = {
                    pageid:`10140SGMENU_form1`,
                    model:tableData,
                    userjson:`{
                    tab:'0',
                    status:${status},
                    pk_org_v:${pk_org_v},
                    pk_marbasclass:${pk_marbasclass ? pk_marbasclass : 'a'},
                    pk_material:${pk_material ? pk_material : 'a'}
                }`
                }
                ajax({
                    url: urls["saveUrl"],
                    data:requestParam,
                    success: (res) =>{
                        let{data,success}=res;
                        if(success){
                            if(data){
                                let {head,table} = data;
                                me.setState({
                                    showReturn:true,
                                    status:'save',
                                    editRecord:head,
                                    isSave:true
                                },()=>{
                                    me.form1.cardTable.setTableData(`material_vendor_table`,table['material_vendor_table']);
                                    //设置pk_group 和 pk_vendorstock
                                    me.form1.form.setFormItemsValue(`material_vendor_form`,{
                                        pk_group:head.PK_GROUP
                                    });
                                });
                            }
                            else
                                me.form1.cardTable.setTableData(`material_vendor_table`,{rows:[]});
                            me.form1.button.setButtonVisible('AddLine',false);
                            me.form1.button.setDisabled({
                                'AddLine':true
                            });
                            me.form1.form.setFormStatus(`form`,'browse');
                            me.form1.form.setFormStatus(`material_vendor_form`,'browse');
                            me.form1.cardTable.setStatus(`material_vendor_table`,'browse');
                            toast({title:me.state.json['10140SGMENU-000046'],color:"success"});/* 国际化处理： 保存成功！*/
                            buttonStatus(me.props,'save');
                            if(callback)
                                callback();
                        }
                    }
                });
            }

            me.form1.validateToSave({model:orgFormData,pageid:`10140SGMENU_form1`},()=>{
                me.form1.validateToSave({model:formData,pageid:`10140SGMENU_form1`},()=>{
                    me.form1.validateToSave({model:tableData,pageid:`10140SGMENU_form1`},business,{'material_vendor_table':'grid'},'grid');
                },{'material_vendor_form':'form'},'form');
            },{'form':'form'},'form');
        }else{
            let pk_org_v = me.form2.form.getFormItemsValue(`form2`,'pk_org');
            let pk_supplier = me.form2.form.getFormItemsValue(`vendor_mater_form`,'pk_supplier');
            pk_org_v = pk_org_v ? pk_org_v.value : '';
            pk_supplier = pk_supplier ? pk_supplier.value : '';
            if(!pk_org_v){
                toast({content: me.state.json['10140SGMENU-000043'], color: 'warning'});/* 国际化处理： 采购组织不能为空*/
                return;
            }
            if(!pk_supplier){
                toast({content: me.state.json['10140SGMENU-000047'], color: 'warning'});/* 国际化处理： 供应商不能为空*/
                return;
            }
            //排除未选择物料的记录
            me.form2.cardTable.filterEmptyRows(`vendor_mater_table`,[`pk_material`,'pk_marbasclass'],'include');
            let tableData  = me.form2.cardTable.getAllData(`vendor_mater_table`);
            tableData.areacode = `vendor_mater_table`;
            if(tableData.rows.length == 0){
                toast({content: me.state.json['10140SGMENU-000048'], color: 'warning'});/* 国际化处理： 表体物料不能为空*/
                return;
            }
            let temp = tableData.rows.filter((item,index)=>{
                return item.values.pk_vendorstock.value;
            });
            let status = me.state.status;
            if(temp && temp.length > 0)
                status = 'edit';
            //校验公式
            let orgFormData = me.form2.form.getAllFormValue('form2');
            orgFormData.areacode = 'form2';
            let formData = me.form2.form.getAllFormValue('vendor_mater_form');
            formData.areacode = 'vendor_mater_form';
            let business = ()=>{
                let requestParam = {
                    pageid:`10140SGMENU_form2`,
                    model:tableData,
                    userjson:`{
                    tab:'1',
                    status:${status},
                    pk_org_v:${pk_org_v},
                    pk_supplier:${pk_supplier ? pk_supplier : 'a'}
                }`
                }
                ajax({
                    url: urls["saveUrl"],
                    data:requestParam,
                    success: (res) =>{
                        let{data,success}=res;
                        if(success){
                            if(data){
                                let {head,table} = data;
                                me.setState({
                                    showReturn:true,
                                    status:'save',
                                    editRecord:head,
                                    isSave:true
                                },()=>{
                                    me.form2.cardTable.setTableData(`vendor_mater_table`,table['vendor_mater_table']);
                                    //设置pk_group 和 pk_vendorstock
                                    me.form2.form.setFormItemsValue(`material_vendor_form`,{
                                        pk_group:head.PK_GROUP
                                    });
                                });
                            }
                            else
                                me.form2.cardTable.setTableData(`vendor_mater_table`,{rows:[]});
                            me.form2.button.setButtonVisible('AddLine',false);
                            me.form2.button.setDisabled({
                                'AddLine':true
                            });
                            me.form2.form.setFormStatus(`form2`,'browse');
                            me.form2.form.setFormStatus(`vendor_mater_form`,'browse');
                            me.form2.cardTable.setStatus(`vendor_mater_table`,'browse');
                            toast({title:me.state.json['10140SGMENU-000046'],color:"success"});/* 国际化处理： 保存成功！*/
                            buttonStatus(me.props,'save');
                            if(callback)
                                callback();
                        }
                    }
                });
            }
            me.form2.validateToSave({model:orgFormData,pageid:`10140SGMENU_form2`},()=>{
                me.form2.validateToSave({model:formData,pageid:`10140SGMENU_form2`},()=>{
                    me.form1.validateToSave({model:tableData,pageid:`10140SGMENU_form2`},business,{'vendor_mater_table':'grid'},'grid');
                },{'vendor_mater_form':'form'},'form');
            },{'form':'form2'},'form');
        }
    }
    /**
     * 取消编辑
     */
    cancelEdit(){
        var me = this;
        me.setState({
            status:'cancel',
            showReturn:true
        },()=>{
            if(me.state.tab == 0){
                me.form1.form.setFormStatus(`form`,'browse');
                me.form1.form.setFormStatus(`material_vendor_form`,'browse');
                me.form1.cardTable.setStatus(`material_vendor_table`,'browse');
                //只有新增时撤销表单的修改
                if(me.state.curStatus == 'add'){
                    me.form1.form.cancel(`form`);
                    me.form1.form.cancel(`material_vendor_form`);
                    me.props.button.setDisabled({
                        'Edit':true,
                        'Delete':true,
                        'Refresh':true,
                        'ExportData':true,
                        'Print':true,
                        'Output':true
                    });
                }else{
                    me.props.button.setDisabled({
                        'Edit':false,
                        'Delete':false,
                        'Refresh':false,
                        'ExportData':false,
                        'Print':false,
                        'Output':false
                    });
                }
                me.form1.cardTable.resetTableData(`material_vendor_table`);
                me.form1.button.setButtonVisible('AddLine',!this.state.showReturn);
                me.form1.button.setDisabled({
                    'AddLine':true
                });
            }else{
                me.form2.form.setFormStatus(`form2`,'browse');
                me.form2.form.setFormStatus(`vendor_mater_form`,'browse');
                me.form2.cardTable.setStatus(`vendor_mater_table`,'browse');
                if(me.state.curStatus == 'add'){
                    me.form2.form.cancel(`form2`);
                    me.form2.form.cancel(`vendor_mater_form`);
                    me.props.button.setDisabled({
                        'Edit':true,
                        'Delete':true,
                        'Refresh':true,
                        'ExportData':true,
                        'Print':true,
                        'Output':true
                    });
                }else{
                    me.props.button.setDisabled({
                        'Edit':false,
                        'Delete':false,
                        'Refresh':false,
                        'ExportData':false,
                        'Print':false,
                        'Output':false
                    });
                }
                me.form2.cardTable.resetTableData(`vendor_mater_table`);
                me.form2.button.setButtonVisible('AddLine',!this.state.showReturn);
                me.form2.button.setDisabled({
                    'AddLine':true
                });
            }
            buttonStatus(me.props,'cancel');
        });
    }
    /**
     * 页签切换
     * @param key
     */
    onChangeFun(key){
        var me = this
        let pageStatus;
        if(me.state.tab == 0){
            if(me.isShow('form1')){
                if(me.state.status == 'add')
                    pageStatus = me.form1.form.getFormStatus('form');
                else{
                    pageStatus = me.form1.button.getButtonDisabled('AddLine') ? 'browse' : 'edit';
                }
            }
            else
                pageStatus = 'browse';
        }else{
            if(me.isShow('form2')) {
                if(me.state.status == 'add')
                    pageStatus = me.form2.form.getFormStatus('form2');
                else{
                    pageStatus = me.form2.button.getButtonDisabled('AddLine') ? 'browse' : 'edit';
                }
            }else
                pageStatus = 'browse';
        }
        if(pageStatus != 'browse') {
            if((key == 0 || key == "0") && me.state.tab != 0)
                me.setState({
                    tab:1
                })
            if((key == 1 || key == "1") && me.state.tab != 1)
                me.setState({
                    tab:0
                })
            return ;
        }else{
            me.state.tab = key;
            me.state.selectedPKS='';
            me.setState(me.state, ()=>{
                switch (key){
                    case 0:
                        if(me.isShow('form1')){
                            me.show('return');
                            if(me.form1.form.getFormItemsValue('form','pk_org').value)
                                me.props.button.setDisabled({
                                    'Edit':false,
                                    'Delete':false,
                                    'Refresh':false,
                                    'ExportData':false,
                                    'Print':false,
                                    'Output':false
                                });
                        }else{
                            me.hide('return');
                            if(me.MaterialSgmenuTable.getHeadTableData().length == 0){
                                buttonStatus(me.props,'browse');
                            }else{
                                buttonStatus(me.props,'query');
                            }
                        }
                        me.setState({
                            moduleName:'uapbd',
                            billType:'uapbd_sgmenu'
                        },()=>{
                            let a1=[];
                            //uapbd 模块名  uapbd_sgmenu 单据类型名 回调函数直接进行复制
                            /*let excelimportconfig = Utils.getImportConfig("UAPBD","UAPBD_SGMENU",a1.length, (resultinfo) => {
                                if(resultinfo == 'beginUpload'){
                                    a1.push(1);
                                    me.props.modal.show('import', {
                                        content: <ProcessArr toastArr={a1} upParams={{"moduleName":'uapbd',"billType":'UAPBD_SGMENU'}} />
                                    });
                                }else{
                                    me.props.table.setAllTableData('importLogs', resultinfo);
                                    me.props.modal.show('hintimportLog');
                                }
                            });*/
                            me.props.button.setUploadConfig("Excel",excelImportconfig(me.props,"uapbd","uapbd_sgmenu",true,"",{},()=>{me.onClickSearchBtn()}));
                        });
                        break;
                    case 1:
                        if(me.isShow('form2')){
                            me.show('return');
                            if(me.form2.form.getFormItemsValue('form2','pk_org').value)
                                me.props.button.setDisabled({
                                    'Edit':false,
                                    'Delete':false,
                                    'Refresh':false,
                                    'ExportData':false,
                                    'Print':false,
                                    'Output':false
                                });
                        }else {
                            me.hide('return');
                            if (!me.SupplierSgmenuTable || me.SupplierSgmenuTable.getHeadTableData().length == 0) {
                                buttonStatus(me.props, 'browse');
                            } else {
                                buttonStatus(me.props, 'query');
                            }
                        }
                        me.setState({
                            moduleName:'uapbd',
                            billType:'uapbd_sgmenu2'
                        },()=>{
                            let a2 = [];
                            //uapbd 模块名  uapbd_sgmenu 单据类型名 回调函数直接进行复制
                            /*let excelimportconfig2 = Utils.getImportConfig("UAPBD","UAPBD_SGMENU2", a2.length,(resultinfo) => {
                                if(resultinfo == 'beginUpload'){
                                    a2.push(1);
                                    me.props.modal.show('import', {
                                        content: <ProcessArr toastArr={a2} upParams={{"moduleName":'uapbd',"billType":'UAPBD_SGMENU'}} />
                                    });
                                }else{
                                    me.props.table.setAllTableData('importLogs', resultinfo);
                                    me.props.modal.show('hintimportLog');
                                }
                            });*/
                            me.props.button.setUploadConfig("Excel",excelImportconfig(me.props,"uapbd","uapbd_sgmenu2",true,"",{},()=>{me.onClickSearchBtn()}));
                        });
                        break;
                }
            });
        }

    }
    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val,reload){
        var me = this;
        let searchId = me.state.tab == 0 ? 'queryCondition' : 'queryCondition2';
        //获取查询区数据
        let searchData = me.props.search.getAllSearchData(searchId);
        let queryInfo = me.props.search.getQueryInfo(searchId);
        let param = {
            oid:queryInfo.oid,
            searchData,
            searchId
        };
        if(me.state.tab == 0) {
            me.MaterialSgmenuTable.loadHeadTableData(param,()=>{
                !props && toast({title:this.state.json['10140SGMENU-000049'],color:'success'});/* 国际化处理： 刷新成功！*/
                if(me.MaterialSgmenuTable.getSelectedRow()){
                    me.MaterialSgmenuTable.loadBodyTableData(()=>{
                        if(me.MaterialSgmenuTable.getHeadTableData().length == 0){
                            props && val && toast({title:me.state.json['10140SGMENU-000050'],content:me.state.json('10140SGMENU-000057'),color:'warning'});/* 国际化处理： 请注意！,未查询出符合条件的数据*/
                            buttonStatus(me.props,'browse',true);
                        }else{
                            props && val && toast({title:me.state.json['10140SGMENU-000051'],content:me.state.inlt.get('10140SGMENU-000058',{total:me.MaterialSgmenuTable.getCountOfHeadTable()}),color:'success'});/* 国际化处理： 已成功,查询成功,共,条*/
                            buttonStatus(me.props,'query',false);
                        }
                    });
                }else{
                    props && val && toast({title:me.state.json['10140SGMENU-000050'],content:me.state.json['10140SGMENU-000057'],color:'warning'});/* 国际化处理： 请注意！,未查询出符合条件的数据*/
                    buttonStatus(me.props,'browse',true);
                }
            });
        }else {
            me.SupplierSgmenuTable.loadHeadTableData(param,()=>{
                !props && toast({title:me.state.json['10140SGMENU-000049'],color:'success'});/* 国际化处理： 刷新成功！*/
                if(me.SupplierSgmenuTable.getSelectedRow())
                    me.SupplierSgmenuTable.loadBodyTableData(()=>{
                        if(me.SupplierSgmenuTable.getHeadTableData().length == 0){
                            props && val && toast({title:me.state.json['10140SGMENU-000050'],content:me.state.json['10140SGMENU-000057'],color:'warning'});/* 国际化处理： 请注意！,未查询出符合条件的数据*/
                            buttonStatus(me.props,'browse',true);
                        }else{
                            props && val && toast({title:me.state.json['10140SGMENU-000051'],content:me.state.inlt.get('10140SGMENU-000058',{total:me.SupplierSgmenuTable.getCountOfHeadTable()}),color:'success'});/* 国际化处理： 已成功,查询成功,共,条*/
                            buttonStatus(me.props,'query',false);
                        }
                    });
                else{
                    props && val && toast({title:me.state.json['10140SGMENU-000050'],content:me.state.json['10140SGMENU-000057'],color:'warning'});/* 国际化处理： 请注意！,未查询出符合条件的数据*/
                    buttonStatus(me.props,'browse',true);
                }
            });
        }
        !reload && me.changePage('return');
    }
    linkTo (obj,callback) {
        let {templetId,areaCode,code,dataId } = obj;
        ajax({
            url: '/nccloud/platform/pub/gethyperlink.do',
            method: 'post',
            data:
                {
                    templetId,
                    areaCode,
                    code,
                    dataId
                }
            ,
            success: (res) => {
                if(res.data && res.data.pageurl){
                    callback && callback(res.data);
                }
            }
        })
    }
    /**
     * 点击供应商编码
     * */
    openDetail(pk_supplier,templateid){
        let me = this;
        /*let baseConfig = {
            pagecode:"10140SUB_base",
            appid:'0001Z010000000002G42',
            appcode:'10140SUB',
            oid:'0001Z81000000000CWIB',
            nodeType:'GLOBE_NODE',
            pk_supplier:pk_supplier,
            openCard:true,
            directOpenCard:true,
            ts:ts
        }
        me.props.modal.show('detail',{
            noFooter:true,
            //size:'xlg',
            content:<SupplierBase {...baseConfig}/>,
            leftBtnName:'',
            rightBtnName:'关闭'
        });*/
        me.linkTo({
            templetId:templateid,
            areaCode:'vendor_mater_h',
            'code':'suppliercode',
            'dataId':pk_supplier
        },(data)=>{
            me.props.openTo(data.pageurl,{
                appcode: data.parentcode,
                id: pk_supplier,
                pagecode: data.pagecode
            })
        });
        //me.props.openTo('/uapbd/supplier/supplier_glb/main/index.html',baseConfig);
    }
    render(){
        if(Object.keys(this.state.json).length == 0)
            return '';

        const {button,modal,search,BillHeadInfo} = this.props;
        let { createModal } = modal;  //模态框
        const {NCCreateSearch} = search;
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        let tableConfig = {
            pageCode:'10140SGMENU_10140SGMENU2',
            headTableId:'vendor_mater_h',
            bodyTableId:'vendor_mater_b',
            openDetail:this.openDetail,
            json:this.state.json,
            tab:'1'
        }
        let form1Config = {
            pageCode:'10140SGMENU_form1',
            orgFormId:'form',
            formId:'material_vendor_form',
            tableId:this.config.form1.tableId,
            tab:'0',
            status:this.state.status,
            showReturn:this.state.showReturn,
            isSave:this.state.isSave || false,
            appid:'0001Z01000000000HXU1',
            json:this.state.json,
            formTitle:this.state.json['10140SGMENU-000023']/* 国际化处理： 物料信息*/
        }
        let form2Config = {
            pageCode:'10140SGMENU_form2',
            formId:'vendor_mater_form',
            orgFormId:'form2',
            tableId:this.config.form2.tableId,
            tab:'1',
            status:this.state.status,
            showReturn:this.state.showReturn,
            isSave:this.state.isSave || false,
            appid:'0001Z01000000000HXU1',
            json:this.state.json,
            formTitle:this.state.json['10140SGMENU-000052']/* 国际化处理： 供应商信息*/
        }
        let baseConfig = {
            pagecode:"10140SUB_base",
            appid:'0001Z010000000002G42',
            appcode:'10140SUB',
            oid:'0001Z81000000000CWIB',
            nodeType:'GLOBE_NODE',
            openCard:true
        }
        let display1 = {display:this.state.tab == 0 ? 'block':'none'};
        let display2 = {display:this.state.tab == 1 ? 'block':'none'};
        return(
            <div style={{overflow:'hidden'}} className="nc-bill-list">
                {createModal('modal',{
                    noFooter:false,
                    content:<SgmenuBatchAdd config={{json:this.state.json}} ref={(SgmenuBatchAdd)=>{this.SgmenuBatchAdd=SgmenuBatchAdd}}/>
                })}
                {
                    createModal('import',{
                        noFooter:true,
                        className: 'import-modal'
                    })
                }
                {createModal('price',{
                    noFooter:false,
                    content:<PrinceQueryTable {...{json:this.state.json}} ref={(PrinceQueryTable)=>{this.PrinceQueryTable=PrinceQueryTable}}/>,
                    leftBtnName:'',
                    rightBtnName:this.state.json['10140SGMENU-000053']/* 国际化处理： 返回*/
                })}
                {createModal('detail',{
                    noFooter:false,
                    //size:'xlg',
                    content:<SupplierBase {...baseConfig} ref={(SupplierBase)=>{this.SupplierBase=SupplierBase}}/>,
                    leftBtnName:'',
                    rightBtnName:this.state.json['10140SGMENU-000054']/* 国际化处理： 关闭*/
                })}
                <div style={{'display':'none'}}>
                    <PrinceQueryTable {...{json:this.state.json}} ref={(PrinceQueryTable)=>{this.PrinceQueryTable=PrinceQueryTable}}/>
                </div>
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    <div id={'return'} style={{'display':this.state.showReturn ? 'block' : 'none'}}>
                        <NCBackBtn className='title-search-detail' onClick={ this.onButtonClick.bind(this,[this.props,'Return']) }></NCBackBtn>
                    </div>
                    <div className="header-title-search-area">
                        {/*{createPageIcon()}
                        <h2 className="title-search-detail" fieldid={this.state.title+"_title"}>{this.state.title}</h2>*/}
                        {createBillHeadInfo({title :this.state.title,initShowBackBtn:false})}
                    </div>
                    {/* 按钮组 btn-group*/}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                        {createButtonApp({
                            area: 'form',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="tab-definInfo-area card-area-padding0" style={{height:'100%',overflow:"auto"}}>
                    <NCDiv areaCode={NCDiv.config.TABS}>
                        <NCTabsControl defaultKey={this.state.tab} style={{overflow:'hidden'}}>
                            <div key={0} clickFun={this.onChangeFun.bind(this,0)}>{this.state.json['10140SGMENU-000055']/* 国际化处理： 按物料维护供应商*/}</div>
                            <div key={1} clickFun={this.onChangeFun.bind(this,1)}>{this.state.json['10140SGMENU-000056']/* 国际化处理： 按供应商维护物料*/}</div>
                        </NCTabsControl>
                    </NCDiv>
                    {/*{this.state.tab == 0 && ( 暂时抛弃这种选择性渲染，因为这个组件会导致切换页签时重新加载，原来加载出来的每次切换都会重新渲染*/}
                        <div style={display1}>
                            <div className="nc-bill-list" id='search1'>
                                <div className="nc-bill-search-area">
                                    {NCCreateSearch(`queryCondition`, {
                                        fieldid: 'supplier',
                                        clickSearchBtn: this.onClickSearchBtn
                                    })}
                                </div>
                            </div>
                           {/* <div className="nc-singleTable-search-area" >
                                <div style={{height:30,marginBottom:10}}>
                                    <div className='uapbd_style_center_container'>
                                        <div className='uapbd_style_center_left20 supsgmenu_col20'>
                                            {NCCreateSearch(`queryCondition`, {
                                                clickSearchBtn: this.onClickSearchBtn
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
                            <div className="card-area" id={`table1`}>
                                <MaterialSgmenuTable config={{json:this.state.json}} ref={(MaterialSgmenuTable)=>{this.MaterialSgmenuTable=MaterialSgmenuTable}}/>
                            </div>
                            <div id={`form1`} style={{'display':'none'}}>
                                <SgmenuForm config={form1Config} ref={(SgmenuForm)=>{this.form1=SgmenuForm}}/>
                            </div>
                        </div>
                    {/*{this.state.tab == 1 && (*/}
                        <div style={display2}>
                            <div className="nc-bill-list" id='search2'>
                                <div className="nc-bill-search-area">
                                    {NCCreateSearch('queryCondition2', {
                                        fieldid: 'material',
                                        clickSearchBtn: this.onClickSearchBtn
                                    })}
                                </div>
                            </div>
                            {/*<div className="nc-singleTable-search-area" id={'search2'}>
                                <div style={{height:30,marginBottom:10}}>
                                    <div className='uapbd_style_center_container'>
                                        <div className='uapbd_style_center_left20 supsgmenu_col20'>
                                            {NCCreateSearch('queryCondition2', {
                                                clickSearchBtn: this.onClickSearchBtn
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
                            <div className="card-area" id={`table2`}>
                                <MaterialSgmenuTable config={tableConfig} ref={(MaterialSgmenuTable)=>{this.SupplierSgmenuTable=MaterialSgmenuTable}}/>
                            </div>
                            <div id={`form2`} style={{'display':'none'}}>
                                <SgmenuForm config={form2Config} ref={(SgmenuForm)=>{this.form2=SgmenuForm}}/>
                            </div>
                        </div>
                    {/*<NCTabs navtype="turn"  defaultActiveKey={`0`} activeKey={this.state.tab} onChange={this.onChangeFun.bind(this)} style={{overflow:'hidden'}}>
                        不能使用这个组件，因为卡片界面存在侧拉框，若使用这个页签组件，当切换第二个页签，卡片界面的侧拉会渲染再第一个页签上
                        故，需采用上述nctabscontrol方式
                        <NCTabPane tab={this.state.json['10140SGMENU-000055']/* 国际化处理： 按物料维护供应商*!/ key="0" style={{'overflow':'hidden'}}>

                        </NCTabPane>
                        <NCTabPane tab={this.state.json['10140SGMENU-000056']/* 国际化处理： 按供应商维护物料*!/ key="1">
                            <div style={{ height: '10px'}} />

                        </NCTabPane>
                    </NCTabs>*/}

                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={this.state.data}
                >
                </PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName = {this.state.moduleName}//模块名
                    pagecode={cardPageCode}
                    appcode={appCode}
                    exportTreeUrl={urls['export']}
                    billType = {this.state.billType}//单据类型
                    selectedPKS = {this.state.selectedPKS}
                    referVO={{ignoreTemplate:true}}
                />
            </div>
        )
    }
}
/**
 * 按钮显示和表单状态
 * @param props
 */
const buttonStatus = (props,status,showPrint)=>{
    //按钮的显示状态
    if(status == 'edit' || status == 'add' || status=='cancel'){
        if(status=='cancel'){
            props.button.setButtonVisible(['Save','Cancel','Return'],false);
            props.button.setButtonVisible(['Edit','Add','Delete','Refresh','BatchAdd','PriceQuery','Excel','Print','Output'],true);
        }else{
            props.button.setButtonVisible(['Edit','Add','Delete','Refresh','BatchAdd','PriceQuery','Excel','Print','Output','Return'],false);
            props.button.setButtonVisible(['Save','Cancel'],true);
        }
        props.button.setDisabled({
            'Save':false,
            'Cancel':false,
            'Return': status == 'cancel' ? false : true,
            'AddLine':status == 'cancel' ? true : false,
            'DelLine':false,
            'EditLine':false,
            'PasteLine':false
        });
    }else{
        props.button.setButtonVisible(['Save','Cancel','Return','AddLine'],false);
        props.button.setButtonVisible(['Edit','Add','Delete','Refresh','BatchAdd','PriceQuery','Excel','Print','Output'],true);
        if(status == 'browse'){
            props.button.setDisabled({
                'Edit':true,
                'Add':false,
                'Delete':true,
                'BatchAdd':false,
                'PrintMenu':true,
                'Refresh':false,
                'PriceQuery':false,
                'Print':true,
                'Output':true,
                'AddLine':true
            });
        }else{
            props.button.setDisabled({
                'Edit':false,
                'Add':false,
                'Delete':false,
                'BatchAdd':false,
                'Print':showPrint ? true : false,
                'Output':showPrint ? true : false,
                'Refresh':false,
                'ExportData':false,
                'PriceQuery':false,
                'AddLine':true
            });
        }
    }
}
export default SgmenuPage = createPage({
    //initTemplate:initTemplate
})(SgmenuPage);
ReactDOM.render(<SgmenuPage/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
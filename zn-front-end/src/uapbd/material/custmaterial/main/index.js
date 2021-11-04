//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base,high,toast ,cacheTools,getBusinessInfo,promptBox,createPageIcon} from 'nc-lightapp-front';
import  {BaseUtils} from '../../../public/utils';
import  Utils  from '../../../public/utils';
import Customer from "../../../refer/customer/CustomerDefaultTreeGridRef";
import Unit from "../../../refer/org/BusinessUnitTreeRef";
import { print } from 'nc-lightapp-front';
import './index.less';
import {config} from '../config/index';
import {initTemplate,rowDisable,setStatus} from '../util/index'

let { NCAffix,NCFormControl, NCAnchor, NCScrollLink, NCScrollElement  } = base;
const { NCTabs,NCCol,NCPopconfirm,NCModal } = base;
const NCTabPane = NCTabs.NCTabPane;
const {NCInput:Input} = base;
const {PrintOutput, ExcelImport} = high;
const { NCDiv } = base;
const searchid = '10140CMG';
const {tablemater,tablesub,urls} = config;

const isShowOffEnable = true;			//是否启用“显示停用”功能
const keys = ['cmmeasdoc','measrate','pk_org','pk_customer','pk_group'];  //过来空行时，忽略的字段
const keys2 = ['subcustom.name','maincustom','pk_org','pk_group'];  //过来空行时，忽略的字段
let allTableData = {};

//获取并初始化模板


class CustMaterial extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            searchValue:'',
            selectedFun:1,
            customerRefDisable:'off',
            curCustomer:{},
            curUnit:{},
            subrows:[],
            custName:'',
            oid:'',
            custqueryCondition : {enablestate:'2',isShowDisabledData:false,
                //GridRefActionExt:'nccloud.web.uapbd.material.custmaterial.action.CustomerRefExt',
                nodeType:props.config.nodeType},
            json:{},
            inlt:null
        }
    }
    componentDidMount() {
        let importRefresh=()=>{
            this.setState({ searchValue:'' });
            this.doSearch(this.props,{"conditions":[]},false);
        };
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            initTemplate.call(this, this.props, json, inlt,importRefresh) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
            this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
        }

        this.props.MultiInit.getMultiLang({moduleId: '10140CMG',domainName: 'uapbd',callback});

        this.props.button.setButtonsVisible({
            addcust: true,
            editcust: true,
            savecust: false,
            cancelcust: false,
            delcust: true,
            refreshcust:true,
            printcust:true,
            output:true,

            addsub: false,
            editsub: false,
            savesub: false,
            cancelsub: false,
            delsub: false,
            refreshsub:false
        });
        this.props.button.setDisabled({
            editcust:true,
            delcust:true,
            delsub:true,
            printcust:true,
            output:true
        })
        this.state.selectedFun = '1';
        this.setState(this.state);
    }

    updateButtonsStatus(){
        let selectedFun = this.state.selectedFun;
        let materStatus = this.props.editTable.getStatus(tablemater);
        let subStatus = this.props.editTable.getStatus(tablesub);
        let editMater = materStatus=='edit';
        let editSub = subStatus=='edit';
        this.props.editTable.updateTableHeight();
        let materdataflag = this.props.editTable.getAllRows(tablemater,true).length>0;
        let subdataflag = this.props.editTable.getAllRows(tablesub,true).length>0;

        if(!editMater&&!editSub){
            this.state.customerRefDisable='off';
        }else{
            this.state.customerRefDisable='on';

        }
        if(searchid){
            if(this.state.selectedFun==1&&!editMater){
                this.props.search.setDisabled(searchid,false);
            }else{
                this.props.search.setDisabled(searchid,true);
            }
        }
        //设置客户参照不可编辑
        this.props.button.setButtonsVisible({

            addcust: selectedFun==1,
            editcust: selectedFun==1&&!editMater,
            savecust: selectedFun==1&&editMater,
            cancelcust: selectedFun==1&&editMater,
            delcust: selectedFun==1,
            refreshcust:selectedFun==1&&!editMater,
            printcust:selectedFun==1&&!editMater,
            output:selectedFun==1&&!editMater,
            import:selectedFun==1&&!editMater,

            addsub: selectedFun==2,
            editsub: selectedFun==2&&!editSub,
            savesub: selectedFun==2&&editSub,
            cancelsub: selectedFun==2&&editSub,
            delsub: selectedFun==2,
            refreshsub:selectedFun==2&&!editSub
        });
        this.props.button.setMainButton({'addcust':selectedFun==1&&!editMater,'savecust':selectedFun==1&&editMater});
        this.props.button.setMainButton({'addsub':selectedFun==2&&!editSub,'savesub':selectedFun==2&&editSub});

        //***没有数据或没有选中数据时禁用按钮

        this.props.button.setDisabled({
            editcust:!materdataflag,
            delcust:!materdataflag,
            printcust:!materdataflag,
            output:!materdataflag,
            editsub: !subdataflag,
            delsub: !subdataflag
        })
        this.selectedChange(this.props)
    }

    onChangeFun(key){
        let materStatus = this.props.editTable.getStatus(tablemater);
        let subStatus = this.props.editTable.getStatus(tablesub);

        if(key==2&&materStatus=='edit'){
            promptBox({
                title : this.state.json['10140CMG-000000'],/* 国际化处理： 确认保存*/
                content : this.state.json['10140CMG-000001'],/* 国际化处理： 是否要保存已修改的数据*/
                beSureBtnClick : this.saveQueryMater.bind(this,key)
            });
        }else if(key==1&&subStatus=='edit'){
            promptBox({
                title : this.state.json['10140CMG-000000'],/* 国际化处理： 确认保存*/
                content : this.state.json['10140CMG-000001'],/* 国际化处理： 是否要保存已修改的数据*/
                beSureBtnClick : this.saveQuerySub.bind(this,key)
            });
        }else{
            this.state.selectedFun = key;
            this.setState(this.state);
            this.updateButtonsStatus();
        }
    }

    saveQueryMater(key){

        this.onButtonClick(this.props,'savecust',()=>{
            this.state.selectedFun = key;
            this.setState(this.state);
        });
    }

    saveQuerySub(key){

        this.onButtonClick(this.props,'savesub',()=>{
            this.state.selectedFun = key;
            this.setState(this.state);
        });
    }


    onBeforeEvent(props, moduleId,item,index,value,record){
        //根据所选的表头业务单元和客户确定物料参照内容
        if(item&&item.attrcode&&item.attrcode=='materialid') {
            let meta = props.meta.getMeta();
            //if (this.state.curUnit.refpk) {
            meta[moduleId].items.find((item) => item.attrcode == 'materialid').queryCondition = () => {
                let custOrg = this.state.curCustomer.values.pk_org.value;
                let curOrg = this.state.curUnit.refpk;
                return {
                    custOrg: custOrg,
                    curOrg: curOrg,
                    nodeType: this.props.config.nodeType,
                    GridRefActionExt: 'nccloud.web.uapbd.material.custmaterial.action.MaterialVersionRefExt',
                    isShowDisabledData:false
                };
            };
            props.meta.setMeta(meta);
            //}
            return true;
        }
        //根据选中的物料控制vfree的编辑性
        if(item&&item.attrcode&&item.attrcode.indexOf('vfree')>=0){
            let edit = false;
            let materialid = record.values.materialid.value;
            ajax({
                url:urls.vfreedisable,
                data:{materialid:materialid,field:item.attrcode},
                async:false,
                success:(res)=>{
                    edit = res.data;
                },
                error:(res)=>{
                    edit = false;
                }
            })
            return edit;
        }
        return true;
    }

    //表格编辑后事件
    onAfterEvent(props, moduleId , key, changerows, value, index, data) {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）

        if(key === 'materialid'){
            //为物料相关自动赋值并根据多选自动增行
            if(JSON.stringify(changerows) == "[]"||JSON.stringify(changerows) =='{}'){

                this.props.editTable.setValByKeyAndIndex(tablemater,index,'materialid.name',{value:'',display:''});

                data.values['materialid.name'].display = '';
                data.values['materialid.name'].value = '';
                data.values['materialid.version'].display = '';
                data.values['materialid.version'].value = '';
                data.values['marmeasdoc'].display = '';
                data.values['marmeasdoc'].value = '';
                //data.values['marmeasdoc'].disabled='on';
            }else{
                if(BaseUtils.isArray(changerows)){
                    if(changerows.length==1&&changerows[0].refpk==value[0].oldvalue.value){
                        return;
                    }
                    this.setMaterialidDefaultValue(index,changerows[0]);
                    index = index+1;
                    changerows.forEach((row,indexx)=>{
                        if(indexx==0){
                            return ;
                        }else{
                            let num = this.addcust(index);
                            this.setMaterialidDefaultValue(index,row);
                            index = index+1;
                        }
                    });
                }else{
                    if(changerows.refpk==value[0].oldvalue.value){
                        return;
                    }
                    this.setMaterialidDefaultValue(index,changerows);

                }
            }
        }
        if(key === 'subcustom'){
            //为客户赋值，根据多选自动增行
            if(JSON.stringify(changerows) == "[]"||JSON.stringify(changerows) =='{}'){

                data.values['subcustom.name'].display = '';
                data.values['subcustom.name'].value = '';
            }else{
                if(BaseUtils.isArray(changerows)){
                    if(changerows.length==1&&changerows[0].refpk==value[0].oldvalue.value){
                        return;
                    }
                    this.setCustDefaultValue(index,changerows[0]);
                    index = index+1;
                    changerows.forEach((row,indexx)=>{
                        if(indexx==0){
                            return ;
                        }else{
                            let num = this.addsub(index);
                            this.setCustDefaultValue(index,row);
                            index = index+1;
                        }
                    });
                }else{
                    if(changerows.refpk==value[0].oldvalue.value){
                        return;
                    }
                    this.setCustDefaultValue(index,changerows);
                }
            }
        }
        if(key=='measrate'){
            //校验物料单位/客户物料单位的合法性
            if(changerows==''){
                return;
            }
            var reg = new RegExp('^((0\\.\\d+)|([1-9]+(\\.\\d+)?))/((0\\.\\d+)|([1-9]+(\\.\\d+)?))$');
            if(!reg.test(changerows)){
                toast({content:this.state.json['10140CMG-000002'],color:'warning'});/* 国际化处理： 请录入分数，例如‘1/2’，/两侧为大于0的数值！*/
                this.props.editTable.setValByKeyAndIndex(tablemater, index, 'measrate', {value: '',display:''});
            }
        }
    }

    /**
     *
     * 自动增行后事件，赋默认值
     * @param index 被赋值的行号
     */
    addcust(index){
        setStatus(this.props,tablemater,'edit');
        let num = this.props.editTable.getNumberOfRows(tablemater); //获取列表总行数
        this.props.editTable.addRow(tablemater,index,true);
        this.addcustEvent(index);
        return num;
    }

    /**
     * 自动增行后事件，赋默认值
     * @param index 被赋值的行号
     */
    addcustEvent(index){
        let busiInfo = getBusinessInfo();
        let num = this.props.editTable.getNumberOfRows(tablemater); //获取列表总行数
        num = num-1;
        //平台修改之前的回调不传参数，js注意判断类型，''和null会被isNaN当做0处理
        //if(index){
        if((!isNaN(index))&&index){
            num=index;
        }
        //如果是业务单元节点则为所属组织赋值   ***
        if(this.props.config.nodeType=='ORG_NODE'){
            this.props.editTable.setValByKeyAndIndex(tablemater, num, 'pk_org', {value: this.state.curUnit.refpk,display:this.state.curUnit.refname});//设置组织默认值
        }else if(this.props.config.nodeType=='GROUP_NODE'){
            this.props.editTable.setValByKeyAndIndex(tablemater, num, 'pk_org', {value: busiInfo.groupId,display:busiInfo.groupName});//设置组织默认值为集团
        }
        this.props.editTable.setValByKeyAndIndex(tablemater, num, 'pk_group', {value: busiInfo.groupId,display:busiInfo.groupName});//设置集团默认值为集团
        this.props.editTable.setValByKeyAndIndex(tablemater, num, 'pk_customer', {value: this.state.curCustomer.refpk,display:this.state.curCustomer.refname});//设置客户默认值
    }
    addsub(index){
        setStatus(this.props,tablesub,'edit');
        let num2 = this.props.editTable.getNumberOfRows(tablesub); //获取列表总行数
        this.props.editTable.addRow(tablesub,index,true);
        this.addsubEvent(index);
        return num2;
    }
    addsubEvent(index){
        let num2 = this.props.editTable.getNumberOfRows(tablesub); //获取列表总行数
        num2 = num2-1;
        if((!isNaN(index))&&index){
            num2=index;
        }
        this.props.editTable.setValByKeyAndIndex(tablesub, num2, 'maincustom', {value: this.state.curCustomer.refpk,display:'ss'});
        //为组织赋默认值
        if(this.props.config.nodeType=='ORG_NODE'){
            this.props.editTable.setValByKeyAndIndex(tablesub, num2, 'pk_org', {value: this.state.curUnit.refpk,display:this.state.curUnit.refname});
        }
    }

    setMaterialidDefaultValue(index,row){

        this.props.editTable.setValByKeyAndIndex(tablemater, index, 'materialid', {value: row.refpk,display:row.refcode});
        this.props.editTable.setValByKeyAndIndex(tablemater, index, 'materialid.name', {value: row.refname,display:row.refname});
        if(row.values != null){
            this.props.editTable.setValByKeyAndIndex(tablemater, index, 'materialid.version', {value: row.values.version.value,display:row.values.version.value});
            this.props.editTable.setValByKeyAndIndex(tablemater, index, 'marmeasdoc', {value: row.values.pk_measdoc.value,display:row.values.measdoc_name.value});
        }
    }
    setCustDefaultValue(index,row){
        this.props.editTable.setValByKeyAndIndex(tablesub, index, 'subcustom', {value: row.refpk,display:row.refcode});
        this.props.editTable.setValByKeyAndIndex(tablesub, index, 'subcustom.name', {value: row.refname,display:row.refname});
    }

    //按钮点击事件
    onButtonClick(props,id,then) {
        //设置物料参照过滤
        switch (id) {
            case 'addcust':
                if(!this.checkCustomer()){
                    return;
                }
                this.addcust();
                this.updateButtonsStatus();
                this.setState(this.state);
                break;
            case 'editcust':
                setStatus(this.props,tablemater, 'edit');
                this.updateButtonsStatus();
                break;
            case 'cancelcust':
                let cancelcust=()=>{
                    this.props.editTable.cancelEdit(tablemater);
                    setStatus(this.props,tablemater, 'browse');
                    this.updateButtonsStatus();

                }
                promptBox({
                    color:'warning',
                    title : this.state.json['10140CMG-000003'],/* 国际化处理： 取消*/
                    content : this.state.json['10140CMG-000004'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick : cancelcust.bind(this)
                });
                break;
            case "delcust":
                let selectedData=this.props.editTable.getCheckedRows(tablemater);
                if(selectedData.length==0){
                    toast({content:this.state.json['10140CMG-000005'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                //储存可以被删的数据
                let indexArr=[];
                selectedData.forEach((val) => {
                    if(!rowDisable(props,val.data)) {
                        indexArr.push(val.index);
                    }
                });
                if(selectedData.length>indexArr.length){
                    toast({content:this.state.json['10140CMG-000006'],color:'warning'});/* 国际化处理： 业务单元节点不允许删除集团数据！*/
                    return;
                }
                if(this.props.editTable.getStatus(tablemater) === 'edit'){//编辑状态
                    this.props.editTable.deleteTableRowsByIndex(tablemater, indexArr);
                }else{
                    promptBox({
                        title : this.state.json['10140CMG-000007'],/* 国际化处理： 确认删除*/
                        content : this.state.json['10140CMG-000008'],/* 国际化处理： 您确认删除所选数据？*/
                        beSureBtnClick : this.onDelForBrowse.bind(this)
                    });
                }
                this.updateButtonsStatus();
                break;
            case 'refreshcust':
                this.setState({ searchValue:'' });
                this.doSearch(this.props,{"conditions":[]},false,(data)=>{
                    toast({title:this.state.json['10140CMG-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'savecust':
                setTimeout(()=>{
                    this.props.editTable.filterEmptyRows(tablemater,keys);
                    let tableData = this.props.editTable.getAllRows(tablemater);

                    let data = {
                        pageid:this.props.config.pageCode,
                        model : {
                            areaType: "table",
                            pageinfo: null,
                            rows: [],
                            areacode:tablemater
                        }
                    };
                    data.model.rows = tableData;
                    let saveFunc = ()=>{
                        let flag = this.props.editTable.getChangedRows(tablemater);
                        if(flag === undefined){
                            return;
                        }
                        if(flag.length==0){
                            setStatus(this.props,tablemater, 'browse');//设置表格状态为浏览态
                            toast({ color: 'success', title: this.state.json['10140CMG-000010'] });/* 国际化处理： 保存成功！*/
                            if(typeof then ==='function'){
                                then();
                            }
                            return;
                        }
                        ajax({
                            url: urls.savemater,
                            data,
                            success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success,data} = res;
                                if (success) {
                                    setStatus(this.props,tablemater, 'browse');//设置表格状态为浏览态
                                    if(data){
                                        let allD = this.props.editTable.getAllData(tablemater);
                                        //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                        allD.rows = allD.rows.filter(item => item.status != '3');
                                        Utils.filterResult(allD,data[tablemater].rows);//将保存后返回的数据重新放置到页面
                                        allD.rows.forEach((data)=>{
                                            //data.values['materialid'].display = data.values['materialid'].display;
                                            data.values['materialid.name'].value = data.values['materialid.name'].display;
                                            data.values['materialid.version'].value = data.values['materialid.version'].display;

                                        });
                                        this.props.editTable.setTableData(tablemater,allD);

                                        if(typeof then ==='function'){
                                            then();
                                        }
                                        toast({ color: 'success', title: this.state.json['10140CMG-000010'] });/* 国际化处理： 保存成功！*/
                                        this.updateButtonsStatus();
                                    }
                                }
                            }.bind(this)
                        });
                    }

                    props.validateToSave( data, saveFunc , {[tablemater]:'table'},'grid');
                },1)
                break;
            case 'addsub':
                if(!this.checkCustomer()){
                    return;
                }
                this.addsub();
                this.updateButtonsStatus();
                break;
            case 'editsub':
                setStatus(this.props,tablesub, 'edit');
                this.updateButtonsStatus();
                break;
            case 'cancelsub':
                let cancelSub=()=>{
                    this.props.editTable.cancelEdit(tablesub);
                    setStatus(this.props,tablesub, 'browse');
                    this.updateButtonsStatus();
                }
                promptBox({
                    color:'warning',
                    title : this.state.json['10140CMG-000003'],/* 国际化处理： 取消*/
                    content : this.state.json['10140CMG-000004'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick : cancelSub.bind(this)
                });
                break;
            case "delsub":
                let selectedData2=this.props.editTable.getCheckedRows(tablesub);
                if(selectedData2.length==0){
                    toast({content:this.state.json['10140CMG-000005'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                let indexArr2=[];
                selectedData2.forEach((val) => {
                    if(!rowDisable(props,val.data)) {
                        indexArr2.push(val.index);
                    }
                });
                if(selectedData2.length>indexArr2.length){
                    toast({content:this.state.json['10140CMG-000006'],color:'warning'});/* 国际化处理： 业务单元节点不允许删除集团数据！*/
                    return;
                }
                if(this.props.editTable.getStatus(tablesub) === 'edit'){//编辑状态
                    this.props.editTable.deleteTableRowsByIndex(tablesub, indexArr2);
                    this.updateButtonsStatus();
                }else{
                    promptBox({
                        title : this.state.json['10140CMG-000007'],/* 国际化处理： 确认删除*/
                        content : this.state.json['10140CMG-000008'],/* 国际化处理： 您确认删除所选数据？*/
                        beSureBtnClick : this.onDelSubForBrowse.bind(this)
                    });
                }
                break;
            case 'refreshsub':
                this.setState({ searchValue:'' });
                this.doSearch(this.props,{"conditions":[]},false,()=>{
                    toast({title:this.state.json['10140CMG-000011'],color:'success'});/* 国际化处理： 刷新成功*/
                });
                break;
            case 'savesub':
                setTimeout(()=>{
                    this.props.editTable.filterEmptyRows(tablesub,keys2);

                    let tableData2 = this.props.editTable.getAllRows(tablesub,false);

                    let data = {
                        pageid:this.props.config.pageCode,
                        model : {
                            areaType: "table",
                            pageinfo: null,
                            rows: []
                        }
                    };
                    data.model.rows = tableData2;

                    let saveFunc2 = ()=> {

                        //必输校验不过时返回undefined
                        if (tableData2 === undefined) {
                            return;
                        }
                        //过滤已添加过的子客户只要重新选择就会被视为修改，此时后台借口报错，过滤掉修改后值不变的行
                        tableData2 = tableData2.filter((eve) => {
                            return this.state.subrows.every((subrow) => {
                                return (subrow.values.subcustom.value != eve.values.subcustom.value && eve.status == 1)
                                    || eve.status == 2 || eve.status == 3 || eve.status == 0;
                            })
                        });

                        if (tableData2.length == 0) {
                            toast({color: 'success', title: this.state.json['10140CMG-000010']});
                            /* 国际化处理： 保存成功！*/
                            setStatus(this.props, tablesub, 'browse');//设置表格状态为浏览态
                            if (typeof then === 'function') {
                                then();
                            }
                            return;
                        }
                        this.props.editTable.checkRequired(tablesub, tableData2);

                        ajax({
                            url: urls['savesub'],
                            data,
                            success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let {success, data} = res;
                                if (success) {
                                    setStatus(this.props, tablesub, 'browse');//设置表格状态为浏览态
                                    if (data) {
                                        let allD = this.props.editTable.getAllData(tablesub);
                                        //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                        allD.rows = allD.rows.filter(item => item.status != '3');
                                        Utils.filterResult(allD, data[tablesub].rows);//将保存后返回的数据重新放置到页面

                                        allD.rows.forEach((data) => {
                                            data.values['subcustom.name'].value = data.values['subcustom.name'].display;
                                        });
                                        this.props.editTable.setTableData(tablesub, allD);
                                        this.state.subrows = props.editTable.getAllRows(tablesub, false);
                                        this.setState(this.state);
                                        if (typeof then === 'function') {
                                            then();
                                        }
                                        this.updateButtonsStatus();
                                    } else {
                                        if (typeof then === 'function') {
                                            then();
                                        }
                                    }
                                    toast({color: 'success', title: this.state.json['10140CMG-000010']});
                                    /* 国际化处理： 保存成功！*/
                                }
                            }.bind(this)
                        });
                    }

                    props.validateToSave( data, saveFunc2 , {[tablesub]:'table'},'grid');
                },1)
                break;
            case 'printcust':
                this.output('print');
                break;
            case 'output':
                this.output('output');
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
        }
    }

    output(type=''){
        let allData = this.props.editTable.getAllData(tablemater);
        let pks = [];
        allData.rows.forEach((row)=>{
            pks.push(row.values.pk_custmaterial.value);
        });
        let data = {
            funcode:'10140CMG',     //功能节点编码
            appcode:'10140CMG',
            nodekey:'',     //模板节点标识
            oids:pks,
            outputType:type
        };
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type=='print'){
            //打印
            print(
                'pdf',
                urls.print,
                data
            )
        }else if(type=='output'){
            this.state.data = data;
            this.setState(this.state);
            this.refs.printOutput.open();
        }
    }

    //浏览态确认删除事件
    onDelForBrowse(){
        let selectedData=this.props.editTable.getCheckedRows(tablemater);
        let indexArr=[];
        let dataArr=[];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3'
            };
            delObj.rowId=val.data.rowId;
            delObj.values = val.data.values;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        let data = {
            pageid:this.props.config.pageCode,
            model: {
                areaType: 'table',
                pageinfo: null,
                rows: dataArr
            }
        };
        ajax({
            url: urls.savemater,
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(tablemater, indexArr);
                    let allD = this.props.editTable.getAllData(tablemater);
                    //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                    allD.rows = allD.rows.filter(item => item.status != '3');
                    this.props.editTable.setTableData(tablemater,allD);
                    this.updateButtonsStatus();
                    toast({title:this.state.json['10140CMG-000012'],color:'success'});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    onDelSubForBrowse(){
        let selectedData=this.props.editTable.getCheckedRows(tablesub);
        let indexArr=[];
        let dataArr=[];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3'
            };
            delObj.rowId=val.data.rowId;
            delObj.values = val.data.values;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        let data = {
            pageid:this.props.config.pageCode,
            model: {
                areaType: 'table',
                pageinfo: null,
                rows: dataArr
            }
        };
        ajax({
            url: urls.savesub,
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(tablesub, indexArr);
                    let allD = this.props.editTable.getAllData(tablesub);
                    //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                    allD.rows = allD.rows.filter(item => item.status != '3');
                    Utils.filterResult(allD,data[tablesub].rows);//将保存后返回的数据重新放置到页面
                    this.props.editTable.setTableData(tablesub,allD);
                    this.state.subrows = this.props.editTable.getAllRows(tablesub, false);
                    this.setState(this.state);
                    toast({title:this.state.json['10140CMG-000012'],color:'success'});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    clickSearchBtn = (props,searchVal)=>{

        let materStatus = this.props.editTable.getStatus(tablemater);
        if(!(this.state.selectedFun==1&&materStatus!='edit')){
            return false;
        }
        if(!this.checkCustomer()){
            return;
        }
        if(!searchVal){
            searchVal = {"conditions":[]};
        }

        console.log(searchVal);
        /*cacheTools.set("hasSearched",1);
        cacheTools.set("searchParams",searchVal);
        cacheTools.set('pageInfo',props.table.getTablePageInfo(tablemater));*/

        this.doSearch(props,searchVal,true,(data)=>{
            if(data[tablemater]&&data[tablemater][tablemater]&&data[tablemater][tablemater].rows.length>0){
                toast({content:this.state.inlt&&this.state.inlt.get('10140CMG-000013',{count:data[tablemater][tablemater].rows.length}),color:'success'});/* 国际化处理： 查询成功，共{count}条。*/            }else{
                toast({content:this.state.json['10140CMG-000015'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据！*/
            }
        });

    }
    editDisable(props,table){
        let rows = props.editTable.getAllRows(table, true);
        let arr =  [];
        if(rows){
            rows.forEach((row)=>{
                if(rowDisable(props,row)){
                    // setTimeout(()=>{
                    //  props.editTable.setEditableRowByRowId(table, row.rowid, false);
                    arr.push(row.rowid);
                    // },20)
                }
            });
            props.editTable.setEditableRowByRowId(table, arr, false);
        }
    }

    doSearch(props,searchVal,clickSeacch,callback){

        let queryInfo = this.props.search.getQueryInfo(searchid);
        let oid = queryInfo.oid;
        let metaData = props.meta.getMeta();
        let pk_org = '';
        if(this.props.config.nodeType=='ORG_NODE'&&this.state.curCustomer.refpk){
            pk_org = this.state.curCustomer.refpk;
        }
        //集团节点时：0 点击查询，查询时不按组织过滤，1 刷新或选择客户自动查询：只查当前组织
        let searchType = clickSeacch?"0":"1";
        let data = {
            //custconditions:[{field:'pk_customer',oprtype:'=',value:{firstvalue:this.state.curCustomer.refpk}}],
            //pageInfo: props.table.getTablePageInfo(tablemater),
            pageCode: props.config.pageCode,
            queryAreaCode:searchid,  //查询区编码
            oid:oid,
            querytype:'tree',
            nodeType:this.props.config.nodeType,
            pk_org:pk_org,
            searchType:searchType,
            pk_customer:this.state.curCustomer.refpk,
            querycondition: searchVal
        };

        ajax({
            url: urls.querymater,
            data,
            success: function (res) {
                console.log(res);
                if(res.data){
                    //显示公式
                    Utils.showFormular(this.props,res,{
                        "custmater":"editTable",
                        "subcustom":"editTable"
                    })
                    if (res.data[tablemater]) {
                        res.data[tablemater][tablemater].rows.forEach((data) => {
                            //data.values['materialid'].display = data.values['materialid'].display;
                            if(data.values['materialid.name'])
                                data.values['materialid.name'].value = data.values['materialid.name'].display;
                            if(data.values['materialid.version'])
                                data.values['materialid.version'].value = data.values['materialid.version'].display;
                        });
                        props.editTable.setTableData(tablemater, res.data[tablemater][tablemater]);
                        this.editDisable(props, tablemater);
                    } else {
                        props.editTable.setTableData(tablemater, {rows: []});
                    }

                    if (res.data[tablesub]) {
                        res.data[tablesub][tablesub].rows.forEach((data) => {
                            if(data.values['subcustom.name'])
                                data.values['subcustom.name'].value = data.values['subcustom.name'].display;
                        });
                        props.editTable.setTableData(tablesub, res.data[tablesub][tablesub]);
                        this.state.subrows = props.editTable.getAllRows(tablesub, false);
                        this.setState(this.state);
                    } else {
                        props.editTable.setTableData(tablesub, {rows: []});
                    }
                    callback && callback(res.data);

                }else{
                    props.editTable.setTableData(tablemater, {rows:[]});
                    props.editTable.setTableData(tablesub, {rows:[]});
                    callback&&callback({});
                }
                this.updateButtonsStatus();

            }.bind(this)

        });
    }

    pageInfoClick(){

    }

    onCustomerChange(val){
        let oldCustomer = this.state.curCustomer;
        let curUnit = this.state.curUnit;
        this.state.curCustomer= val;
        this.state.custName = val.refname;
        this.setState(this.state.curCustomer);
        if(val==undefined||val==''||JSON.stringify(val) == '{}'){
            this.state.custName = '';
            this.props.editTable.setTableData(tablesub, {areacode:tablesub,rows:[]});
            setTimeout(()=>{
                this.props.editTable.setTableData(tablemater, {areacode:tablemater,rows:[]});
            },20)
        }else{
            ajax({
                url:urls.custexist,
                data:{pk_cust:val.refpk},
                success:(res)=>{
                    if(res.data.exist=='0'||val.refpk==res.data.refpk){
                        if((JSON.stringify(curUnit)!='{}'&&this.props.config.nodeType=='ORG_NODE')||this.props.config.nodeType=='GROUP_NODE')
                            this.doSearch(this.props,{"conditions":[]},false/*,(data)=>{
                                if(data[tablemater]&&data[tablemater][tablemater]&&data[tablemater][tablemater].rows.length>0){
                                    toast({content:this.state.json['10140CMG-000013',{count:data[tablemater][tablemater].rows.length}),color:'success'});/!* 国际化处理： 查询成功，共{count}条。*!/
                                }else{
                                    toast({content:this.state.json['10140CMG-000015'),color:'warning'});/!* 国际化处理： 未查询出符合条件的数据！*!/
                                }
                            }*/);
                    }else if (res.data.exist=='1'&&val.refpk!=res.data.refpk){
                        promptBox({
                            title : this.state.json['10140CMG-000016'],/* 国际化处理： 提示*/
                            content : this.state.json['10140CMG-000017'],/* 国际化处理： 已存在客户物料关系，切换至对应主客户*/
                            beSureBtnClick : this.changeCust.bind(this,res.data),
                            cancelBtnClick:()=>{this.state.curCustomer=oldCustomer;this.setState(this.state.curCustomer);},
                            closeModalEve:()=>{this.state.curCustomer=oldCustomer;this.setState(this.state.curCustomer);}
                        });
                    }
                }
            })
        }
    }
    changeCust(data){
        //***无法通过refpk为参照赋值   使用自行查得的内容赋值
        this.state.curCustomer = {refcode:data.refcode,refpk:data.refpk,refname:data.refname,values:{pk_org:{value:data.pk_org}}};
        this.onCustomerChange(this.state.curCustomer);
    }

    checkCustomer(){
        let msg = '';
        if(this.props.config.nodeType=='ORG_NODE'){
            msg = this.state.json['10140CMG-000018'];/* 国际化处理： 请先录入表头的所属组织和客户编码*/
        }else if(this.props.config.nodeType=='GROUP_NODE'){
            msg = this.state.json['10140CMG-000019'];/* 国际化处理： 请先录入客户*/
        }
        if((this.props.config.nodeType=='GROUP_NODE'&&this.checkCust())||(this.props.config.nodeType=='ORG_NODE'&&(this.checkCust()||this.checkUnit()))){
            toast({content:msg,color:"warning"});
            return false;
        }else{
            return true;
        }
    }
    checkCust(){
        return (this.state.curCustomer==undefined||JSON.stringify(this.state.curCustomer) == "{}");
    }
    checkUnit(){
        return (this.state.curUnit==undefined||JSON.stringify(this.state.curUnit)=='{}');
    }
    onUnitChange(val){
        if(val&&val.refpk&&val.refpk==this.state.curUnit.refpk){
            this.setState(this.state);
        }else{
            this.props.button.setDisabled({'addcust':false,'addsub':false});
            this.state.curUnit= val;
            this.setState(this.state);
            this.onCustomerChange({});
        }

        if(JSON.stringify(val)=='{}'){
            this.state.custqueryCondition.pk_org='';
            this.setState(this.state);
        }else{
            this.state.custqueryCondition.pk_org = this.state.curUnit.refpk;
            this.setState(this.state)
        }
    }
    selectedChange = (props) =>{
        let data1 = props.editTable.getCheckedRows(tablemater);
        let data2 = props.editTable.getCheckedRows(tablesub);
        // console.log(data);
        if(data1.length < 1 ){
            this.props.button.setDisabled({
                delcust: true
            });
        }else{
            this.props.button.setDisabled({
                delcust: false
            });
        }

        if(data2.length < 1 ){
            this.props.button.setDisabled({
                delsub: true
            });
        }else{
            this.props.button.setDisabled({
                delsub: false
            });
        }
    }

    render() {
        let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
        let { createEditTable } = editTable;
        let {createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let {NCFormControl,NCCheckbox} = base;
        let {createModal} = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        //let queryInfo = this.props.search.getQueryInfo(searchid);
        //let oid = queryInfo.oid;
        let materStatus = this.props.editTable.getStatus(tablemater);

        var createCustomerRefRender = () => {
            return   (
                <div className="search-box" style={{width:'214px'}}>
                    {Customer({
                        onChange:this.onCustomerChange.bind(this),
                        value:this.state.curCustomer,
                        fieldid:'customer',
                        disabled :this.state.customerRefDisable=='on'?'on':false,
                        isShowDisabledData:false,
                        //unitProps:
                        queryCondition:this.state.custqueryCondition
                    })}
                </div>
            )
        };
        var createUnitRefRender = () => {
            return  (
                <div className="search-box" style={{width:'214px'}}>
                    {Unit({
                        onChange:this.onUnitChange.bind(this),
                        value:this.state.curUnit,
                        fieldid:'orgunit',
                        disabled :this.state.customerRefDisable=='on'? 'on':false,
                        queryCondition:()=>{
                            return {
                                GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:this.props.config.funcode
                            }
                        }
                    })}
                </div>
            )
        };

        return (

            <div className="nc-single-table">
                <NCAffix>
                    {/* 头部 header */}
                    <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                        {/* 标题 title */}
                        <div className="header-title-search-area" >
                            {/* {createPageIcon()}
                            <h2 className="title-search-detail">{this.props.config.nodeType=='GROUP_NODE'?this.state.json["10140CMG-000029"] : this.state.json['10140CMG-000030']国际化处理： 客户物料码-集团,客户物料码-业务单元}</h2> */}
                            {createBillHeadInfo({
                             title : this.props.config.nodeType=='GROUP_NODE'?this.state.json["10140CMG-000029"] : this.state.json['10140CMG-000030'],/* 国际化处理： 客户物料码-集团,客户物料码-业务单元*/
                             initShowBackBtn:false
                             })}
                            {this.props.config.nodeType=='ORG_NODE'?createUnitRefRender():''}
                            {createCustomerRefRender()}
                        </div>

                        {/* 按钮区  btn-group */}
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'listactions',
                                buttonLimit: 20,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>

                    </NCDiv>
                </NCAffix>
                {this.state.selectedFun==1&&(materStatus=='browse')?(<div className="nc-singleTable-search-area">
                    {NCCreateSearch(searchid, {
                        clickSearchBtn: this.clickSearchBtn.bind(this)
                    })}
                </div>):''}
                {/*<div style={{height:'10px'}}></div>*/}

                <div className="selftab" style={materStatus=='browse' ? {} : {background: 'white'}}>
                    <NCTabs navtype="turn" contenttype="moveleft" defaultActiveKey="1" onChange = {this.onChangeFun.bind(this)}  activeKey={this.state.selectedFun} >
                        <NCTabPane tab={this.state.json['10140CMG-000021']/* 国际化处理： 客户物料码*/} key="1" >
                            <div className='nc-bill-table-area'>
                                {createEditTable(tablemater, {//列表区
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件
                                    onBeforeEvent:this.onBeforeEvent.bind(this),
                                    useFixedHeader:true,
                                    isAddRow: true, 	                               // 失去焦点是否自动增行
                                    addRowCallback:this.addcustEvent.bind(this),
                                    selectedChange: this.selectedChange.bind(this),                // 选择框有变动的钩子函数
                                    onSelected: this.selectedChange.bind(this),                        // 左侧选择列单个选择框回调
                                    onSelectedAll: this.selectedChange.bind(this),
                                    statusChange: function(){
                                        setTimeout(() => {
                                            this.updateButtonsStatus();
                                        }, 50)
                                    }.bind(this),				//表格状态监听
                                    showIndex:true,				//显示序号
                                    showCheck:true,		//显示复选框
									adaptionHeight:true
                                })}
                            </div>
                        </NCTabPane>
                        <NCTabPane tab={this.state.json['10140CMG-000022']/* 国际化处理： 客户子表*/} key="2" >
                            <div className='nc-bill-table-area'>
                                {createEditTable(tablesub, {//列表区
                                    //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
                                    onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件
                                    useFixedHeader:true,
                                    isAddRow: true, 	                               // 失去焦点是否自动增行
                                    addRowCallback:this.addsubEvent.bind(this),
                                    selectedChange: this.selectedChange.bind(this),                // 选择框有变动的钩子函数
                                    onSelected: this.selectedChange.bind(this),                        // 左侧选择列单个选择框回调
                                    onSelectedAll: this.selectedChange.bind(this),
                                    statusChange: function(){
                                        setTimeout(() => {
                                            this.updateButtonsStatus();
                                        }, 50)
                                    }.bind(this),				//表格状态监听
                                    showIndex:true,				//显示序号
                                    showCheck:true,			//显示复选框
									adaptionHeight:true
                                })}
                            </div>

                        </NCTabPane>
                    </NCTabs>
                </div>

                <PrintOutput
                    ref='printOutput'
                    url={urls.print}
                    data={this.state.data}
                />

                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.props.config.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.props.config.funcode}
                    pagecode={this.props.config.pageCode}
                />				


                {/* 删除前确认模态框 */}
                {createModal('modal',{
                    title : this.state.json['10140CMG-000007'],										//标题/* 国际化处理： 确认删除*/
                    content : this.state.json['10140CMG-000023'],							//内容/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
                })}
            </div>
        );
    }
}

export default CustMaterial;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//jJ6dPAK7Y/XZGCCYlGGaYuLebPWiLWQ1r4AT12V4OmdGkakfG21Q/87b/5RADpvZ
/**
 * 税种
 * @author	zhoucx
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal,NCDropdown, NCIcon, NCMenu, NCButton } = base;
import './index.less';

//mazheng 导入税务组织
import Org from  '../../../../uapbd/refer/org/TaxOrgTreeRef'

//const searchid = '200X0089';
const tableid = 'taxkind';
const urls = {
    save : '/nccloud/uapbd/taxkind/save.do',
    query : '/nccloud/uapbd/taxkind/querytaxkind.do',
    queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
let allTableData = {};
let keys = ['pk_org','issystemp','enablestate'];
let editTableBtn,viewData,config;

//禁止选择
function disableSelect(viewData){
    //禁止选择
    setTimeout(()=>{
        let disabledindex = [];

        viewData.rows.forEach((item, index, array)=>{
            //系统预置的税种不能修改
            if (item.values['issystemp'].value === '1') {
                disabledindex.push(index);
            }
            //组织级页面，全局的税种也不能修改
            else if (config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) {
                disabledindex.push(index);
            }
        });

        editTableBtn.setCheckboxDisabled(tableid,disabledindex,false);
        editTableBtn.setEditableRowByIndex(tableid, disabledindex, false);
    }, 200)
}

class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        props.config.initTemplate(props,() =>{
            if(this.props.config.nodetype=='org'&&this.props.config.defaultOrg.pk_org){
                this.setState({curOrg:{refpk:this.props.config.defaultOrg.pk_org,refname:this.props.config.defaultOrg.org_Name}},()=>{this.getData();});
            }else{
                this.getData();
            }
            this.updateButtonStatus();
        });

        this.state={
            searchValue:'',
            searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
            showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff:false,				//列表是否显示停用数据
            curOrg: ''	,				    //mz: 当前选中组织
            orgDisableStatus : false,
            json:{}
        };

        //mazheng 导入的参数,如果为空 默认为全局
        this.config = props.config || { title: this.state.json['10140TAXCB-000010'], pkorg: 'GLOBLE00000000000000',  nodetype: 'glb' };   /* 国际化处理： 全局*/
    }

    //mazheng添加组织选中事件
    onOrgChange(val){
        this.state.curOrg = val;
        this.setState(this.state.curOrg);
        setTimeout(() => { this.getData(); });
    }
    componentDidMount() {
        this.props.button.setButtonsVisible({
            Add: false,
            Edit: false,
            Save: false,
            Cancel: false,
            Delete: false,
            Print: false,
            Refresh: false
        });
    }
    componentWillMount() {
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140TAXCB',domainName: 'uapbd',callback})
    }
    componentDidUpdate() {
        if(this.props.editTable.getStatus(tableid) === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }


    //请求列表数据
    getData = () => {
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        //mazheng 重构代码, 设置查询参数
        var param = {
            pagecode: this.config.pagecode,
            showOff: this.state.isShowOff,
            pk_org: this.config.nodetype === 'org' ? this.state.curOrg.refpk : this.config.pkorg,
            nodetype: this.config.nodetype
        };

        ajax({
            url: urls['query'],
            data: param,
            success: (res) => {
                let { success, data} = res;
                if (success) {
                    Utils.showFormular(this.props,res,{[tableid]:'editTable'})
                    data = data ? data : {  //此处要处理返回值长度为0的情况
                        [tableid] :	{
                            rows: []
                        }
                    };
                    data[tableid].rows.forEach((item, index, array)=>{

                        //系统预置的税种不能修改
                        if (item.values['issystemp'].value === '1') {
                            item.values['code'].disabled = 'on';
                            item.values['name'].disabled = 'on';
                            item.values['issystemp'].disabled = 'on';
                            item.values['pk_org'].disabled = 'on';
                        }

                        //组织级页面，全局的税种也不能修改
                        else if (this.config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) {

                            item.values['code'].disabled = 'on';
                            item.values['name'].disabled = 'on';
                            item.values['issystemp'].disabled = 'on';
                            item.values['pk_org'].disabled = 'on';
                            item.values['enablestate'].disabled = 'on';
                        }
                    });

                    //是否启用转换成开关
                    Utils.convertGridEnablestateToShow(data[tableid].rows);
                    allTableData = data[tableid];
                    editTableBtn = this.props.editTable;
                    this.props.editTable.setTableData(tableid, data[tableid]);
                    this.onSearch(this.state.searchValue);
                    //禁止选择
                    config = this.config;
                    viewData = data[tableid];

                }
            }
        });
    };

    //表格编辑后事件
    onAfterEvent(props, moduleId , key, changerows, value, index, data) {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）

        if(key === 'enablestate'){

            let allRows = props.editTable.getAllRows(moduleId);
            data.status = '1'
            let reqData = [];
            reqData.push(data);

            Utils.convertGridEnablestateToSave(reqData);
            let changDdata = {
                pageid: this.config.pagecode,
                model: {
                    areaType: 'table',
                    pageinfo: null,
                    rows: reqData
                }
            };


            ajax({
                url: urls['save'],
                data:changDdata,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success, data } = res;
                    if (success) {
                        //操作成功，更新页面当前行数据
                        let allD = this.props.editTable.getAllData(tableid);
                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                        Utils.convertGridEnablestateToShow(data[tableid].rows);
                        Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                        this.props.editTable.setTableData(tableid,allD);
                        //禁止选择
                        viewData = allD;
                        disableSelect(viewData);
                        toast({title:this.state.json['10140TAXCB-000023'],color:'success'});/* 国际化处理： 操作成功*/
                    }
                }
            });
        }
    }

    //更新按钮状态
    updateButtonStatus(){
        //此处控制按钮的隐藏显示及启用状态

        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        if(length === 0){//未选择数据
            this.props.button.setDisabled({
                Delete: true
            });
        }else if(length === 1){//选择一行数据
            this.props.button.setDisabled({
                Delete: false
            });
        }else {//选择多行数据
            this.props.button.setDisabled({
                Delete: false
            });
        }
        if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
            this.props.button.setButtonsVisible({
                Add: true,
                Edit: false,
                Save: true,
                Cancel: true,
                Delete: true,
                Print: false,
                Refresh:false
            });
            this.setState({
                searchDisable:true,
                showOffDisable:true,
                orgDisableStatus:true
            });
            this.props.button.setMainButton('Add',false);
            this.props.button.setPopContent('Delline','');
        }else{//浏览态

            this.props.button.setButtonsVisible({
                Add: true,
                Edit: true,
                Delete: true,
                Save: false,
                Cancel: false,
                Print: true,
                Refresh: true
            });
            this.setState({
                searchDisable:false,
                showOffDisable:false,
                orgDisableStatus:false
            });
            this.props.button.setMainButton('Add',true);
            this.props.button.setPopContent('Delline',this.state.json['10140TAXCB-000000']);/* 国际化处理： 确认要删除该信息吗？*/


            //组织页面，且没有选择组织，修改按钮不可用
            if ((this.config.nodetype === 'org' && this.state.curOrg.refpk == null)||!this.props.editTable.getNumberOfRows(tableid)>0)	{
                this.props.button.setDisabled({
                    Edit: true
                });
            }else{
                this.props.button.setDisabled({
                    Edit: false
                });
            }
        }
    }

    //显示停用数据
    showOffChange(){
        this.setState({
            isShowOff : !this.state.isShowOff
        },()=>{
            this.getData();
        });

    }


    //自动增行的回调函数
    addRowAutoCallback() {
        let rowcount = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        let lastrowindex = rowcount-1;
        if (this.config.nodetype == 'glb') { //全局页面
            this.props.editTable.setValByKeyAndIndex(tableid, lastrowindex, 'pk_org', {value: 'GLOBLE00000000000000', display:this.state.json['10140TAXCB-000010']});//设置组织默认值/* 国际化处理： 全局*/
        } else { //组织页面
            this.props.editTable.setValByKeyAndIndex(tableid, lastrowindex, 'pk_org', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置组织默认值
        }
        this.props.editTable.setValByKeyAndIndex(tableid, lastrowindex, 'issystemp', {value: '2',display: this.state.json['10140TAXCB-000011'] });//设置属性默认值/* 国际化处理： 自定义*/
        this.props.editTable.setValByKeyAndIndex(tableid, lastrowindex, 'enablestate', {value: '2',display: this.state.json['10140TAXCB-000012'] });//设置启用状态默认值/* 国际化处理： 已启用*/
    }

    setStatus(props,tableid,status) {
        let all = this.props.editTable.getAllRows(tableid);
        let tableStatus = this.props.editTable.getStatus(tableid);

        //设置编辑态
        if (status == 'add' || status == 'edit') {
            //当前组件不是编辑态时才执行转换
            if (tableStatus != 'add' && tableStatus != 'edit') {
                props.editTable.setStatus(tableid,status);
                let convertAll = Utils.convertGridEnablestateToSave(all)
                props.editTable.setTableData(tableid, {rows:convertAll});
            }
        }else{
            let convertAll = Utils.convertGridEnablestateToShow(all)
            this.props.editTable.setTableData(tableid, {rows:convertAll});
            props.editTable.setStatus(tableid,status);
        }
    }

    //按钮点击事件
    onButtonClick(props,id) {
        switch (id) {
            case 'Add':
                if (this.config.nodetype == 'org') {
                    if (this.state.curOrg.refpk == null) {
                        toast({content: this.state.json['10140TAXCB-000013'], color:'info'})/* 国际化处理： 请选择组织参照*/
                        return
                    }
                }

                let rowcount = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                let newrowindex = rowcount; //新增行的index等于table的总行数，因为index为行号-1
                this.setStatus(this.props,tableid, 'edit');
                setTimeout(() => {
                    this.props.editTable.addRow(tableid,newrowindex,true);
                    if (this.config.nodetype == 'glb') { //全局页面
                        this.props.editTable.setValByKeyAndIndex(tableid, newrowindex, 'pk_org', {value: 'GLOBLE00000000000000', display:this.state.json['10140TAXCB-000010']});//设置组织默认值/* 国际化处理： 全局*/
                    } else { //组织页面
                        this.props.editTable.setValByKeyAndIndex(tableid, newrowindex, 'pk_org', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置组织默认值
                    }
                    this.props.editTable.setValByKeyAndIndex(tableid, newrowindex, 'issystemp', {value: '2',display: this.state.json['10140TAXCB-000011'] });//设置属性默认值/* 国际化处理： 自定义*/
                    this.props.editTable.setValByKeyAndIndex(tableid, newrowindex, 'enablestate', {value: '2',display: this.state.json['10140TAXCB-000012'] });//设置启用状态默认值/* 国际化处理： 已启用*/
                }, 0);
                break;

            case 'Edit':
                this.setStatus(this.props,tableid, 'edit');
                break;

            case 'Cancel':
                promptBox({
                    color:"warning",
                    title : this.state.json['10140TAXCB-000014'],/* 国际化处理： 确认取消！*/
                    content : this.state.json['10140TAXCB-000015'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick : ()=>{
                        this.props.editTable.filterEmptyRows(tableid,keys); //保存过滤空行
                        this.props.editTable.cancelEdit(tableid,()=>{
                            this.setStatus(this.props,tableid, 'browse');
                            this.updateButtonStatus();
                        } );
                        //禁止选择
                        disableSelect(viewData);
                    }
                });
                break;

            case 'Save':
                setTimeout(() => {
                    this.props.editTable.filterEmptyRows(tableid,keys);

                    let data = {
                        pageid: this.config.pagecode,
                        model : {
                            areaType: "table",
                            pageinfo: null,
                            rows: [],
                            areacode:tableid
                        }
                    }
                    //验证公式应该是对页面所有数据进行验证
                    let alldata = this.props.editTable.getAllRows(tableid);
                    data.model.rows = alldata;

                    let saveFunc=()=>{
                        let tableData = this.props.editTable.getChangedRows(tableid,true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                        if(tableData === undefined || tableData.length==0) {
                            this.props.editTable.cancelEdit(tableid,()=>{
                                this.setStatus(this.props,tableid, 'browse');
                                this.updateButtonStatus();
                            } );
                            toast({title: this.state.json['10140TAXCB-000016'], color:'success'});/* 国际化处理： 保存成功！*/
                            return
                        }

                        if(!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid,true))) {
                            return
                        }


                        //Utils.convertGridEnablestate(tableData); ////保存前，switch开关true和false转换成数值1,2,3
                        //发送所有数据进行字段重复校验保证行提示正确
                        //data.model.rows = tableData;

                        ajax({
                            url: urls['save'],
                            data,
                            success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success,data} = res;
                                if (success) {
                                    if(data){
                                        let allD = this.props.editTable.getAllData(tableid);
                                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                        Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面

                                        //Utils.convertGridEnablestateToShow(allD.rows);

                                        this.props.editTable.setTableData(tableid,allD);

                                        this.setStatus(this.props,tableid, 'browse');//设置表格状态为浏览态

                                        allD = this.props.editTable.getAllData(tableid);

                                        //禁止选择
                                        viewData = allD;
                                        disableSelect(viewData);

                                    }
                                    toast({title: this.state.json['10140TAXCB-000016'], color:'success'})/* 国际化处理： 保存成功！*/
                                }
                            }.bind(this)
                        });
                    }
                    props.validateToSave( data, saveFunc , {[tableid]:'table'},'grid');
                }, 0);
                break;
            case "Delete":
                let selectedData=this.props.editTable.getCheckedRows(tableid);
                if(selectedData.length==0){
                    toast({content: this.state.json['10140TAXCB-000017'], color:'info'})/* 国际化处理： 请选择要删除的数据*/
                    return
                }
                if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
                    let indexArr=[];
                    selectedData.forEach((val) => {
                        indexArr.push(val.index);
                    });
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                }else{
                    promptBox({
                        title : this.state.json['10140TAXCB-000018'],/* 国际化处理： 确认删除！*/
                        content : this.state.json['10140TAXCB-000019'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
                        beSureBtnClick : this.onDelForBrowse.bind(this)
                    });
                }
                break;
            case "Refresh":
                this.setState({ searchValue:'' });
                this.getData();
                toast({title: this.state.json['10140TAXCB-000020'], color:'success'});/* 国际化处理： 刷新成功！*/
                break;
            //税种不需要打印，与swing端保持一致
            // case "Print":
            // 	let allD = this.props.editTable.getAllData(tableid);
            // 	let pks = [];
            // 	allD.rows.forEach((item,index) => {
            // 		pks.push(item.values['pk_taxkind'].value);
            // 	});
            // 	print(
            // 		'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            // 		urls['print'],
            // 		{
            // 			billtype:'',  //单据类型
            // 			funcode:'10140BRDG',      //功能节点编码，即模板编码
            // 			nodekey:'',     //模板节点标识
            // 			oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
            // 		}
            //  	);
            // 	break;
        }
        //禁止选择
        disableSelect(viewData);
    }

    //表头简单筛选
    onSearch(value){
        this.setState({ searchValue:value });
        let allData = Utils.clone(allTableData);
        if(value.trim()===''){

        }else{
            let rows = Array.of();
            for(var row of allData.rows){
                if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
                    rows.push(row);
                }
            }
            allData.rows = rows;
        }
        this.props.editTable.setTableData(tableid,allData);
        //禁止选择
        viewData = allData;
        //禁止选择
        setTimeout(()=>{
            allData.rows.forEach((item, index, array)=>{
                //系统预置的税种不能修改
                if (item.values['issystemp'].value === '1') {
                    editTableBtn.setCheckboxDisabled(tableid,index,false);
                    editTableBtn.setEditableRowByIndex(tableid, index, false);
                }
                //组织级页面，全局的税种也不能修改
                else if (this.config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) {
                    editTableBtn.setCheckboxDisabled(tableid,index,false);
                    editTableBtn.setEditableRowByIndex(tableid, index, false);
                }
            });
        },100)

    }

    //浏览态确认删除事件
    onDelForBrowse(){
        let selectedData=this.props.editTable.getCheckedRows(tableid);
        let indexArr=[];
        let dataArr=[];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3',
                /*values: {
                    ts: {
                        display: this.state.json['10140TAXCB-000006'],/!* 国际化处理： 时间戳*!/
                    },
                    pk_taxkind: {
                        display: this.state.json['10140TAXCB-000007'],/!* 国际化处理： 主键*!/
                    }
                }*/
            };
            delObj.rowid=val.data.rowid;
            /*delObj.values.ts.value=val.data.values.ts.value;
            delObj.values.pk_taxkind.value=val.data.values.pk_taxkind.value;*/
            delObj.values = val.data.values;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        dataArr = Utils.convertGridEnablestateToSave(dataArr);
        let data = {
            pageid:this.config.pagecode,
            //nodetype:this.config.nodetype,
            model: {
                areaType: 'table',
                pageinfo: null,
                rows: dataArr
            }
        };
        ajax({
            url: urls['save'],
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                    let allD = this.props.editTable.getAllData(tableid);
                    Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                    this.props.editTable.setTableData(tableid,allD);
                    toast({title: this.state.json['10140TAXCB-000008'], color: 'success'});/* 国际化处理： 删除成功！*/
                    //禁止选择
                    viewData = allD;
                    disableSelect(viewData);
                }
            }
        });
    }

    render() {
        let { table, button, search,editTable,modal } = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { NCFormControl,NCCheckbox } = base;
        let { createModal } = modal;

        //mazheng 添加渲染组织参照判断
        var createOrgRender = () => {
            return  this.config.nodetype === 'org' ? (
                <div className="search-box"  style={{position:'relative'}}>
                    {(this.state.curOrg && this.state.curOrg.refpk)
                        ? '' : <span style={{color: 'red',position:'absolute',left: 3,top: 8,zIndex: 1}}>*</span>}
                    {Org({
                        disabled : this.state.orgDisableStatus,
                        onChange:this.onOrgChange.bind(this),
                        value:this.state.curOrg,
                        //placeholder: '重写这个参照的名字',
                        queryCondition: function() {
                            return {
                                "AppCode": '10140TAXCO',
                                TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
                            }
                        }
                    })}
                </div>
            ) : '';
        };
        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <div className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {createPageIcon()}
                        <h2 className="title-search-detail">{this.state.json[this.config.title]}</h2>	{/*  mazheng 更换标题,取配置文件标题 */}

                        {/*  mazheng 添加渲染函数创建组织 */}
                        <div className="title-search-detail">
                            {createOrgRender()}
                        </div>

                        {/* 简单查询 */}
                        <div className="title-search-detail">
                            <NCFormControl
                                placeholder={this.state.json['10140TAXCB-000021']}/* 国际化处理： 请输入编码或名称筛选*/
                                value={this.state.searchValue}
                                onChange={this.onSearch.bind(this)}
                                type="search"
                                disabled={this.state.searchDisable}
                            />
                        </div>

                        {/* 显示停用数据 */}
                        <div className='title-search-detail'>
                            {isShowOffEnable?(
                                <span className="showOff">
									<NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >{this.state.json['10140TAXCB-000022']/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
                            ):('')}
                        </div>
                    </div>

                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list-actions',
                            buttonLimit: 6,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}

                    </div>
                </div>

                {/* 列表区 */}
                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
                        onAfterEvent:this.onAfterEvent.bind(this),        // 控件的编辑后事件
                        useFixedHeader:true,
                        adaptionHeight:true,
                        isAddRow:true, 	                               // 失去焦点是否自动增行
                        addRowCallback:this.addRowAutoCallback.bind(this),// 自动增行后的回调
                        //onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
                        //onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
                        selectedChange:this.updateButtonStatus.bind(this),// 选择框有变动的钩子函数
                        statusChange: function(){
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0)
                        }.bind(this),				//表格状态监听
                        showIndex:true,				//显示序号
                        showCheck:true			//显示复选框

                    })}
                </div>

                {/* 删除前确认模态框 */}
                {createModal('modal',{
                    title : this.state.json['10140TAXCB-000018'],										//标题/* 国际化处理： 确认删除！*/
                    content : this.state.json['10140TAXCB-000019'],							//内容/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
                    beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
                    //cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
                })}
            </div>
        );
    }
}

export default SingleTable;
export { SingleTable,editTableBtn,tableid }  

//jJ6dPAK7Y/XZGCCYlGGaYuLebPWiLWQ1r4AT12V4OmdGkakfG21Q/87b/5RADpvZ
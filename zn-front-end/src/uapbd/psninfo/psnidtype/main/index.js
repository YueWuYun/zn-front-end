//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast ,promptBox,createPageIcon} from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCAffix,NCPopconfirm,NCModal } = base;
const { NCDiv } = base;

const searchid = '13050IDTYPE';
const tableid = 'psnidtype';
const pagecode = '13050IDTYPE_psnidtype';
const appid = '0001Z0100000000014Z6';
const urls = {
    save : '/nccloud/uapbd/psnidtype/save.do',
    query : '/nccloud/uapbd/psnidtype/query.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
const keys = ['country','idtypelength','idtypevalidat','description','pk_org','pk_group','enablestate','datatype'];  //过来空行时，忽略的字段
let allTableData = {};

//获取并初始化模板
let initTemplate = (props) => {
    props.createUIDom({
            pagecode : pagecode/*,
            appid : appid,
            appcode:'102201IDTYPE'*/
        },
        (data)=>{
            let meta = data.template;
            meta = modifierMeta(props, meta)
            props.meta.setMeta(meta);
            data.button && props.button.setButtons(data.button);
            if(data.button){
                props.button.setButtons(data.button);
                props.button.setPopContent('oprdelbro',props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000000')/* 国际化处理： 国家地区*/) /* 设置操作列上删除按钮的弹窗提示 */
            }
        });
}

//settableData代理，加入自己的逻辑
function setTableData(props,tableid,allD){
    props.editTable.setTableData(tableid, allD);
    allTableData = allD;
}

function tableButtonClick(props, key, text, record, index){
    switch (key) {
        // 表格操作按钮
        case 'oprdel':
            if (record.values.datatype.value === '0') {
                toast({content: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000002'), color: 'warning'});/* 国际化处理： 系统数据，不能删除！*/
                return;
            }
            props.editTable.deleteTableRowsByIndex(tableid, index);
            break;
        case 'oprdelbro':
            if (record.values.datatype.value === '0') {
                toast({content: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000002'), color: 'warning'});/* 国际化处理： 系统数据，不能删除！*/
                return;
            }
            if (props.editTable.getStatus(tableid) === 'edit') {//编辑状态
                props.editTable.deleteTableRowsByIndex(tableid, index);
            } else {//浏览态
                let delObj = {
                    rowId: index,
                    status: '3',
                    values: Utils.clone(record.values)
                };
                let indexArr = [];
                indexArr.push(index);
                let data = {
                    pageid: pagecode,
                    model: {
                        areaType: 'table',
                        pageinfo: null,
                        rows: [delObj]
                    }
                };
                data.model.rows = Utils.convertGridEnablestateToSave(data.model.rows);
                ajax({
                    url: urls['save'],
                    data,
                    success: function (res) {
                        let {success, data} = res;
                        if (success) {
                            props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                            let allD = props.editTable.getAllData(tableid);
                            allD.rows = allD.rows.filter(item => item.status != '3');
                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                            //props.editTable.setTableData(tableid, allD);
                            setTableData(props,tableid,allD);
                            toast({title: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000005'), color: 'success'});/* 国际化处理： 删除成功！*/
                        }
                    }.bind(this)
                });
            }
            break;
    }
}


//对表格模板进行加工操作
function modifierMeta(props,meta) {

    //添加表格操作列

    meta[tableid].items.forEach((item)=>{
        if(item.attrcode==='country'){
            item.placeholder = props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000001');/* 国际化处理： 国家地区*/
            item.refName = props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000001');/* 国际化处理： 国家地区*/
        }
    })







    //添加操作列
    meta[tableid].items.push({
        attrcode: 'opr',
        label: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000006'),/* 国际化处理： 操作*/
        itemtype:'customer',
        width: 100,
        fixed:'right',
        className: 'table-opr',
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            if (record.values.datatype.value == '1') {
                buttonAry = props.editTable.getStatus(tableid) === "browse"
                    ? ['oprdelbro']
                    : ['oprdel'];
            }

            return props.button.createOprationButton(buttonAry, {
                area: 'opr-actions',
                buttonLimit: 2,
                //onButtonClick: tableButtonClick.bind(record,index,text,this)
                onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
            });
        }
    });
    return meta;
}

class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.props.button.setButtonsVisible({
            save: false,
            cancel: false
        });
        this.state={
            searchValue:'',
            searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
            moreButton:false,				//更多按钮状态
            showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff:false				//列表是否显示停用数据
        }
    }
    componentDidMount() {
        this.getData();
    }

    doRefresh(){
        this.getData((rows)=>{
            toast({title:this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000007'),color:'success'});/* 国际化处理： 刷新成功！*/
        })
    }

    //请求列表数据
    getData = (callback) => {
        let showOff = this.state.isShowOff;
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls['query'],
            data:{
                "pagecode": pagecode,
                "showOff":showOff
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    //显示公式
                    Utils.showFormular(this.props,res,{
                        [tableid]:"editTable"
                    })
                    data[tableid].rows.forEach(function(item, index, array){
                        if (item.values['datatype'].value === '0') {
                            item.values['code'].disabled = 'on';
                            item.values['name'].disabled = 'on';

                            item.values.country=item.values.country==undefined?{}:item.values.country;
                            item.values.idtypelength=item.values.idtypelength==undefined?{}:item.values.idtypelength;
                            item.values.idtypevalidat=item.values.idtypevalidat==undefined?{}:item.values.idtypevalidat;
                            item.values.description=item.values.description==undefined?{}:item.values.description;

                            item.values['country'].disabled = 'on';
                            item.values['idtypelength'].disabled = 'on';
                            item.values['idtypevalidat'].disabled = 'on';
                            item.values['description'].disabled = 'on';
                        }
                    });

                    Utils.convertGridEnablestateToShow(data[tableid].rows);
                    allTableData = data[tableid];
                    //this.props.editTable.setTableData(tableid, data[tableid]);
                    setTableData(this.props,tableid,data[tableid]);
                    this.onSearch(this.state.searchValue);
                    callback&&callback(data[tableid].rows);

                }
            }
        });
    };

    //表格编辑后事件
    onAfterEvent(props, moduleId , key, changerows, value, index, data) {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        //表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
        //let length = this.props.editTable.getNumberOfRows(moduleId);

        if(key==='idtypelength'){
            if(data.values.idtypelength.value<0||data.values.idtypelength.value>999999999){
                toast({content:props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000008'),color:'warning'});/* 国际化处理： 请录入0-999999999之间的整数！*/
                setTimeout(()=>{
                    props.editTable.setValByKeyAndIndex(tableid, index, 'idtypelength', {'value': '','display':''});
                },50)
                return false;
            }
        }

        if(key === 'enablestate'){  // && data.values['doclevel'] === '0'){

            let allRows = props.editTable.getAllRows(moduleId);

            let rowData =   Utils.clone(data);
            rowData.status = '1'
            if (rowData.values['enablestate'].value){
                rowData.values['enablestate'].value = '2';
            }else{
                rowData.values['enablestate'].value = '3';
            }

            let reqData = [];
            reqData.push(rowData);
            let changDdata = {
                pageid:pagecode,
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
                        if(data){
                            Utils.convertGridEnablestateToShow(data[tableid].rows);
                            let allD = this.props.editTable.getAllData(tableid);
                            allD.rows = allD.rows.filter(item => item.status != '3');
                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                            Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                            //this.props.editTable.setTableData(tableid,allD);
                            setTableData(this.props,tableid,allD);
                        }
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
                del: true
            });
        }else if(length === 1){//选择一行数据
            this.props.button.setDisabled({
                del: false
            });
        }else {//选择多行数据
            this.props.button.setDisabled({
                del: false
            });
        }

        let tableStatus = this.props.editTable.getStatus(tableid) === 'edit';
        this.props.button.setMainButton({'add':!tableStatus,'save':tableStatus});


        if(tableStatus){//编辑状态
            this.props.button.setButtonsVisible({
                add: true,
                edit: false,
                save: true,
                cancel: true,
                del: true,
                refresh:false,
                moreButton:false
            });
            this.setState({
                moreButton:false,
                searchDisable:true,
                showOffDisable:true
            });
        }else{//浏览态
            this.props.button.setButtonsVisible({
                add: true,
                edit: true,
                del: true,
                save: false,
                cancel: false,
                refresh:true,
                moreButton:true
            });
            this.setState({
                moreButton:true,
                searchDisable:false,
                showOffDisable:false
            });
        }
        if(this.props.editTable.getNumberOfRows(tableid)>0){
            this.props.button.setDisabled({
                edit:false
            });
        }else{
            this.props.button.setDisabled({
                edit:true
            });
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

    setStatus(props,tableid,status){
        if(status=='edit'){
            window.onbeforeunload = () => {
                return '';
            };
        }else{
            window.onbeforeunload = null;
        }

        let all = this.props.editTable.getAllRows(tableid);
        let tableStatus = this.props.editTable.getStatus(tableid);
        //设置编辑态
        if (status == 'add' || status == 'edit') {
            //当前组件不是编辑态时才执行转换
            if (tableStatus != 'add' && tableStatus != 'edit') {
                props.editTable.setStatus(tableid,status);
                let convertAll = Utils.convertGridEnablestateToSave(all);
                props.editTable.setTableData(tableid, {rows:convertAll});
            }
        }else{
            let convertAll = Utils.convertGridEnablestateToShow(all);
            this.props.editTable.setTableData(tableid, {rows:convertAll});
            props.editTable.setStatus(tableid,status);
        }
    }

    //按钮点击事件
    onButtonClick(props,id) {
        switch (id) {
            case 'add':
                let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                this.setStatus(this.props,tableid, 'edit');
                this.props.editTable.addRow(tableid,num,true);
                this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: 'GLOBLE00000000000000',display:props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000009')});//设置组织默认值/* 国际化处理： 全局*/
                this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: '2',display: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000010') });//设置启用状态默认值/* 国际化处理： 已启用*/
                this.props.editTable.setValByKeyAndIndex(tableid, num, 'datatype', {value: '1',display: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000011') });//设置启用状态默认值/* 国际化处理： 用户数据*/
                break;
            case 'edit':
                this.setStatus(this.props,tableid, 'edit');
                break;
            case 'cancel':
                let cancelcust=()=>{
                    this.props.editTable.cancelEdit(tableid);
                    this.setStatus(this.props,tableid, 'browse');
                    this.updateButtonStatus();
                }
                promptBox({
                    color:'warning',
                    title : props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000012'),/* 国际化处理： 取消*/
                    content : props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000013'),/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick : cancelcust.bind(this)
                });
                break;
            case "del":
                let selectedData=this.props.editTable.getCheckedRows(tableid);
                if(selectedData.length==0){
                    toast({content:props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000014'),color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                let sysCode = selectedData.filter(function (item,index,array) {
                    return item.data.values.datatype.value=='0';
                });

                if(sysCode.length>0) {
                    let info = sysCode.reduce(function (prev, cur, index, array) {
                        if(prev==''){
                            return  cur.data.values.code.value;
                        }else{
                            return prev + "," + cur.data.values.code.value;
                        }
                    },'');
                    toast({content:props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000015')+info+this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000016'),color:'warning'});/* 国际化处理： 编码,为系统数据，不能删除！*/
                    return;
                }

                if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
                    let indexArr=[];
                    selectedData.forEach((val) => {
                        indexArr.push(val.index);
                    });
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                }else{
                    promptBox({
                        color:'warning',
                        title : props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000017'),/* 国际化处理： 确认删除*/
                        content : props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000018'),/* 国际化处理： 确定要删除所选数据吗？*/
                        beSureBtnClick : this.onDelForBrowse.bind(this)
                    });
                }
                break;
            case 'refresh':
                this.setState({ searchValue:'' });
                let rowslength = this.doRefresh();
                break;
            case 'save':
                setTimeout(()=>{
                    this.props.editTable.filterEmptyRows(tableid,keys);

                    let allDatas = this.props.editTable.getAllRows(tableid);
                    let data = {
                        pageid:pagecode,
                        model : {
                            areaType: "table",
                            pageinfo: null,
                            rows: [],
                            areacode:tableid
                        }
                    };
                    data.model.rows = allDatas;

                    let saveFunc = ()=>{
                        let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                        if(!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid,true))) {
                            return
                        }
                        if(tableData.length==0){
                            this.setStatus(this.props,tableid, 'browse');//设置表格状态为浏览态
                            toast({ color: 'success', title: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000019') });/* 国际化处理： 保存成功！*/
                            return;
                        }
                        if(tableData === undefined){
                            return;
                        }
                        //data.model.rows = tableData;
                        ajax({
                            url: urls['save'],
                            data,
                            success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success,data} = res;
                                if (success) {
                                    this.setStatus(this.props,tableid, 'browse');//设置表格状态为浏览态
                                    if(data){
                                        Utils.convertGridEnablestateToShow(data[tableid].rows);
                                        let allD = this.props.editTable.getAllData(tableid);
                                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                        Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                                        //this.props.editTable.setTableData(tableid,allD);
                                        setTableData(this.props,tableid,allD);
                                        toast({ color: 'success', title: props.MutiInit.getIntl("102201IDTYPE") && props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000019') });/* 国际化处理： 保存成功！*/
                                    }
                                }
                            }.bind(this)
                        });
                    }

                    props.validateToSave( data, saveFunc , {[tableid]:'table'},'grid');

                },1)

                break;
        }

    }

    //表头简单筛选
    onSearch(value){
        this.setState({ searchValue:value });
        let allData =   Utils.clone(allTableData);
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
        this.updateButtonStatus();
    }

    //浏览态确认删除事件
    onDelForBrowse(){
        let selectedData=this.props.editTable.getCheckedRows(tableid);
        let indexArr=[];
        let dataArr=[];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3',
            };
            delObj.rowId=val.data.rowId;
            delObj.values = val.data.values;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        dataArr = Utils.convertGridEnablestateToSave(dataArr);
        let data = {
            pageid:pagecode,
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
                    setTableData(this.props,tableid,allD);
                    toast({title:this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000005'),color:'success'});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    addRowCallBack(){
        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        num = num-1;
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: 'GLOBLE00000000000000',display:this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000009')});//设置组织默认值/* 国际化处理： 全局*/
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: '2',display: this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000010') });//设置启用状态默认值/* 国际化处理： 已启用*/
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'datatype', {value: '1',display: this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000011') });//设置启用状态默认值/* 国际化处理： 用户数据*/
    }

    render() {
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { table, button, search,editTable,modal } = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let { createButtonApp } = button;
        let {NCFormControl,NCCheckbox} = base;
        let {createModal} = modal;
        return (

            <div className="nc-single-table">
                <NCAffix>
                    {/* 头部 header */}
                    <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">

                        {/* 标题 title */}
                        <div className="header-title-search-area" >
                            {/* {createPageIcon()} */}
                            {/* <h2 className="title-search-detail"> */}
                                {createBillHeadInfo({
                                    title:this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000022'),/* 国际化处理： 人员证件类型注册*/
                                    initShowBackBtn:false
                                }	
                                )}
                            {/* </h2> */}

                            {/* 简单查询 */}
                            <div className="title-search-detail" fieldid="search">
                                <NCFormControl
									fieldid={"psnidtitlefrom"}
                                    placeholder={this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000020')/* 国际化处理： 请输入编码或名称筛选*/}
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
                                    >{this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000023')/* 国际化处理： 显示停用*/}</NCCheckbox>
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

                    </NCDiv>
                </NCAffix>


                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件
                        useFixedHeader:true,
                        isAddRow: true, 	                               // 失去焦点是否自动增行
                        addRowCallback:this.addRowCallBack.bind(this),
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        statusChange: function(){
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0)
                        }.bind(this),				//表格状态监听
                        showIndex:true,				//显示序号
                        showCheck:true,			//显示复选框
                        adaptionHeight:true
                    })}
                </div>
                {/* 删除前确认模态框 */}
                {createModal('modal',{
                    title : this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000017'),										//标题/* 国际化处理： 确认删除*/
                    content : this.props.MutiInit.getIntl("102201IDTYPE") && this.props.MutiInit.getIntl("102201IDTYPE").get('102201IDTYPE-000021'),							//内容/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调

                })}
            </div>

        );
    }
}

SingleTable = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },
    initTemplate: initTemplate,
    mutiLangCode:'102201IDTYPE'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 渠道类型
 * @author
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,getMultiLang,promptBox,createPageIcon} from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import {component} from '../../../public/platwapper/index';
const {NCFormControl} = component;
let { NCPopconfirm,NCModal,NCDiv } = base;
const { PrintOutput } = high;
import utils from '../../../public/utils';
const {showFormular } = utils;

const tableid = 'channeltype';
const pagecode = '10140CHNLG_channeltype';
const appcode = '10140CHNLG';
const urls = {
    save : '/nccloud/uapbd/channeltype/save.do',
    query : '/nccloud/uapbd/channeltype/loadtabledata.do',
    enablestate:'/nccloud/uapbd/channeltype/enablestate.do',
    print:'/nccloud/uapbd/channeltype/printchanneltype.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
let allTableData = {};
let keys = ['enablestate'];


class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            searchValue:'',
            searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
            showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff:false,				//列表是否显示停用数据
            pks:[],
            json: {},
        };
        this.initTemplate(this.props, () => {
            this.getData();
        });
    }

    initTemplate = (props,callback) => {
        createUIDom(props)(
            {
                pagecode : pagecode
            },
            {
                moduleId: "10140CHNLG",domainName: 'uapbd'
            },
            (data, langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonDisabled({
                            print:true,
                            output:true,
                            edit:true,
                        });
                        props.button.setPopContent({'delline':this.state.json['10140CHNLG-000000']});/* 国际化处理： 确认要删除该信息吗？*/
                    }
                    callback && callback();
                }
            });
    }


    //对表格模板进行加工操作
    modifierMeta=(props,meta)=> {
        //添加表格操作列
        let event = {
            label:this.state.json['10140CHNLG-000001'],/* 国际化处理： 操作*/
            attrcode: 'opr',
            key: 'opr',
            width: 200,
            fixed: 'right',
            className : 'table-opr',
            itemtype: 'customer',
            visible:true,
            render:(text, record, index) => {
                let tableStatus = props.editTable.getStatus(tableid);
                let btnArray = ['delline'];

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-button",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta[tableid].items.push(event);
        return meta;
    }

    tableButtonClick = (props, id, text, record, index) => {

        switch(id){
            case 'delline':
                let tableStatus = props.editTable.getStatus(tableid);
                if(record.values['enablestate'].value ==true){
                    record.values['enablestate'].value = '2'
                }else if(record.values['enablestate'].value ==false){
                    record.values['enablestate'].value = '3'
                }
                if(tableStatus=='browse'){
                    let delObj = {
                        rowId: index,
                        status: '3',
                        values: record.values
                    };
                    let indexArr=[];
                    indexArr.push(index);
                    let data = {
                        pageid:pagecode,
                        model: {
                            areaType: 'table',
                            pageinfo: null,
                            rows: [ delObj ]
                        }
                    };
                    ajax({
                        url: urls['save'],
                        data,
                        success: function(res) {
                            let { success, data } = res;
                            showFormular(this.props,res,{
                                'channeltype':'editTable',
                            });
                            if (success) {
                                props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                                let allData = props.editTable.getAllData(tableid);

                                let newrows = allData.rows.filter((val) => {
                                    if(val.status!=3){
                                        return val
                                    }
                                })
                                allData.rows = newrows;
                                this.props.button.setButtonDisabled({
                                    print:newrows.length==0?true:false,
                                    output:newrows.length==0?true:false,
                                    edit:newrows.length==0?true:false,
                                });
                                props.editTable.setTableData(tableid,allData);
                                toast({title:this.state.json['10140CHNLG-000004'],color:'success'});/* 国际化处理： 删除成功！*/
                            }
                        }.bind(this)
                    });
                }else
                {
                    props.editTable.deleteTableRowsByIndex(tableid, index);
                }
                break;
            default:
                break;
        }
    }

    componentWillMount() {}

    componentDidMount() {

    }

    componentDidUpdate(){
        let tableStatus = this.props.editTable.getStatus(tableid);
        if(tableStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    //请求列表数据
    getData = (callback) => {
        let showOff = this.state.isShowOff;
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls['query'],
            data:{
                "pagecode": pagecode,
                "showOfff":showOff
            },
            success: (res) => {
                let { success, data } = res;
                showFormular(this.props,res,{
                    'channeltype':'editTable',
                });
                if (success) {
                    if(data){
                        this.props.button.setButtonDisabled({
                            print:false,
                            output:false,
                            edit:false,
                        });
                        data[tableid].rows.forEach(function(item, index, array){
                            //是否其中转换成开关
                            if (item.values['enablestate'].value === '2') {
                                item.values['enablestate'].value = true;
                            } else {
                                item.values['enablestate'].value = false;
                            }
                        });
                        this.props.editTable.setTableData(tableid, data[tableid]);
                        allTableData = data[tableid];
                    }else{
                        this.props.button.setButtonDisabled({
                            print:true,
                            output:true,
                            edit:true,
                        });
                        this.props.editTable.setTableData(tableid, {rows:[]});
                        allTableData = {rows:[]};
                    }
                    callback&&callback();
                    this.toggleShow("browse");
                }
            }
        });
    };


    //表格编辑后事件
    onAfterEvent(props, moduleId , key,  value,oldvalue, index, data) {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        if(key === 'enablestate'){  // && data.values['doclevel'] === '0'){
            let allRows = this.props.editTable.getAllRows(moduleId);

            let rowData = allRows[index];
            rowData.status = '1'
            if (value){
                rowData.values['enablestate'].value = '3';
            }else{
                rowData.values['enablestate'].value = '2';
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
                url: urls['enablestate'],
                data:changDdata,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success, data } = res;
                    showFormular(this.props,res,{
                        'channeltype':'editTable',
                    });
                    if (success) {
                        data[tableid].rows.forEach(function(item, index, array){
                            //是否其中转换成开关
                            if (item.values['enablestate'].value === '2') {
                                item.values['enablestate'].value = true;
                            } else {
                                item.values['enablestate'].value = false;
                            }
                        });

                        //操作成功，更新页面当前行数据
                        let retData = data[moduleId];
                        allRows[index].status = retData.rows[0].status;
                        allRows[index].values = retData.rows[0].values;
                        let allData = props.editTable.getAllData(moduleId);
                        allData.rows = allRows;
                        //Utils.filterResult(allData,data[tableid].rows,'pk_type','code');//将保存后返回的数据重新放置到页面
                        props.editTable.setTableData(moduleId, allData);
                        toast({title:value?this.state.json['10140CHNLG-000005']:this.state.json['10140CHNLG-000006']});/* 国际化处理： 启用成功！,停用成功！*/
                    }
                }
            });
        }

        // //自动增行
        // setTimeout(() => {
        //     let length = this.props.editTable.getNumberOfRows(moduleId);
        //     if(((length-2)===index)&&data.status==='2'){
        //         this.props.editTable.filterEmptyRows(tableid,keys);
        //         this.addTableRow(false);
        //     }
        // }, 2);
    }

    //切换页面状态
    toggleShow = (status) =>{
        let tabledata = this.props.editTable.getAllData(tableid);
        if(status == 'browse'){
            tabledata.rows =  utils.convertGridEnablestateToShow(tabledata.rows);
        }else{
            tabledata.rows = utils.convertGridEnablestateToSave(tabledata.rows);
        }
        this.props.editTable.setTableData(tableid, tabledata);

        this.props.button.setPopContent(status === 'browse' ?{'delline':this.state.json['10140CHNLG-000000']}:{'delline':null});/* 国际化处理： 确认要删除该信息吗？*/
        let flag = status === 'browse' ? false : true;
        this.props.button.setButtonVisible(['save','cancel'],flag);
        this.props.button.setButtonVisible(['edit','refresh','print','output'],!flag);
        this.props.button.setMainButton('add',!flag);
        this.setState({
            searchDisable:flag,
            showOffDisable:flag
        });
        this.props.editTable.setStatus(tableid, status==='browse'?"browse" :"edit");
        this.updateButtonStatus();
    }

    //更新批量删除按钮状态
    updateButtonStatus(){
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        if(length === 0){//未选择数据
            this.props.button.setButtonDisabled({
                delete: true
            });
        }else if(length === 1){//选择一行数据
            this.props.button.setButtonDisabled({
                delete: false
            });
        }else {//选择多行数据
            this.props.button.setButtonDisabled({
                delete: false
            });
        }
    }

    //显示停用数据
    showOffChange(){
        this.setState({
            isShowOff : !this.state.isShowOff
        });
        setTimeout(() => {
            this.getData();
        }, 10);

    }

    addTableRow(isFocus){
        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        this.props.editTable.addRow(tableid,num,isFocus);
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: '2', display:this.state.json['10140CHNLG-000007'] });/* 国际化处理： 已启用*/
        this.toggleShow("edit");
    }

    addRowCallback(){
        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'enablestate', {value: '2', display:this.state.json['10140CHNLG-000007'] });/* 国际化处理： 已启用*/
    }

    //按钮点击事件
    onButtonClick(props,id) {
        switch (id) {
            case 'add':
                this.addTableRow(true);
                break;
            case 'edit':
                this.toggleShow("edit");
                break;
            case 'cancel':
                promptBox({
                    color:"info",
                    title:this.state.json['10140CHNLG-000008'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140CHNLG-000009'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        this.props.editTable.filterEmptyRows(tableid,keys);
                        this.props.editTable.cancelEdit(tableid, this.onSearch(this.state.searchValue));
                    },
                    cancelBtnClick:()=>{
                        return;
                    }
                })
                break;
            case 'save':
                setTimeout(()=>{
                this.props.editTable.filterEmptyRows(tableid,keys);
                let tableData = this.props.editTable.getChangedRows(tableid,true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输

                if(!tableData || tableData.length === 0){
                    this.toggleShow("browse");
                    toast({title : this.state.json['10140CHNLG-000010'],color : 'success'});/* 国际化处理： 保存成功！*/
                    return
                }
                if(!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid,true))) {
                    return
                }
                let data = {
                    pageid:pagecode,
                    model : {
                        areaType: 'table',
                        pageinfo: null,
                        areacode:tableid,
                        rows: tableData,
                    }
                };
                // tableData.forEach(function(item, index, array){
                //     //是否其中转换成开关
                //     if (item.values['enablestate'].value){
                //         item.values['enablestate'].value = '2';
                //     }else{
                //         item.values['enablestate'].value = '3';
                //     }
                // });
                data.model.rows = tableData;
                let that = this;
                    this.props.validateToSave( data , ()=>{ajax({
                        url: urls['save'],
                        data,
                        success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            let { success,data} = res;
                            if (success) {
                                toast({title : this.state.json['10140CHNLG-000010'],color : 'success'});/* 国际化处理： 保存成功！*/
                                that.getData();
                            }
                        }.bind(this)
                    })} , {'channeltype':'editTable'} , 'grid' )

                },0)
                break;
            case "delete":
                let selectedData=this.props.editTable.getCheckedRows(tableid);
                if(selectedData.length==0){
                    toast({content:this.state.json['10140CHNLG-000011'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
                        color:"info",
                        title : this.state.json['10140CHNLG-000012'],/* 国际化处理： 确认删除*/
                        content : this.state.json['10140CHNLG-000013'],/* 国际化处理： 您确认删除所选数据？*/
                        beSureBtnClick : this.onDelForBrowse.bind(this)
                    });
                }
                break;
            case "refresh":
                this.getData(()=>{
                    this.onSearch(this.state.searchValue)
                    toast({title:this.state.json['10140CHNLG-000018'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case "print":
                let printParam={
                    funcode: appcode,
                    nodekey: '',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let allDatas = this.props.editTable.getAllData(tableid);
                let pks = [];
                allDatas.rows.forEach((item,index)=>{
                    pks.push(item.values['pk_type'].value)
                })
                if(pks.length==0){
                    return
                }
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            default:
                break;

        }

    }

    //打印功能函数
    pintFunction(param){
        let allDatas = this.props.editTable.getAllData(tableid);
        let pks = [];
        allDatas.rows.forEach((item,index)=>{
            pks.push(item.values['pk_type'].value)
        })
        if(pks.length==0){
            return
        }
        param.oids = pks;
        print(
            'pdf',
            urls['print'],
            param
        );
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
        this.props.button.setButtonDisabled({
            print:!allData.rows||allData.rows.length==0?true:false,
            output:!allData.rows||allData.rows.length==0?true:false,
            edit:!allData.rows||allData.rows.length==0?true:false,
        });
        this.props.editTable.setTableData(tableid,allData);
        this.toggleShow("browse");
    }

    //浏览态确认删除事件
    onDelForBrowse(){
        let selectedData=this.props.editTable.getCheckedRows(tableid);
        let indexArr=[];
        let dataArr=[];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3',
                values: {
                    ts: {
                        display: this.state.json['10140CHNLG-000002'],/* 国际化处理： 时间戳*/
                    },
                    pk_type: {
                        display: this.state.json['10140CHNLG-000003'],/* 国际化处理： 主键*/
                    }
                }
            };
            delObj.rowId=val.data.rowId;
            delObj.values.ts.value=val.data.values.ts.value;
            delObj.values.pk_type.value=val.data.values.pk_type.value;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
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
                showFormular(this.props,res,{
                    'channeltype':'editTable',
                });
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                    let allData = this.props.editTable.getAllData(tableid);

                    let newrows = allData.rows.filter((val) => {
                        if(val.status!=3){
                            return val
                        }
                    })
                    allData.rows = newrows;
                    this.props.button.setButtonDisabled({
                        print:newrows.length==0?true:false,
                        output:newrows.length==0?true:false,
                        edit:newrows.length==0?true:false,
                    });
                    this.props.editTable.setTableData(tableid,allData);
                    toast({title:this.state.json['10140CHNLG-000004'],color:'success'});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    render() {
        let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let {NCCheckbox} = base;
        let {createModal} = modal;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮

        return (
            <div className="nc-single-table">
                    <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
                        {/* 标题 title */}
                        <div className="header-title-search-area" >
                            {/* 应测试部要求，非要把标题改成平台的createBillHeadInfo */}
                            {createBillHeadInfo(
                                {
                                    title:this.state.json['10140CHNLG-000016'],
                                    initShowBackBtn:false,
                                    backBtnClick:()=>{}
                                }
                            )}
                            {/* {createPageIcon()}
                            <h2 fieldid ={this.state.json['10140CHNLG-000016']+'_title'} className="title-search-detail">{this.state.json['10140CHNLG-000016']/* 国际化处理： 渠道类型}</h2> */}
                            {/* 简单查询 */}
                            <div className="title-search-detail">
                                <NCFormControl
                                    key={"search"}
                                    placeholder={this.state.json['10140CHNLG-000014']/* 国际化处理： 请输入编码或名称筛选*/}
                                    value={this.state.searchValue}
                                    onChange={this.onSearch.bind(this)}
                                    type="search"
                                    disabled={this.state.searchDisable}
                                />
                            </div>
                            {/* 显示停用数据 */}
                            {isShowOffEnable?(
                                <div className="title-search-detail">
                                    <span className="showOff">
                                        <NCCheckbox
                                            checked={this.state.isShowOff}
                                            onChange={this.showOffChange.bind(this)}
                                            disabled={this.state.showOffDisable}
                                        >{this.state.json['10140CHNLG-000017']/* 国际化处理： 显示停用*/}</NCCheckbox>
                                    </span>
                                </div>
                            ):('')}
                        </div>
                        {/* 按钮区  btn-group */}
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                        </div>
                </div>
                    </NCDiv>
                {/* 列表区 */}
                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件
                        useFixedHeader:true,
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        onSelectedAll:this.updateButtonStatus.bind(this),
                        statusChange: function(){
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0)
                        }.bind(this),				//表格状态监听
                        showCheck:true,
                        showIndex:true,				//显示序号
                        isAddRow:true,
                        addRowCallback:this.addRowCallback.bind(this),
                        adaptionHeight:true
                    })}
                </div>
                {/* 删除前确认模态框 */}
                {createModal('modal',{
                    title : this.state.json['10140CHNLG-000012'],										//标题/* 国际化处理： 确认删除*/
                    content : this.state.json['10140CHNLG-000015'],							//内容/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
                    //cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
                })}
                {createModal('modal',{noFooter:false})}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode:'10140CHNLG',
                        nodekey:'',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        );
    }
}

SingleTable = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    }
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
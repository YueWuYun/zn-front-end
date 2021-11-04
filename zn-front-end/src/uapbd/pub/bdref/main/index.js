//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,createScript ,createPageIcon} from 'nc-lightapp-front';
const {Refer} =  high;
let { NCPopconfirm,NCModal,NCInput:Input } = base;
import MetaRef from "../../../../uap/refer/riart/bdmdEntityRef/index";
import Referencing from "../referencing/index";
import  Utils from '../../../public/utils';
const { NCDiv } = base;
const searchid = '10140REFCO';
const tableid = 'referenced';
const tableid2 = 'referencing';
const pagecode = '10140REFCO_referenced';
const appid = '0001Z010000000002YYV';
const urls = {
    query : '/nccloud/uapbd/bdref/querybdref.do',
    queryTemplet : '/nccloud/platform/templet/querypage.do',
    queryDefRef:'/nccloud/uapbd/bdref/querydefref.do',
    queryReferencing : '/nccloud/uapbd/bdref/querybdrefdata.do'
};
let allTableData = {};

//获取并初始化模板
let initTemplate = (props) => {

    props.createUIDom({
            pagecode : pagecode
            /*appid : appid*/
        },
        (data)=>{
            let meta = data.template;
            props.meta.setMeta(meta);
            data.button && props.button.setButtons(data.button);
            if(data.button){
                props.button.setButtons(data.button);
            }
        }
    );
}

class BDReferenced extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.props.button.setButtonsVisible({
            qry:true,
            bill:true,
            list:false,
            relatedbillButton:false
        });
        this.state={
            disabled:false,
            curMeta:'',
            curPk:{},
            RefPk:'',
            curRecord:{},
            queryParam:{},
            json:{},
            inlt:null
        };
    }

    componentDidMount(){
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }

        }
        this.props.MultiInit.getMultiLang({moduleId: '10140REFCO',domainName: 'uapbd',callback})
    }

    getData = (callback) => {
        let data = {doctypePk: this.state.curMeta.refpk,doctype:this.state.curMeta.refpk,docpk:this.state.curPk[0].refpk};
        ajax({
            url: urls['query'],
            data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data.status=='0') {
                        this.state.curRecord={};
                        //显示公式
                        Utils.showFormular(this.props,res,{
                            [tableid]:"editTable"
                        })
                        allTableData = data.data[tableid];
                        allTableData.rows.forEach((item)=>{
                            let itemValue = item.values;
                            itemValue.refpk = {value:this.state.curPk[0].refpk}
                        })
                        this.props.editTable.setTableData(tableid, allTableData);
                        callback&&callback(allTableData);
                    }else if(data.status=='1'){
                        this.props.editTable.setTableData(tableid, {rows:[]});
                        callback&&callback({});
                    }
                }
            }
        });
    };

    //更新按钮状态
    updateButtonStatus(){
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        this.props.button.setButtonsVisible({
            qry:true,
            bill:true,
            list:false,
            relatedbillButton:false
        });
    }

    //按钮点击事件
    onButtonClick(props,id) {
        switch (id) {
            case 'qry':
                if(JSON.stringify(this.state.curPk)=='{}'||JSON.stringify(this.state.curPk)=='[]'){
                    toast({content:this.state.json['10140REFCO-000000'],color:'warning'});/* 国际化处理： 档案类型和档案不能为空！*/
                    return;
                }
                this.getData((data)=>{
                    if(data.rows&&data.rows.length>0){
                        toast({content:this.state.inlt&&this.state.inlt.get(['10140REFCO-000001'],{count:data.rows.length})/* 国际化处理： 查询成功，共{count}条。*/,color:'success'});
                    }else{
                        toast({content:this.state.json['10140REFCO-000003'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据！*/
                    }
                });
                break;
            case 'bill':
                if(props.editTable.getAllData(tableid).rows<1){
                    toast({content:this.state.json['10140REFCO-000018'],color:'warning'});/* 国际化处理： 没有引用单据的信息！*/
                    return;
                }
                if(JSON.stringify(this.state.curRecord)=="{}"){
                    toast({content:this.state.json['10140REFCO-000019'],color:'warning'});/* 国际化处理： 请选择数据！*/
                    return;
                }
                this.onRowDoubleClick(this.state.curRecord,0,props);
                break;
            case 'refresh':
                this.getData((data)=>{
                    toast({ color: 'success', title: this.state.json['10140REFCO-000004'] });/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'list':
                this.props.editTable.cancelEdit(tableid);
                //this.props.editTable.showColByKey(tableid,'opr');//显示操作列
                break;
            case "relatedbill":

                break;

        }
    }

    onMetaChange(val){
        this.state.curMeta= val;
        this.setState(this.state.curMeta);

        if(JSON.stringify(val)=='{}'){
            this.state.curPk = {};
            this.state.RefPk = '';
            this.setState(this.state);
            return;
        }
        let data = {doctypePk: val.refpk};
        ajax({
            url: urls['queryDefRef'],
            data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    debugger
                    if(data.status=='0') {
                        this.setState({disabled:false});
                        let refcode = data.refcode;
                        this.createScript('','','',refcode);
                        this.setState(this.state);
                    }else if(data.status=='1'){
                        this.setState({disabled:true});
                        toast({content:data.message,color:'warning'});
                    }else if(data.status=='101'){
                        this.setState({disabled:true});
                        toast({content:this.state.json['10140REFCO-000005'],color:'warning'});/* 国际化处理： 没有默认的参照*/
                    }else if(data.status=='102'){
                        this.setState({disabled:true});
                        toast({content:this.state.json['10140REFCO-000006'],color:'warning'});/* 国际化处理： 该档案没有轻量化默认参照，请到NC客户端查询*/
                    }
                }
            }
        });
    }

    handleLoad(moduletype, moduleId, attrcode, refcode) {
        this.state.RefPk = window[refcode].default;
        this.setState({RefPk:this.state.RefPk});
    }
    createScript(moduletype, moduleId, attrcode, src, renderItem) {
        var that = this,
            scripts = Array.from(document.getElementsByTagName('script')),
            flag = scripts.find((e) => {
                return e.src.includes(src);
            });
        if (window[src]) {
            // 已经加载过script标签
            this.handleLoad.call(that, moduletype, moduleId, attrcode, src);
        } else {
            let script;
            if (flag) {
                script = flag;
            } else {
                script = document.createElement('script');
                script.src = '../../../../' + src + '.js';
                script.type = 'text/javascript';
                document.body.appendChild(script);
            }

            script.onload = script.onload || this.handleLoad.bind(that, moduletype, moduleId, attrcode, src);
            window;
            script.onerror =
                script.onerror ||
                function () {
                    console.error(`${this.state.json['10140REFCO-000010']}${src}${this.state.json['10140REFCO-000011']}，${this.state.json['10140REFCO-000012']}`);/* 国际化处理： 找不到,这个文件,请检查引用路径*/
                };
        }
    }
    onRowDoubleClick(record ,index,props){
        if(JSON.stringify(record)=='{}'){
            this.state.curRecord = {};
            return;
        }
        this.state.curRecord = record;
        this.state.queryParam = JSON.stringify(record)=='{}'?{}:{
            referencingTable:record.values.referencingtablename.value,
            referencingColumn:record.values.referencingtablecolumn.value,
            referencedTable:record.values.referencedtablename.value,
            docPk:record.values.refpk.value
        }
        this.setState(this.state,()=>{
            this.props.modal.show('sysmodal',{
                /*content:modalContent*/
                noFooter : true,
            });
        })

        /*this.props.linkTo('referencing/index.html', {
            referencingTable:record.values.referencingtablename.value,
            referencingColumn:record.values.referencingtablecolumn.value,
            referencedTable:record.values.referencedtablename.value,
            docPk:record.values.refpk.value,
            data:this.props.editTable.getAllRows(tableid, false)
        });*/
    }

    onRowClick(props,moduleId,record){
        this.state.curRecord = record;
        this.setState(this.state);
    }

    onPkChange(val){
        this.state.curPk= val;
        this.setState(this.state.curPk);
    }

    render() {
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { cardTable,table, button, search,editTable,modal } = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { createButton } = button;
        let {NCFormControl,NCCheckbox} = base;
        let {createModal} = modal;
        let {createCardTable} = cardTable;
        var createMetaRefRender = () => {
            return   (
                <div className="search-box" style={{width:'214px',marginLeft:'20px'}}>
                    <span style={{marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red'}}>
                        <span style={{position: 'absolute',left: 3}}>*</span>
                    </span>
                    {MetaRef({
                        fieldid:'metaref',
                        onChange:this.onMetaChange.bind(this),
                        placeholder:this.state.json['10140REFCO-000007'],/* 国际化处理： 档案类型*/
                        isMultiSelectedEnabled:false,
                        value:this.state.curMeta
                    })}
                </div>
            ) ;
        };
        var createRefPkRender = ()=> {

            return this.state.RefPk == '' ? (
                <div className="search-box" style={{width:'214px',marginLeft:'20px'}} disabled>
                    <Input fieldid = 'refpks' disabled placeholder={this.state.json['10140REFCO-000008']/* 国际化处理： 档案*/}/>
                </div>
            ) :
            (
                <div className="search-box" style={{width:'214px'}}>
                    {this.state.RefPk({
                        fieldid:'refpk',
                        onChange: this.onPkChange.bind(this),
                        isMultiSelectedEnabled: true,
                        placeholder:this.state.json['10140REFCO-000008'],/* 国际化处理： 档案*/
                        value: this.state.curPk,
                        isShowDisabledData:true,
                        isShowUnit:true,
                        disabled:this.state.disabled
                    })}
                </div>
            )
        }


        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom: 'none'}}>
                    {/* 标题 title */}
                    <div className="header-title-search-area" >
                        {/* {createPageIcon()} */}
                        {/* <h2 className="title-search-detail"> */}
                            {createBillHeadInfo({
                                title:this.state.json['10140REFCO-000013']/* 国际化处理： 档案引用查询*/,
                                initShowBackBtn:false
                            }	
                            )}
                        
                        {/* </h2> */}
                        {createMetaRefRender()}
                        {createRefPkRender()}
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
                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        useFixedHeader:true,
                        onRowDoubleClick:this.onRowDoubleClick.bind(this),
                        onRowClick:this.onRowClick.bind(this),
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        showIndex:false,				//显示序号
                        showCheck:false,			//显示复选框
						adaptionHeight:true
                    })}
                </div>
                {createModal('sysmodal',{
                    title : this.state.json['10140REFCO-000009'],/* 国际化处理： 引用数据*/
                    content:function(){
                        return (<Referencing {...{config:this.state.queryParam}} />)
                    }.bind(this)(),
                    noFooter : false,
                })}
            </div>

        );
    }
}

BDReferenced = createPage({
    initTemplate: initTemplate
})(BDReferenced);

ReactDOM.render(<BDReferenced />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
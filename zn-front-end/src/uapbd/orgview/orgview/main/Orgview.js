//KWX+CU0B005Ek696Xt/gmOtNLJzNL7pazojIO5ep9Ziw6Cp/ROMtNS5nj1R1dyDf

import React, { Component } from 'react';
import { ajax, base,toast,createPageIcon } from 'nc-lightapp-front';
import {component} from '../../../public/platwapper/index.js';
const {NCTable,NCSelect } = component;
let { NCTabs, NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCIcon,NCFormControl,NCPopconfirm,NCDiv } = base;

import createUIDom from "../../../public/utils/BDCreateUIDom";
import createConfig from './ViewConfig.js'
import {CompUtils}   from '../../../public/excomponents';
import Utils,{BaseUtils}   from '../../../public/utils';
import OrgChart from './OrgChart.js'
var  DEF_VERSION_STRING = '当前最新版本';
import OrgUnitVersion from '../../../org/orgunit/version/index';
import './index.less';

var EMPTY_FN = function(){};
var createUIDomParam = function(pagecode, appcode){
    var param  = {
        pagecode:pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? {...param, appcode: appcode} : param;
};

export default class Orgview extends Component {
    constructor(props) {
        super(props);
        this.config = this.props.config

        //init template button
        createUIDom(props)(this.config,{moduleId: "10102ORGVIEW",domainName: 'uapbd' }, (data, lang)=> {
            this.lang = lang;
            this.config.title = this.lang[this.config.title];
            createConfig.lang = this.lang;
            DEF_VERSION_STRING = this.lang['ORGVIEW-000000'];
            var state = {}, viewComps = {}, typeComp = {}, listTypes = [], versionComp,
                configs = createConfig(this.config.nodetype);

            configs.forEach( view => {
                viewComps[view.fieldName] = view;
                listTypes.push({
                    key: view.name,
                    value: view.fieldName
                });
                typeComp = {
                    listTypes : listTypes,
                    curFieldName : undefined
                }
            });

            versionComp = {
                curVersion: DEF_VERSION_STRING, //此处多语会影响查询数据
                versionDatas: [],
                showVersions:undefined,
                rest: function(){
                    this.curVersion = DEF_VERSION_STRING,
                        this.versionDatas = [{
                            key:DEF_VERSION_STRING,
                            value: DEF_VERSION_STRING
                        }]
                    this.showVersions = undefined;
                },
                init: function(versions = []){
                    this.rest();
                    var otherVer = versions.map(v => {
                        return {
                            key:v,
                            value:v
                        };
                    });
                    this.versionDatas = this.versionDatas.concat(otherVer);
                }
            };

            this.state = {
                typeComp: typeComp,
                viewComps: viewComps,
                versionComp:versionComp,
                viewdatas: [],
                tabval: 'table',
                selectRow: undefined,
                selectRecord:undefined,
                meta: data.template || {},
                showOff:{
                    defaultChecked: false,
                    checked: false,
                    size: 'lg',
                    onChange: (value) =>{
                        this.state.showOff.checked = value;
                        this.setState(this.state, () =>{
                            this.onRefresh();
                        });
                    }
                },
                init: true,
                relation:{
                    modal:{
                        show: false,
                        modalDropup: true,
                        size: 'xlg',
                        onHide:() =>{
                            this.state.relation.btnCancel.onClick();
                        },
                    },

                    areacode:'relation',
                    btnCancel:{
                        name: this.lang['ORGVIEW-000006'],/* 国际化处理： 关闭*/
                        onClick: () => {
                            var {modal} = this.state.relation;
                            modal.show = false;
                            this.setState(this.state);
                        }
                    }

                },
                setModalShow:false
            };
            this.setState(this.state, () =>{
                props.meta.setMeta(data && data.template ? data.template:{});
                props.button.setButtons(data && data.button ? data.button: []);
                setTimeout(() => {
                    this.updateBtnStatus();
                }, 0);
            });


        });

        this.state = {
            init: false
        };

    }
    componentDidMount(){
        this.props.button.setDisabled({
            refresh : true
        });
    }

    updateBtnStatus(){
        var {selectRow, tabval,versionComp,typeComp} = this.state;
        var hasType = typeComp.curFieldName,
            hasCurVersion = versionComp.curVersion == DEF_VERSION_STRING,
            hasSelect = selectRow,
            hasTable = tabval =='table';
        this.props.button.setDisabled({
            addv:    !(hasType  &&  hasCurVersion && hasTable ),
            deletev: !(hasType  &&  !hasCurVersion && hasTable ),
            relation :  !(hasType  &&  hasCurVersion && hasSelect && hasTable ),
            more :  !(hasType   && hasSelect && hasTable ),
            createpic:!(hasType),
            setDiagram:!(hasType),
            onMoreInfoCanvas:!(hasType)
        });

        this.props.button.setButtonsVisible(['addv','deletev'], hasType  && hasTable);
        this.props.button.setButtonsVisible(['relation','more'],hasType  && hasTable);
        this.props.button.setButtonsVisible(['createpic','setDiagram','onMoreInfoCanvas'], !hasTable);
    }

    onBtnOperation(props,btncode){
        switch (btncode) {
            case 'refresh':
                this.onRefresh();
                break;
            case 'addv':
                this.onAddVersion();
                break;
            case 'deletev':
                this.onDeleteVersion();
                break;
            case 'relation':
                this.onRelation();
                break;
            case 'more':
                this.onMoreInfo();
                break;
            case 'createpic':
                this.onCreatepic();
                break;
            case 'setDiagram':
                this.setState({
                    setModalShow:true
                });
                break;
            case 'onMoreInfoCanvas':
                this.onMoreInfoCanvas();
                break;
            default:
                break;
        }
    }



    onViewTypeChange(fieldName){
        var state = this.state,
            typeComp = state.typeComp,
            versionComp = state.versionComp,
            viewComp = state.viewComps[fieldName];
        //设置变更的类型, 恢复默认条件,
        typeComp.curFieldName = fieldName;
        versionComp.rest();
        state.selectRow = undefined;
        state.selectRecord = undefined;
        state.expandedRowKeys = [];
        state.viewdatas =  [];
        //如果是清空下拉选项
        if(undefined == fieldName){
            this.setState(this.state)
            this.props.button.setDisabled({
                refresh : true
            });
        }else{
            this.setState(this.state,()=>{
                this.loadData(true, () =>{
                    this.handlerVerionFilter(() =>{
                        this.updateBtnStatus();
                    })
                });
            });
            this.props.button.setDisabled({
                refresh : false
            });
        }
    }

    onControlChange(){
        this.setState(this.state,() =>{
            this.handlerVerionFilter(() =>{
                var state = this.state,
                    typeComp = state.typeComp,
                    versionComp = state.versionComp;
                this.onVersionChange(versionComp.curVersion);
            });
        });
    }

    handlerVerionFilter(callback){
        var state = this.state,
            typeComp = state.typeComp,
            versionComp = state.versionComp,
            viewComp = state.viewComps[typeComp.curFieldName];

        var controlData =  viewComp.controlData || {};
        var scopes = controlData.scopes;
        var curScope = controlData.curScope;


        var showVersions =[];
        if(!scopes){
            this.state.versionComp.showVersions = undefined;
            this.setState(this.state,() =>{
                callback && callback();
            });
            return;
        }
        scopes.filter( p => {
            return p.value == curScope;
        }).forEach(e => {
            showVersions = [... e.versionnames || [], ...showVersions]
        });
        this.state.versionComp.showVersions = [DEF_VERSION_STRING,...showVersions];
        this.state.versionComp.showVersions =  this.state.versionComp.showVersions.map(v => {
            return {
                key:v,
                value:v
            };
        });

        this.state.versionComp.curVersion = DEF_VERSION_STRING;
        this.setState(this.state,() =>{
            callback && callback();
        });
    }

    onVersionChange(value){
        var state = this.state,
            versionComp = state.versionComp,
            handerOnVersionChange = value !=  versionComp.curVersion;

        versionComp.curVersion = value;
        if(undefined == value){
            this.setState(this.state)
        }else{
            this.setState(this.state, () =>{
                this.loadData(false, () =>{
                    //行政组织版本是历史版本时 需要停用虚拟部门等选项。
                    var typeComp = this.state.typeComp,
                        viewComp = this.state.viewComps[typeComp.curFieldName];
                    handerOnVersionChange && viewComp.handerOnVersionChange && viewComp.handerOnVersionChange(value);
                    this.setState(this.state,()=>{
                        this.updateBtnStatus();
                    });
                });
            });
        }
    }

    loadData(restVer, callback){
        var state = this.state,
            typeComp = state.typeComp,
            versionComp = state.versionComp,
            viewComp = state.viewComps[typeComp.curFieldName];
        ajax({
            loading: true,
            url: '/nccloud/uapbd/orgview/TreeOrgAction.do',
            data:{
                scope:  this.config.nodetype === 'glb' ? 0 : 1,// * 全局视图范围  0;  集团视图范围  = 1;
                type: viewComp.typeno,
                version: versionComp.curVersion,
                showOff: this.state.showOff.checked,
                areaname: viewComp.areaname,
                pagecode: this.config.pagecode //'10102GLORGV'

            },
            success: (res) => {
                var data = res.data,
                    versions = data.versions || [],
                    control  = data.control || [],
                    viewdatas = data.viewdata || [],
                    expandedRowKeys = [];

                var notCanShowOffTypeNos = [0,1,4,5,6,9,12,17]; //这些组织需要收到显示禁用的控制
                if(notCanShowOffTypeNos.indexOf(viewComp.typeno) != -1){
                    if(!this.state.showOff.checked){
                        viewdatas = viewdatas.filter( d => {
                            return d.values.enablestate.value == '2';
                        });
                    }
                }

                viewdatas = viewdatas.map( data => {
                    data.values._id ={value : BaseUtils.id()};
                    expandedRowKeys.push(data.values._id.value);
                    return data;
                });
                if(restVer){
                    versionComp.init(versions);
                    viewComp.initControlData(control);
                }
                state.selectRow = undefined;
                state.selectRecord = undefined;
                state.expandedRowKeys = expandedRowKeys;
                state.viewdatas = viewdatas || [];
                this.setState(state, () => {
                    callback && callback();
                });
            }
        });
    }

    onTabChange(val){
        var state = this.state;
        state.tabval = state.typeComp.curFieldName == undefined ? 'table': val ;
        this.setState(state,() =>{
            this.updateBtnStatus();
        });
    }


    onFileImg(){
        let viewComp = this.state.viewComps[this.state.typeComp.curFieldName],
            name = viewComp.name;
        this.downloadFile(name, document.getElementById('view').toDataURL("image/png"));
    }

    onAddVersion(){
        var state = this.state,
            typeComp = state.typeComp,
            versionComp = state.versionComp,
            viewComp = state.viewComps[typeComp.curFieldName];
        var otherParam = (viewComp.addvParam && viewComp.addvParam()) || {};
        ajax({
            loading: true,
            url: '/nccloud/uapbd/orgview/AddVersionAction.do',
            data:{
                scope:  this.config.nodetype === 'glb' ? 0 : 1,// * 全局视图范围  0;  集团视图范围  = 1;
                type: viewComp.typeno,
                version: versionComp.curVersion,
                showOff: this.state.showOff.checked,
                areaname: viewComp.areaname,
                ...otherParam,
                ...this.config
            },
            success: (res) => {
                this.onViewTypeChange(typeComp.curFieldName);
                toast({title:this.lang['ORGVIEW-100001'],color:'success'});//'生成快照成功'
            }
        });
    }

    onDeleteVersion(){
        var delHandler = () =>{
            var state = this.state,
                typeComp = state.typeComp,
                versionComp = state.versionComp,
                viewComp = state.viewComps[typeComp.curFieldName];
            ajax({
                loading: true,
                url: '/nccloud/uapbd/orgview/DeleteVersionAction.do',
                data:{
                    scope:  this.config.nodetype === 'glb' ? 0 : 1,// * 全局视图范围  0;  集团视图范围  = 1;
                    type: viewComp.typeno,
                    version: versionComp.curVersion,
                    showOff: this.state.showOff.checked,
                    areaname: viewComp.areaname,
                    ...this.config

                },
                success: (res) => {
                    this.onViewTypeChange(typeComp.curFieldName);
                    // versionComp.rest();
                    // versionComp.init(res.data.versions);
                    // //
                    // this.state.versionComp = versionComp;
                    // this.setState(this.state);
                }
            });
        };
        this.props.modal.show('modal',{
            title: this.lang['ORGVIEW-000001'],/* 国际化处理： 确认删除*/
            content: this.lang['ORGVIEW-000002'],/* 国际化处理： 是否确认要删除?*/
            beSureBtnClick: delHandler
        });

    }
    onRefresh(){
        var state = this.state,
            curFieldName = state.typeComp.curFieldName;
        if(curFieldName){
            this.loadData(false, () => {
                toast({title :this.lang['ORGVIEW-000008'],color : 'success'});/* 国际化处理： 刷新成功*/
                this.updateBtnStatus();
            });
        }
    }
    onMoreInfo(){
        // debugger;
        var selectRecord = this.state.selectRecord;
        if(selectRecord.liatype&&selectRecord.liatype==0){
            toast({title :this.lang['ORGVIEW-003018'],color : 'warning'});/* 国际化处理： 该记录不是组织，没有组织明细！*/
            return
        }
        var  pkorg = selectRecord.pk_busiorg || selectRecord.pk_orgunit;
        // let curFieldName=this.state.typeComp.curFieldName;
        if (selectRecord.orgvoclass === "nc.vo.org.LiabilityBookVO"){
            this.props.openTo('/nccloud/resources/uapbd/org/liabilitybook_base/main/#/main',{appcode:'10100LB',pagecode:'10100LB_liabilitybook',pk_org:pkorg,listShow:false});
        } else if (selectRecord.orgvoclass === "nc.vo.org.AccountingBookVO"){
            this.props.openTo('/nccloud/resources/uapbd/org/accountingbook_glb/main/#/main',{appcode:'10100ACB',pagecode:'10100ACB_accountingbook',pk_org:pkorg,listShow:false});
        }else{
            this.props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/version',{appcode:'10100ORG',pagecode:'10100ORG_orgunit',pk_org:pkorg});
        }
        // let config = {
        //     pk_vid: undefined,
        //     pk_org:pkorg,
        //     pagecode:'10100ORG_orgunitcard',
        //     appcode:'10100ORG',
        //     appid:'0001Z010000000001NOH',
        //     type:'normal',

        //     subGrid:'org',
        //     subGrid1:'corp',
        //     subGrid2:'hrorg',
        //     subGrid3:'financeorg',
        //     subGrid4:'fundorg',
        //     subGrid5:'purchaseorg',
        //     subGrid6:'saleorg',
        //     subGrid61:'saleorgrelation',
        //     subGrid7:'stockorg',
        //     subGrid71:'stocktrafficrelation',
        //     subGrid72:'stockqccenterrelation',
        //     subGrid73:'stockorgrelation',
        //     subGrid74:'stockassetrelation',
        //     subGrid8:'trafficorg',
        //     subGrid9:'qccenter',
        //     subGrid10:'assetorg',
        //     subGrid101:'assetorgmaintainrelation',
        //     subGrid11:'maintainorg',
        //     subGrid111:'maintainstockrelation',
        //     subGrid12:'liabilitycenter',
        //     subGrid13:'itemorg',
        //     subGrid131:'itemstockrelation',
        //     subGrid14:'planbudget',
        //     subGrid15:'adminorg',
        //     subGrid16:'factory',
        //     subGrid17:'plancenter'
        // };
        // this.props.modal.show('orgversion',{
        //     content: <OrgUnitVersion {...{config:config}}/>,
        //     userControl:false,//自己控制什么时候关闭窗口
        //     beSureBtnClick:() => {
        //     }
        // });
        //this.props.openTo('/uapbd/org/orgunit_glb/list/index.html',{appcode:'10100ORG',pagecode:'10100ORG_orgunit'});
    }
    onRelation(){
        var selectRecord = this.state.selectRecord,
            pkorg = selectRecord.pk_busiorg || selectRecord.pk_orgunit;
        ajax({
            loading: true,
            url: '/nccloud/uapbd/orgview/RelationAction.do',
            data:{
                pkorg: pkorg,
                ...this.config
            },
            success: (res) => {

                this.state.relation.modal.show = true;
                this.setState(this.state,() => {
                    if(res.data)
                        this.props.table.setAllTableData('relation',res.data['relation']);
                    else
                        this.props.table.setAllTableData('relation',{
                            areacode: 'relation',
                            rows: []
                        });
                });
            }
        });
    }

    onCreatepic(){
        var state = this.state;
        state.tabval = 'view';
        this.setState(state,() =>{
            this.updateBtnStatus();
            let viewComp = this.state.viewComps[this.state.typeComp.curFieldName],
                name = viewComp.name;
            let picCanvas = document.createElement('canvas');
            let viewContent = document.getElementById('view').getContext("2d");
            let picContent = picCanvas.getContext("2d");

            picCanvas.width = this.canvasWidth;
            picCanvas.height = this.canvasheight;

            let viewData = viewContent.getImageData(0,0,this.canvasWidth,this.canvasheight);
            picContent.putImageData(viewData,0,0);

            this.downloadFile(name,picCanvas.toDataURL("image/png"));

        });


    }
    getCanvasWH(width,height){
        this.canvasWidth = width;
        this.canvasheight = height;
    }
    //将canvas转成图片付到按钮上
    downloadFile(fileName, content){
        var blob = this.base64Img2Blob(content); //new Blob([content]);
        var aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
    }

    //canvas base64转Blob
    base64Img2Blob(code){
        var parts = code.split(';base64,');
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
    }
    hanldHideSetModal(){
        this.setState({
            setModalShow:false
        });
    }
    onMoreInfoCanvas(){
        if(!this.canvasData){
            toast({title :this.lang['ORGVIEW-003017'],color : 'warning'});/* 国际化处理： 请先选择数据再进行操作*/
        } else{
            //let pkorg = this.canvasData.data.pk_org
            let curFieldName=this.state.typeComp.curFieldName;
            let pk_orgunit;
            switch(curFieldName){
                case 'orgtype0'://行政组织
                    pk_orgunit=this.canvasData.data.pk_orgunit;
                    break;
                case 'orgtype1'://财务组织
                    pk_orgunit=this.canvasData.data.pk_org;
                    break;
                default:pk_orgunit=this.canvasData.data.pk_busiorg;
            }
            if(this.canvasData.data.isbook){
                this.props.openTo('/nccloud/resources/uapbd/org/setofbook/main/#/version',{appcode:'10100SOB',pagecode:'10100SOB_sobcard',pk_setofbook:pk_orgunit});
            }else{
                this.props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/version',{appcode:'10100ORG',pagecode:'10100ORG_orgunit',pk_org:pk_orgunit});
            }
            
        }

    }
    setSelectNode(node){
        this.canvasData = node;
    }
    render(){
        if(!this.state.init)
            return '';
        const {ncmodal} = this.props;
        let { createModal } = ncmodal;  //模态框
        var state = this.state,
            typeComp = state.typeComp,
            versionComp = state.versionComp,
            curViewComp = typeComp.curFieldName ?  state.viewComps[typeComp.curFieldName] : undefined,
            viewdatas = Utils.clone(state.viewdatas),
            relation = this.state.relation,

            columns = [],
            tableTreeDatas = [],
            chartTreeDatas = [];

        let title = (item)=>{
            let isRequiredClass = item.required ? "card-table-title-required":"card-table-title-unrequired";
            let style = item.color ? {color: item.color} : {color: ''};
            return (
                <div
                    className={isRequiredClass}
                    style={style}
                    fieldid={item.attrcode+"_table-area"}
                >
                    {item.required && <span className="mark-required">*</span>}
                    {item.label}
                </div>
            )
        };

        //处理列
        var prepareColumn = () =>{
            if(!curViewComp) return;
            columns = this.state.meta[curViewComp.areaname].items.map(item => {
                var  attrcode = item.attrcode;
                var col =  {
                    title: title(item),
                    dataIndex: attrcode,
                    key: attrcode,
                    visible: item.visible || false,
                    render:(value, record) =>{
                        if(item.itemtype =='switch'){
                            return  <NCCheckbox disabled={true} checked={value}></NCCheckbox>
                        }
                        //return <div style={{display:'inline'}} title={record[attrcode+ '_name']}>{record[attrcode+ '_name']}</div> || '';
                        return record[attrcode+ '_name']|| '';
                    }
                };
                return col;
            });
            columns = columns.filter( c => {
                return c.visible;
            });
        };
        prepareColumn();
        //按照条件过滤数据,并转换为tinper和chart可用的数据
        var prepareData = () =>{
            if(!curViewComp) return;
            //先过滤， 再转换，
            viewdatas = curViewComp.controlListFilter ? curViewComp.controlListFilter (viewdatas) : viewdatas; //过滤
            //viewdatas = CompUtils.dataPlatToTinper(viewdatas, newVal => newVal['_id'] = BaseUtils.id() );
            viewdatas = CompUtils.dataPlatToTinper(viewdatas, (newValues, name, val, vals) =>{

            });
            tableTreeDatas = curViewComp.converTreeData(viewdatas);
            chartTreeDatas = {
                title: 'root',
                children:tableTreeDatas,
                name: curViewComp.name,
                lang:this.lang
            };
        };
        prepareData();

        let {  button, search,DragWidthCom,modal,table,form,cardTable, editTable ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
            <div className="nc-single-table">
                {createModal('modal',{noFooter:false})}
                {createModal('orgversion',{noFooter:false})}
                {/* 标题 title */}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" >
                    <div className="header-title-search-area">
                        {
                            createBillHeadInfo(
                                {
                                    title :this.config.title,             //标题
                                    initShowBackBtn:false
                                }
                            )}
                        <span className="showOff" style={{marginTop: 7}}>
                            <NCCheckbox {...this.state.showOff }>{this.lang['ORGVIEW-000009']/* 国际化处理： 显示停用*/}</NCCheckbox>
                        </span>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area" >
                        {button.createButtonApp({
                            area: 'main',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="nc-singleTable-search-area">
                    {/* 选择类型区域  */}
                    <NCRow>
                        <NCCol ms={12} md={12} style={{marginTop:10}}>
                            <NCRow>
                                <NCCol ms={3} md={3}>
                                    <div >
                                        <NCSelect
                                            fieldid='orgviewselectone'
                                            value={typeComp.curFieldName}
                                            data={typeComp.listTypes}
                                            onChange={this.onViewTypeChange.bind(this)}
                                            placeholder={this.lang['ORGVIEW-000003']}/* 国际化处理： 选择视图类型*/
                                        />
                                    </div>
                                </NCCol>
                                <NCCol ms={4} md={4}>
                                    { curViewComp ?  curViewComp.createControlComp(this.onControlChange.bind(this)) : '' }
                                </NCCol>
                                <NCCol ms={5} md={5}></NCCol>
                            </NCRow>
                        </NCCol>
                        <NCCol ms={12} md={12} style={{marginTop: 5,marginBottom: 10}}>
                            <NCRow>
                                <NCCol md={3} ms={3}>
                                    <div >
                                        <NCSelect fieldid='orgviewselecttwo' showClear = {false} value={versionComp.curVersion} data={versionComp.showVersions || versionComp.versionDatas} notFoundContent={this.lang['ORGVIEW-000004']/* 国际化处理： 没有版本信息,选择版本*/} placeholder={this.lang['ORGVIEW-000005']} onChange={this.onVersionChange.bind(this)}/>
                                    </div>
                                </NCCol>
                                <NCCol md={9} ms={9}></NCCol>
                            </NCRow>
                        </NCCol>
                    </NCRow>
                </div>
                <div className="nc-singleTable-table-area orgview-table nc-theme-gray-area-bgc" style={{height:'calc(100% - 160px)'}}>
                    <NCTabs defaultActiveKey={"table"} activeKey={this.state.tabval} style={{height:'100%'}} onChange={this.onTabChange.bind(this)}>
                        <NCTabs.NCTabPane tab={this.lang['ORGVIEW-000010']/* 国际化处理： 组织树表*/} key="table">
                            <NCTable
                                columns={columns}
                                data={tableTreeDatas}
                                rowKey="_id"
                                expandedRowKeys = {this.state.expandedRowKeys}
                                rowClassName={(record)=> {return record._id == state.selectRow ? 'nc-theme-zrow-bgc orgview-table-selected-row' : ''}}
                                onRowClick={(record) => {
                                    state.selectRow = record._id;
                                    state.selectRecord = record;
                                    this.setState(state,() => {
                                        this.updateBtnStatus();
                                    });
                                }}
                                onExpand={(expanded, n, keys) => {
                                    var me = this;
                                    if(expanded){
                                        me.state.expandedRowKeys.push(n._id);
                                    }else{
                                        me.state.expandedRowKeys = me.state.expandedRowKeys.filter( na => {
                                            return na !=  n._id
                                        });
                                    }
                                    me.setState(me.state);
                                }}/>
                        </NCTabs.NCTabPane>
                        <NCTabs.NCTabPane tab={this.lang['ORGVIEW-000011']/* 国际化处理： 结构图示*/} className='orgChart' key="view" forceRender={true}>
                            <div style={{width:'100%',height:'100%',textAlign:'center'}}>
                                <OrgChart
                                    getCanvasWH = {this.getCanvasWH.bind(this)}
                                    setSelectNode = {this.setSelectNode.bind(this)}
                                    data={chartTreeDatas}
                                    setModalShow={this.state.setModalShow}
                                    hanldHideSetModal = {this.hanldHideSetModal.bind(this)}
                                />
                            </div>
                        </NCTabs.NCTabPane>
                    </NCTabs>
                </div>

                <NCModal {...relation.modal} fieldid = 'orgview'>
                    <NCModal.Header closeButton={true}><NCModal.Title>{this.lang['ORGVIEW-000012']/* 国际化处理： 业务委托关系*/}</NCModal.Title></NCModal.Header>
                    <NCModal.Body>
                        {table.createSimpleTable(relation.areacode, {})}
                    </NCModal.Body>
                    {/* <NCModal.Footer>
                        <span>
                            <NCButton  {...relation.btnCancel}>{relation.btnCancel.name}</NCButton>
                        </span>
                    </NCModal.Footer> */}
                </NCModal>
            </div>
        )
    }
}

//KWX+CU0B005Ek696Xt/gmOtNLJzNL7pazojIO5ep9Ziw6Cp/ROMtNS5nj1R1dyDf
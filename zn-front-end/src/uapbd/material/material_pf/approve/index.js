//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,high,print,createPageIcon} from 'nc-lightapp-front';
import Materialpftabs from "../components/materialpftabs.js"
import createUIDom from "../../../public/utils/BDCreateUIDom";
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix  } = base;
const { NCTabs,NCCol,NCMessage } = base;
const NCTabPane = NCTabs.NCTabPane;
const { NCUploader,PrintOutput } = high;
const { NCDiv } = base;

const formId1 = 'material_pf';
const formId2 = 'material';
const tableId1 = 'materialconvert';
const tableId2 = 'fi';//财务
const tableId3 = 'pfc';//利润中心npm ru
const tableId4 = 'pu';//采购
const tableId5 = 'sale';//销售
const tableId6 = 'stock';//库存
const tableId7 = 'plan';//计划
const tableId8 = 'prod';//生产信息

const pageId = '10140MPFA_approve';//页面id
const appcode = '10140MPF';//注册按钮的id


let urls={
    queryCardDataUrl:'/nccloud/uapbd/materialpf/queryMaterialpfCardData.do',
};

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId1 = formId1;
        this.formId2 = formId2;
        this.tableId1 = tableId1;
        this.tableId2 = tableId2;
        this.tableId3 = tableId3;
        this.tableId4 = tableId4;
        this.tableId5 = tableId5;
        this.tableId6 = tableId6;
        this.tableId7 = tableId7;
        this.tableId8 = tableId8;
        this.pageId = pageId;
        this.appcode = appcode;
        this.state = {
            formConfig:null,
            stated:'browse',
            showBaseInfo : true,
            json:{},
            inlt:null,
            materialpfpk:null,
            showUploader:false,
        };
        this.initTemplate(this.props, () => {
            let id = this.props.getUrlParam("id");
            this.getData(id)
        });
    }

    initTemplate = (props,callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId,
            },
            {
                moduleId: "10140MPF",domainName: 'uapbd'
            },
            (data, langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                        this.state.inlt = inlt
                    }
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        //this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback&&callback()
                }
            }
        )
    }


    modifierMeta = (props, meta) => {
        let status = 'browse';
        console.log(meta)
        meta[formId1].status = status;
        meta[formId2].status = status;
        meta[tableId1].status = status;
        meta[tableId2].status = status;
        meta[tableId3].status = status;
        meta[tableId4].status = status;
        meta[tableId5].status = status;
        meta[tableId6].status = status;
        meta[tableId7].status = status;
        meta[tableId8].status = status;

        return meta;
    }

    componentDidMount() {

    }

    //按钮事件
    buttonClick(props, id) {
        switch (id) {
            case 'refresh':
                this.getData(props.getUrlParam("id"),()=>{
                    toast({title:this.state.json['10140MPF-000013'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'attachment':
                this.setState({
                    materialpfpk:this.props.form.getFormItemsValue(this.formId1,'pk_material_pf').value,
                    showUploader: true,
                })
                break;
            default:
                break
        }
    }

    //查询数据
    getData =(id,callback) =>{
        //查询单据详情
        if(this.props.getUrlParam("ismaterial")){
            this.props.button.setButtonVisible(['refresh','attachment','back'], false);
        }
        let data = { pk: id, pageid: this.pageId };
        let that = this;
        ajax({
            url: urls.queryCardDataUrl,
            data: data,
            success: (res) => {
                if (res.data) {
                    debugger
                    if(res.data["form2"]){
                        this.props.form.setAllFormValue({ [this.formId1]: res.data["form2"][this.formId1]});
                        this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']})
                    }
                    if(res.data["billCard"]){
                        if(res.data["billCard"].head){
                            this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                        }
                        if(res.data["billCard"].bodys){
                            this.props.cardTable.setTableData(that.tableId1, res.data["billCard"].bodys[that.tableId1]);
                            this.props.cardTable.setTableData(that.tableId2, res.data["billCard"].bodys[that.tableId2]);
                            this.props.cardTable.setTableData(that.tableId3, res.data["billCard"].bodys[that.tableId3]);
                            this.props.cardTable.setTableData(that.tableId4, res.data["billCard"].bodys[that.tableId4]);
                            this.props.cardTable.setTableData(that.tableId5, res.data["billCard"].bodys[that.tableId5]);
                            this.props.cardTable.setTableData(that.tableId6, res.data["billCard"].bodys[that.tableId6]);
                            this.props.cardTable.setTableData(that.tableId7, res.data["billCard"].bodys[that.tableId7]);
                            this.props.cardTable.setTableData(that.tableId8, res.data["billCard"].bodys[that.tableId8]);
                        }
                    }
                } else {
                    this.props.form.EmptyAllFormValue(this.formId1);
                    this.props.form.EmptyAllFormValue(this.formId2);
                    this.props.cardTable.setTableData(this.tableId1, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId2, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId3, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId4, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId5, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId6, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId7, { rows: [] });
                    this.props.cardTable.setTableData(this.tableId8, { rows: [] });
                }
                callback&&callback();
            }
        });
    }

    getTableHead = (buttons, tableId) => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-form-area'
                    })}
                </div>
            </div>
        );
    };

    //子表双击事件
    onRowDoubleClick=(moduleid,props, record, index)=>{
        let tableid = null;
        let title= null;
        switch(moduleid){
            case this.tableId2:
                title =this.state.json['10140MPF-000000'];/* 国际化处理： 财务信息*/
                break;
            case this.tableId3:
                tableid = 'materialpfcsub';
                title =this.state.json['10140MPF-000001'];/* 国际化处理： 利润中心信息*/
                break;
            case this.tableId4:
                title =this.state.json['10140MPF-000002'];/* 国际化处理： 采购信息*/
                break;
            case this.tableId5:
                tableid = 'materialbindle';
                title =this.state.json['10140MPF-000003'];/* 国际化处理： 销售信息*/
                break;
            case this.tableId6:
                tableid = 'materialwarh';
                title =this.state.json['10140MPF-000004'];/* 国际化处理： 库存信息*/
                break;
            case this.tableId7:
                tableid = 'materialrepl';
                title =this.state.json['10140MPF-000005'];/* 国际化处理： 计划信息*/
                break;
            case this.tableId8:
                title =this.state.json['10140MPF-000006'];/* 国际化处理： 生产信息*/
                break;
        }
        let formConfig ={
            pk:this.props.getUrlParam("id"),
            moduleId:moduleid,
            formId:moduleid,
            tableId:tableid,
            state:"browse",
            nomatpf:true
        }
        this.props.modal.show("source",{
            title:title,
            content:<Materialpftabs config={formConfig} />,
            userControl:true,//自己控制什么时候关闭窗口
            beSureBtnClick:this.onSaveSys.bind(this)
        });
    }

    onHideUploader(){
        this.setState({
            showUploader: false,
        })
    }



    beforeDelete(billId, fullPath, file) {
        if(billId.creater == businessInfo.userId){
            return true
        }
        else {
            toast({color:'warning',content:this.state.json['10140MPF-000047']})/* 国际化处理： 当前用户没有删除该附件的权限*/
            return false
        }
    }

    onSaveSys(){}

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table,BillHeadInfo} = this.props;
        let buttons = this.props.button.getButtons();
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createModal } = modal;
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

        return (
            <div className="nc-bill-extCard">
                <NCAffix>
                    <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                        {/*{createPageIcon()}*/}
                        {/* {<h2 className='title-search-detail'>{this.state.json['10140MPF-000007'] 国际化处理： 物料申请单}</h2>} */}
                        { <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title : this.state.json['10140MPF-000007']/* 国际化处理： 物料申请单*/
                            })}
                        </div> }
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 3,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <NCAnchor>
                    <NCScrollLink
                        to='head'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-100}
                    >
                        <p>{this.state.json['10140MPF-000007']/* 国际化处理： 物料申请单*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='material'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-100}
                    >
                        <p>{this.state.json['10140MPF-000008']/* 国际化处理： 物料信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='materialconvert'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-100}
                    >
                        <p>{this.state.json['10140MPF-000009']/* 国际化处理： 计量信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='fi'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000000']/* 国际化处理： 财务信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='pfc'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000001']/* 国际化处理： 利润中心信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='pu'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000002']/* 国际化处理： 采购信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='sale'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000003']/* 国际化处理： 销售信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='stock'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000004']/* 国际化处理： 库存信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='plan'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000005']/* 国际化处理： 计划信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink
                        to='prod'
                        spy={true}
                        smooth={true}
                        duration={300}
                        offset={-50}
                    >
                        <p>{this.state.json['10140MPF-000006']/* 国际化处理： 生产信息*/}</p>
                    </NCScrollLink>
                </NCAnchor>
                <NCScrollElement name='head'>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId1, {
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='material'>
                    <div className="nc-bill-form-area">
                        <div className='group-form-wrapper'>
                            <NCDiv fieldid="materialbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                <span
                                    className={`toggle-form-icon iconfont ${iconItem}`}
                                    onClick={() => {
                                        let show = !this.state.showBaseInfo
                                        this.setState({
                                            showBaseInfo: show
                                        });
                                    }}
                                />
                                <span className="name">{this.state.json['10140MPF-000008']/* 国际化处理： 物料信息*/}</span>
                            </NCDiv>
                            <div className={`group-form-item ${groupItem} `}>
                                {createForm(this.formId2, {
                                // onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                        </div>
                    </div>
                </NCScrollElement>
                <NCScrollElement name='materialconvert'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId1, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId1),
                            modelSave: this.saveBill,
                            //onAfterEvent: this.afterEvent.bind(this),
                            showCheck: true,
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='fi'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId2, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId2),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId2),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='pfc'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId3, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId3),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId3),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='pu'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId4, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId4),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId4),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='sale'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId5, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId5),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId5),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='stock'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId6, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId6),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId6),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='plan'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId7, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId7),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId7),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>
                <NCScrollElement name='prod'>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId8, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId8),
                            modelSave: this.saveBill,
                            onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId8),
                            showIndex: true
                        })}
                    </div>
                </NCScrollElement>

                { createModal("source",{
                    title:'null',
                    content:<Materialpftabs config={this.state.formConfig} />,
                    userControl:true,//自己控制什么时候关闭窗口
                    noFooter : true,
                    beSureBtnClick:this.onSaveSys.bind(this)
                }) }
                {this.state.showUploader&&<NCUploader
                    billId={'uapbd/6b2c8309-930b-4989-8b0e-f2a80f35c62c/'+this.state.materialpfpk}
                    //billNo={'001'}
                    //target={target}
                    placement={'bottom_right'}
                    multiple={true}
                    onHide={this.onHideUploader.bind(this)}
                    //beforeUpload={this.beforeUpload.bind(this)}
                    beforeDelete={this.beforeDelete.bind(this)}
                />}

            </div>
        );
    }
}

Card = createPage({
    mutiLangCode: '3630'
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
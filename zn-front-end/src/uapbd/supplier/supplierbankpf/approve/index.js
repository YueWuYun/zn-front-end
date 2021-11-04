//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, {Component} from 'react';
import {ajax, base, cardCache, createPage, getBusinessInfo, high, print, promptBox, toast,createPageIcon} from 'nc-lightapp-front';
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from "../../../public/utils";
import {imageScan, imageView} from "sscrp/rppub/components/image";
const {showFormular } = Utils;
const {NCDiv} = base;

let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById ,setDefData, getDefData} = cardCache;
let { NCAnchor, NCScrollLink, NCScrollElement, NCAffix ,NCBackBtn } = base;
const { NCUploader,PrintOutput, ApproveDetail } = high;

const formId1 = 'supplierbankpf';
const formId2 = 'supplierbank';
const tableId = 'bankaccsub';
const dataSource = 'uapbd.supplier.supplierbankpf.dataSource'
const pk_item = 'pk_supplierbankpf';

const linkpagecode='10140SBAPFA_approve';

const pageId = '10140SBAPFA_approve';//页面id
const appcode = '10140SBAPFA';//注册按钮的id


let urls={
    queryCardDataUrl:'/nccloud/uapbd/supplierbankpf/querypfCardData.do',
    queryDefaultDataUrl:'/nccloud/uapbd/supplierbankpf/querypfDefaultData.do',
    afterEventUrl:'/nccloud/uapbd/supplierbankpf/supbkpfafterEvent.do',
    saveUrl:'/nccloud/uapbd/supplierbankpf/supbkpfInsertData.do',
    updateUrl:'/nccloud/uapbd/supplierbankpf/supbkpfSaveData.do',
    deleteUrl:'/nccloud/uapbd/supplierbankpf/supbkpfDeleteData.do',
    commiturl:'/nccloud/uapbd/supplierbankpf/supbkpfCommitData.do',
    recallurl:'/nccloud/uapbd/supplierbankpf/supbkpfRecallData.do',
    printurl:'/nccloud/uapbd/supplierbankpf/supbkpfPrintData.do',
    cancelurl:'/nccloud/uapbd/supplierbankpf/supbkpfCancel.do',
    validateSupplierBankpfurl:'/nccloud/uapbd/supplierbankpf/supbkpfValiData.do',
};

let tableBtnAry =(props)=>{
    return props.cardTable.getStatus(tableId)==='browse'?['']:["delline"];;
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId1 = formId1;
        this.formId2 = formId2;
        this.tableId = tableId;
        this.pageId = pageId;
        this.appcode = appcode;
        this.state = {
            stated:'browse',
            pks:[],
            supplierbankpfpk:null,
            compositedata: null,
            compositedisplay: false,
            showBaseInfo: true,
            json:{},
            inlt:null,
            sysParam:null,
            memo:null,
            isPrecode:true,
            hasApproveflowDef:true,
            showApprInfo:false
        };
        this.initTemplate(this.props, () => {
            let status = this.props.getUrlParam("status");
            let id = this.props.getUrlParam("id");
            let isPortal = this.props.getUrlParam('portal')
            if(isPortal) {
                this.props.button.setButtonVisible(['ApprInfo'], true)
            }
            else {
                this.props.button.setButtonVisible(['ApprInfo'], false)
            }
            if(status=="add"){
                this.setDefaultValue(status);
            }else{
                this.getData(status,id)
            }
        });
    }

    initTemplate = (props, callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId
            },
            {
                moduleId: "10140SBAPF",domainName: 'uapbd'
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
                        this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    if(data.context){
                        if(data.context.pk_org&&data.context.org_Name){
                            setDefData("pk_org",dataSource,data.context.pk_org);
                        }
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta = (props, meta) => {
        let status = 'browse';

        let porCol1 = {
            attrcode: 'opr',
            label: this.state.json['10140SBAPF-000002'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index)=> {

                const btnArray = tableBtnAry(props);

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table_opr_area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId, text, record, index)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol1);
        return meta;
    }

    tableButtonClick = (props, id, tableId,text, record, index)=>{

        switch(id){

            default:
                break;
        }
    }

    closeApprove = () =>{
        this.setState({
            showApprInfo: false
        })
    }


    //按钮事件
    buttonClick(props, id) {
        let billdata = null;
        switch (id) {
            case 'refresh':
                this.getData("browse",props.getUrlParam("id"),true,()=>{
                    toast({title:this.state.json['10140SBAPF-000004'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'ApprInfo':
                //打开审批详情页
                this.setState({
                    billId: this.props.form.getFormItemsValue(this.formId1,'pk_supplierbankpf').value,
                    showApprInfo: true
                })
                break;
            case 'ImgView':
                billdata =  this.props.form.getAllFormValue(this.formId1);
                let billInfoMap = {}
                billInfoMap.pk_billid = this.props.getUrlParam('id');
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_tradetype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_org = billdata.rows[0].values['pk_org'].value;
                imageView(billInfoMap, 'iweb');
                break;
            case 'ImgScan':
                billdata = this.props.form.getAllFormValue(this.formId1);
                billInfoMap = {}
                billInfoMap.pk_billid = this.props.getUrlParam('id');
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_tradetype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_org = billdata.rows[0].values['pk_org'].value;

                billInfoMap.BillType = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.BillDate = billdata.rows[0].values['creationtime'].value;
                billInfoMap.Busi_Serial_No = billdata.rows[0].values['pk_supplierbankpf'].value;
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.OrgNo = billdata.rows[0].values['pk_org'].value;
                billInfoMap.BillCode = billdata.rows[0].values['billno'].value;
                billInfoMap.OrgName = billdata.rows[0].values['pk_org'].display;
                billInfoMap.Cash = '0';
                imageScan(billInfoMap, 'iweb');
                break
            default:
                break
        }



    }

    //查询数据
    getData =(status,id,flag,callback) =>{
        //查询单据详情
        let cardData = getCacheById(id, dataSource);
        let that = this;
        if(cardData&&!flag){
            if(cardData["form1"]){
                this.props.form.setAllFormValue({ [this.formId1]: cardData["form1"][this.formId1]});
                this.props.form.setFormItemsDisabled(this.formId1,{'billno':!cardData['isCodeEdit']})
                this.state.hasApproveflowDef = cardData['hasApproveflowDef'];
            }
            if(cardData["billCard"]){
                if(cardData["billCard"].head){
                    this.props.form.setAllFormValue({ [this.formId2]: cardData["billCard"].head[this.formId2]});
                }
                if(cardData["billCard"].body){
                    this.props.cardTable.setTableData(that.tableId, cardData["billCard"].body[that.tableId]);
                }
            }
            callback&&callback();
        }else{
            let data = { pk: id, pageid: this.pageId };
            ajax({
                url: urls.queryCardDataUrl,
                data: data,
                success: (res) => {
                    showFormular(this.props,res,{
                        [formId1] : "form",
                        [formId2] : "form",
                        [tableId] : 'cardTable',
                    });
                    if (res.data) {
                        this.state.sysParam = res.data['sysParam'];
                        if(res.data["form1"]){
                            this.props.form.setAllFormValue({ [this.formId1]: res.data["form1"][this.formId1]});
                            this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']});
                            this.state.isPrecode = res.data['isPrecode'];
                            this.state.hasApproveflowDef = res.data['hasApproveflowDef'];
                            res.data['head']=res.data["form1"];
                        }
                        if(res.data["billCard"]){
                            if(res.data["billCard"].head){
                                this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                            }
                            if(res.data["billCard"].body){
                                this.props.cardTable.setTableData(that.tableId, res.data["billCard"].body[that.tableId]);
                            }
                        }
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId1);
                        this.props.form.EmptyAllFormValue(this.formId2);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                    updateCache(pk_item,id,res.data,this.formId1,dataSource);
                    callback&&callback();
                }
            });
        }
    }

    //获取列表肩部信息
     getTableHead = (tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="">
                    {createButtonApp({
                        area: 'table_header_area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.table_header_area')

                    })}
                </div>
            </div>
        );
    };

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table,BillHeadInfo} = this.props;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let {createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;
        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"
        return (
            <div className="nc-bill-extCard">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                            <div className="header-title-search-area">
                                {/* {createPageIcon()} */}
                                {/* <h2 className='title-search-detail'>{this.state.json['10140SBAPF-000008']/* 国际化处理： 供应商银行账号申请单}</h2> */}
                                {createBillHeadInfo({
                                    title : this.state.json['10140SBAPF-000008'],
                                    initShowBackBtn:false
                                })}
                                </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header_button_area',
                                    buttonLimit: 3,
                                    onButtonClick: this.buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <NCScrollElement name='head'>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId1, {
                                //onAfterEvent: this.afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>

                    <div className="nc-bill-form-area">
                        <div className='group-form-wrapper'>
                            <NCDiv fieldid="supplierbankinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                <span
                                    className={`toggle-form-icon iconfont ${iconItem}`}
                                    onClick={() => {
                                        let show = !this.state.showBaseInfo
                                        this.setState({
                                            showBaseInfo: show
                                        });
                                    }}
                                />
                                <span className="name">{this.state.json['10140SBAPF-000015']/* 国际化处理： 供应商银行账号信息*/}</span>
                            </NCDiv>
                            <div className={`group-form-item ${groupItem} `}>
                                {createForm(this.formId2, {
                                    //onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId, {
                            tableHead: this.getTableHead.bind(this, this.tableId),
                            modelSave: this.saveBill,
                            //onAfterEvent: this.tableafterEvent.bind(this),
                            showCheck: true,
                            showIndex: true
                        })}
                    </div>
                </div>

                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprove.bind(this)}
                    billtype='10GZ'
                    billid={this.state.billId}
                />

            </div>
        );
    }
}

Card = createPage({

})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
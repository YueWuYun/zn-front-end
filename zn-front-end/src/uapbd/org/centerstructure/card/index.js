//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base ,ajax, toast} from 'nc-lightapp-front';
let {NCCol, NCRow, NCModal, NCButton, NCCheckbox, NCDatePicker} = base;
import { initTemplate } from './events/initTemplate';
import { buttonClick } from './events/buttonClick';
import { beforeEvent } from './events/beforeEvent';
import { beforeTableEvent } from './events/beforeTableEvent';
import {transferModalRefChange} from './events/transferModalRefChange'
import { afterEvent } from './events/afterEvent';
import { afterTableEvent } from './events/afterTableEvent';
import { bodySelectedEvent, bodySelectedAllEvent } from './events/bodySelectedEvent';
import {MULTILANG, CARD, PRIMARTKEY, CARD_BUTTON, DATASOURCE, REQUESTURL, LIST,APPCODEN,CFSREQUESTURL} from '../constant';
import { pageClick, cardCreate, getCardData } from './events/cardOperator';
import { bodyButtonClick } from './events/bodyButtonClick';
import Transfer from '../../../public/excomponents/Transfer';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import AccPeriodDefaultTreeGridRef from "../../../refer/pubinfo/AccPeriodDefaultTreeGridRef";
/**
 * @description: 卡片
 */
const { NCAffix,NCDiv  } = base;

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transferdisplay:false,
            json: {},
        };
        this.appcode = props.getSearchParam('c') ;
        this.listPagecode = props.getSearchParam('p');
        this.updateConfigInfo();
        
        this.version;
        if(props.getUrlParam('version')){
            this.version=props.getUrlParam('version');
        }
        this.requestParam={ type:"tree" };
        if(props.getUrlParam('id')){
            this.requestParam.pk=props.getUrlParam('id');
        }
    }
    //处理树结构数据
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.beforeName=node.code?(node.code+'  '):'';
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    updateConfigInfo(){
        this.URLINFO = {};//请求路径
        this.root ={}; //卡片左树根节点
        switch(this.appcode){
            case APPCODEN.CCAppcode :
                this.URLINFO = REQUESTURL ;
                this.root = {
                    "isleaf": false,
                    "key":"~",
                    "title":"成本中心结构",/* 国际化处理： 成本中心*/
                    "id":"~",
                    "innercode":"~",
                    "pid": "",
                    "refname": "成本中心结构",/* 国际化处理： 成本中心*/
                    "refpk": "~"
                };
                break ;
            case APPCODEN.CFAPPCODE :
                this.URLINFO = CFSREQUESTURL ;
                this.root = {
                    "isleaf": false,
                    "key": "~",
                    "title": '要素结构',
                    "id": "~",
                    "innercode": "~",
                    "pid": "",
                    "refname": '要素结构',
                    "refpk": "~",
                    "nodeData": { isLeaf: false },//增加一个属性用来标识是否时叶子节点；
                }; 
                break ; 
        }
    }
    loadTree(requestParam,selectTreeNode){
        ajax({
            url:REQUESTURL.queryCard,
            data:requestParam,//{pkorg:this.state.curOrg.pk_org},
            success:(result)=>{
                if(result.success){
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData("costCenterTree" , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk("costCenterTree", this.root.refpk);
                    this.props.syncTree.setNodeSelected("costCenterTree",this.root.refpk);
                }
            }
        });
    };
    componentWillMount() {
        // json： 多语json格式参数；
        // status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作；
        // inlt： 可用来进行占位符的一些操作
        let callback = (json, status, inlt) => {
            if (status) {
                initTemplate(this,this.props, json); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.props.getUrlParam("version");//获得成本要素结构的版本信息
                console.log("信息加载：",this.props.getUrlParam("version"));
                this.loadTree(this.requestParam,null);
                // 保存json和inlt到页面state中并刷新页面
                this.setState({ json, inlt })
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: MULTILANG.moduleId, domainName: MULTILANG.domainName, callback });

        // 关闭浏览器
        window.onbeforeunload = () => {
            let status = this.props.cardTable.getStatus(CARD.table_code);
            if (status == 'edit') {
                return this.state.json['10100CCS-000007'];/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
            }
        };
    }

    onSelectTree(refpk,prompt){
        if(refpk=="~"){
            return;
        }
        this.props.setUrlParam({
            status: 'browse'
        });
        getCardData(this.props, refpk);
    }
    onEditEps(refpk,prompt){
        if(refpk.refpk=="~"){
            return;
        }
        this.props.setUrlParam({
            status: 'edit'
        });
        getCardData(this.props, refpk.refpk);
    }
    onAddEps(refpk,prompt){
        this.props.setUrlParam({
            status: 'add'
        });
        cardCreate(this.props);
    }
    onDeleteEps(refpk,prompt){
        if(refpk.hasOwnProperty('children') && refpk.children.length>0){
            toast({content: '该节点包含子节点，不允许删除！', color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
            return;
        }
        ajax({
            url: REQUESTURL.delete,
            data: { pks: [requestParam.pk,refpk.refpk] },
            success: (res) => {
                if (res.success) { //成功
                    toast({ color: 'success', content: props.json['10100CCS-000005'] });/* 国际化处理： 删除成功*/
                } else { //失败
                    toast({ color: 'warning', content: props.json['10100CCS-000009'] });/* 国际化处理： 删除失败*/
                }
            }
        });
    }
    componentDidMount() {
        let status = this.props.getUrlParam('status');
        let id = this.requestParam.pk;
        if (status === 'add') { //新增
            cardCreate(this.props);
        } else if (id) {
            getCardData(this.props, id);
        }
    }

    onButtonClick = (props, id, hotkey) => {
        buttonClick({ ...props, json: this.state.json }, id, hotkey);
    }

    handlePageInfoChange = (props, id) => {
        pageClick({ ...props, json: this.state.json }, id);
    }

    //获取列表肩部信息
    getTableHead = () => (
        <div className="shoulder-definition-area">
            <div className="definition-icons">
                {this.props.button.createButtonApp({
                    area: CARD.shoulder_btn_code,
                    onButtonClick: bodyButtonClick,
                    popContainer: document.querySelector('.header-button-area')
                })}
            </div>
        </div>
    );
    //穿梭框的确定事件处理
    tranferModalBtnSure = () =>{

    }
    transferModal = () =>{
        return (
            <div>
                <NCRow style={{margin: 10, display: 'flex', alignItems: 'center'}}>
                    <NCCol md={4} xs={4} sm={4}>
                        <span>
                            <div fieldid='accperiod'  style={{display: 'flex'}}>
                                <div style={{display: 'flex', alignItems: 'center', width: '38%'}}>
                                    <span style={{color: 'red'}} className="required-star">*</span>
                                    <span className='accperiod_name'>业务单元 </span>{/*"会计期间"this.state.json['38200205-000003']*/}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <BusinessUnitTreeRef
                                        fieldid='period'
                                        // {...this.state.modalState.accPeriodParam}
                                        onChange={transferModalRefChange.bind(this)}
                                        queryCondition={{
                                            // pk_accperiodscheme: this.accperiodParam,
                                            isDataPowerEnable: 'Y',
                                            DataPowerOperationCode: 'fi'
                                        }} 
                                    />
                                </div>
                            </div>
                        </span> 
                    </NCCol>
                    <NCCol md={4} xs={4} sm={4}>
                        <NCCheckbox colors="info"
                                    // disabled={this.state.style.accPeriod.disabled}
                                    // onChange={checkChange.bind(this)}
                                    // checked={this.state.modalState.checked}
                        >
                            是否显示停用
                        </NCCheckbox>
                    </NCCol>
                </NCRow>
                <div className="liabilityBook"  style={{display: this.state.transferdisplay}}>
                    <div style={{margin: 20}}>
                        <Transfer
                            ref={(item) => {
                                this.orgTransfer = item
                            }}
                            showSearch={true}
                        />
                    </div>
                </div>
            </div>
        )
    }




    render() {
        let { form, cardPagination,DragWidthCom,syncTree, BillHeadInfo, cardTable,title ,modal} = this.props;
        const {createSyncTree}=syncTree;
        let { createCardPagination } = cardPagination;
        let { createForm } = form;
        let { createModal } = modal;
        let { createCardTable } = cardTable;
        let { createBillHeadInfo } = BillHeadInfo;
        let status = this.props.getUrlParam('status');
        let id = this.requestParam.pk;
        let billNo = this.props.form.getFormItemsValue(CARD.page_code, PRIMARTKEY.bill_no);
        let leftDom = <div className="tree-area" fieldid='costCenterTree_tree'>
                        {createSyncTree({
                            treeId:"costCenterTree",
                            // needEdit: (this.state.curOrg.pk_org&&this.state.curOrg.pk_org.length>0)?true:false, //根据是否选择了主组织判断是否启用编辑
                            showLine: false, //显示连线
                            disabledSearch:this.state.status=='browse'?false:true, //是否禁用搜索框
                            onSelectEve: this.onSelectTree.bind(this),//选择
                            clickEditIconEve: this.onEditEps.bind(this), //编辑点击 回调
                            clickAddIconEve: this.onAddEps.bind(this), //新增点击 回调
                            clickDelIconEve: this.onDeleteEps.bind(this), // 删除点击 回调
                            showModal:false
                        })}
                    </div>
        
		let rightDom = <div className="card-area card-right">
                            <div className="nc-bill-form-area">
                            {createForm(CARD.form_id, {
                                onAfterEvent: afterEvent,
                                onBeforeEvent: beforeEvent,
                                setVisibleByForm: true,
                            })}
                            </div>
                            <div className="nc-bill-bottom-area">
                                <div className="nc-bill-table-area">
                                    {createCardTable(CARD.table_code, {
                                        tableHead: this.getTableHead.bind(this),
                                        showCheck: true,
                                        showIndex: true,
                                        onSelected: bodySelectedEvent,
                                        onSelectedAll: bodySelectedAllEvent,
                                        onBeforeEvent: beforeTableEvent,
                                        onAfterEvent: afterTableEvent,
                                        modelSave: buttonClick.bind(this, { ...this.props, json: this.state.json }, CARD_BUTTON.save, undefined, true),
                                    })}
                                </div>
                            </div>
                        </div> 
                        
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCDiv areaCode={NCDiv.config.HEADER}>
                        <div className="nc-bill-header-area">
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                        title: title,//标题
                                        billCode: billNo && billNo.value,//单据号
                                        backBtnClick: buttonClick.bind(this, this.props, CARD_BUTTON.back)
                                    })}
                            </div>
                            <div className="header-button-area">
                                {this.props.button.createButtonApp({
                                    area: CARD.head_btn_code,
                                    onButtonClick: this.onButtonClick
                                })}
                            </div>
                            {status == 'browse' && id &&
                            <div className="header-cardPagination-area" style={{ float: 'right' }}>
                                {createCardPagination({
                                    dataSource: DATASOURCE,
                                    pkname: PRIMARTKEY.head_id,
                                    handlePageInfoChange: this.handlePageInfoChange
                                })}
                            </div>
                            }
                        </div>
                    </NCDiv>
                </div>
                <div className="tree-table factor-table">
                    <DragWidthCom
                        leftDom={leftDom}     //左侧区域dom
                        rightDom={rightDom}     //右侧区域dom
                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                {/*引入穿梭框*/}
                {createModal('modal',{
                    noFooter:false,
                    title:'引入成本中心',
                    content:this.transferModal(),
                    beSureBtnClick:this.tranferModalBtnSure.bind(this)
                })}
                </div>
            )
    }
}
Card = createPage({
    billinfo: {
        billtype: 'card',
        pagecode: CARD.page_code,
        headcode: CARD.form_id,
        bodycode: CARD.table_code
    }
})(Card);
export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
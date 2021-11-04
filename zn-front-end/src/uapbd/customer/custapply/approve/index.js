//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high,print} from 'nc-lightapp-front';
// const { BillApprove } = high
const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink,NCDiv} = base;
const {PrintOutput,NCUploader} = high;

const formId = 'customerpf';                      //表头id
const tableId = 'bankaccsub';                  //子表id
const pageId = '10140CUSTPF_custpfcard';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='10140CUSTPF';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/customer/CustApplyCardQuery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/customer/CustApplySave.do';             //新增保存
const updateUrl = '/nccloud/uapbd/customer/CustApplyUpdate.do';         //修改保存
const addUrl = '/nccloud/uapbd/customer/CustApplyAdd.do';				//新增
const enableUrl = '/nccloud/uapbd/supbanken/enableSupbankenCard.do' //启用
const commitUrl = '/nccloud/uapbd/customer/CustApplyCommit.do' //提交
const callbackUrl = '/nccloud/uapbd/customer/CustApplyCallback.do' //收回
const approveUrl = '/nccloud/uapbd/supplierapply/approveSupplierApply.do' //审批
const unApproveUrl = '/nccloud/uapbd/supplierapply/unapproveSupplierApply.do' //取消审批
const queryLinkmanUrl = '/nccloud/uapbd/customer/CustApplyQueryLinkman.do' //联系人查询
const saveLinkmanUrl = '/nccloud/uapbd/customer/CustApplySaveLinkman.do'	//联系人保存
const printUrl = '/nccloud/uapbd/customer/CustApplyCardPrint.do';                   //打印url
const pk_item = 'pk_customerpf';             //单据主键--用于卡片查询刷新
const titleCode = 'billnumber';            //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions'
const tableIds = ['custapplybanks','custtaxtypes','custcontacts','finance','sale','creditctl','bankaccsub']

const addEditable = ['supcountrytaxes','suplinkman']
const editEditable = ['purchase','supcountrytaxes','suplinkman','finance']

const cardUrl = '/uapbd/customer/custapply/card/index.html';
const listUrl = '/uapbd/customer/custapply/list/index.html';
const pagecode_list = '10140CUSTPF_custpflist';

const printFunCode='10140CUSTPF';    //有打印模板的小应用编码
const printNodeKey='custpfcard';    //模板节点标识

const md_class_id = '6d6d4a15-d9bb-4b0c-9da3-80760872bf87'; //md_class 客户申请单 主键，传附件用，先写死

function modifierMeta(props, meta) {
    return meta;
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            pk_org : '',
            title_code : '',
            totalcount : 0,
            applycount : 0,
            showBaseInfo : true,
            isList: true,
            showApprove: false,
            json: {}
        }
    }

    initTemplate =(props, callback)=>{
        props.createUIDom(
            {
                pagecode: pageId//,//页面id
                // appid: appId//注册按钮的id
            },
            (data) => {
                if(data){
                    if(data.template){
                        let meta = data.template;
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonVisible(['Refresh','Attment'],true);
                        props.button.setButtonDisabled(['Refresh','Attment'],false);
                    }
                }

                if(callback && typeof callback == 'function') {
                    callback()
                }
            }
        )
    }

    componentDidMount() {
        let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props, () => {
                        let pk = this.props.getUrlParam('id');
                        this.getdata(pk);
                    });
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: '10140CUSTPF', domainName: 'uapbd',callback})
    }

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
            case 'Refresh':
                this.refresh(props);
                break;
            case 'Attment':
                this.Attment();
                break;
            default:
                break
        }
    }

    refresh=(props)=>{
        this.getdata(props.getUrlParam('id'),()=>{
            toast({title:this.state.json['10140CUSTPF-000026'],color:'success'});/* 国际化处理： 刷新成功！*/
        });
    }
    //附件管理
    Attment=()=>{
        this.state.showlogoUploader=true;
        this.setState(this.state);
    }

    //关闭附件窗口
    onHideUploader=()=>{
        this.state.showlogoUploader=false;
        this.setState(this.state);
    }
    //通过单据id查询单据信息
    getdata = (pk,callback) =>{
        let data = {pk};
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                if (res.data.head) {
                    let formData = {
                        [this.formId]: res.data.head[this.formId],
                        "customer": res.data['customer']['customer']
                    }
                    this.props.form.setAllFormValue(formData)
                }
                if (res.data.bodys) {

                    res.data.bodys.forEach((item, index) => {
                        tableIds.forEach((tableId) => {
                            if(item.hasOwnProperty(tableId)) {
                                this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
                            }
                        })
                    })
                }
                if(callback && typeof callback == 'function') {
                    callback()
                }
            }
        });
    }
    render() {
        let { cardTable, form,button,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let status = this.props.getUrlParam('status');
        let { createButtonApp } = button;


        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"
        return (
            <div  id='nc-bill-card'>
                <div className="nc-bill-card">
                    <NCAffix>
                        <NCDiv fieldid= {this.state.json['10140CUSTPF-000001']} areaCode={NCDiv.config.Title} className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                        title: this.state.json['10140CUSTPF-000001'],
                                        initShowBackBtn:false
                                    }
                                )}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    {/*//子表导航树*/}
                    <NCAnchor>
                        <NCScrollLink
                            to={this.formId}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custapplybanks'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000003']/* 国际化处理： 客户银行帐号*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custtaxtypes'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000004']/* 国际化处理： 客户国家税类*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custcontacts'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000005']/* 国际化处理： 客户联系人*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'finance'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000006']/* 国际化处理： 财务信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'sale'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000007']/* 国际化处理： 销售信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'creditctl'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000008']/* 国际化处理： 信用控制信息*/}</p>
                        </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name={this.formId}>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {})}
                        </div>
                    </NCScrollElement>

                    <NCScrollElement name={this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid="custbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                        <span
                                            className={`toggle-form-icon iconfont ${iconItem}`}
                                            onClick={() => {
                                                let show = !this.state.showBaseInfo
                                                this.setState({
                                                    showBaseInfo: show
                                                });
                                            }}
                                        />
                                    <span className="name">{this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm('customer', {})}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custapplybanks'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custapplybanks", {

                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custtaxtypes'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custtaxtypes", {})}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custcontacts'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custcontacts", {})}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'finance'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("finance", {})}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'sale'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("sale", {})}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'creditctl'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("creditctl", {})}
                        </div>
                    </NCScrollElement>
                </div>
                {/*附件管理*/}
                {this.state.showlogoUploader&&<NCUploader
                    // billId={cacheTools.get('pk_org')}
                    billId={'uapbd/6d6d4a15-d9bb-4b0c-9da3-80760872bf87/'+this.props.getUrlParam('id')}
                        //{'upbd/'+cacheTools.get('orgunit_pk_org')}
                    //billNo={'001'}
                    //target={target}
                    placement={'bottom_right'}
                    multiple={false}
                    // beforeUpload={this.beforeUpload}
                    onHide={this.onHideUploader.bind(this)}
                />}
            </div>
        );
    }
}

Card = createPage({
    //initTemplate: initTemplate
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, getMultiLang, getBusinessInfo } from 'nc-lightapp-front';
import {imageScan, imageView} from "sscrp/rppub/components/image";
const { NCUploader,ApproveDetail } = high
const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink,NCDiv } = base;
import '../card/index.less';

const formId = 'supplierPf';                      //表头id
const tableId = 'bankaccsub';                  //子表id
const pageId = '10140SPFA_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z010000000001VX1';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/supplierapply/querySupplierApplyCard.do';   //卡片查询url
const pk_item = 'pk_supplier_pf';             //单据主键--用于卡片查询刷新
const titleCode = 'accname';            //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions'
const tableIds = ['purchase','supbankacc','supcountrytaxes','suplinkman','finance']

const addEditable = ['supcountrytaxes','suplinkman']
const editEditable = ['purchase','supcountrytaxes','suplinkman','finance']

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
			showBaseInfo : false,
			isList: true,
			showApprove: false,
            json: {},
            showUploader: false,
            billId: '',
		}
	}

	initTemplate =(props, callback)=>{
		props.createUIDom(
			{
                pagecode: pageId,//页面id
                appcode: "10140SPFA"
				//appid: appId//注册按钮的id
			}, 
			(data) => {
				if(data){
					if(data.template){
						let meta = data.template;
						props.meta.setMeta(meta);
						if(callback && typeof callback == 'function') {
							callback()
						}
					}

					if(data.button){
						let button = data.button;
						props.button.setButtons(button);
					}
				}   
			}
		)
	}

	componentDidMount() {
		let callback = (json) => {
            this.setState({json}, () => {
				this.initTemplate(this.props, () => {
                    this.businessInfo = getBusinessInfo()
					let pk = this.props.getUrlParam("id")
                    this.getdata(pk);
                    let isPortal = this.props.getUrlParam('portal')
                    let visibleButtons = ['Attach', 'Refresh', 'ImgView', 'ImgScan']
                    let unVisibleButtons = []
                    let scene = this.props.getUrlParam('scene')
                    // 联查场景
                    if(scene == 'zycx' || scene == 'bzcx') {
                        visibleButtons = ['Attach', 'Refresh', 'ImgView', 'ApprDetail']
                        unVisibleButtons = ['ImgScan']
                    }
                    else if(isPortal) {
                        visibleButtons.push('ApprDetail')
                    }
                    else {
                        unVisibleButtons.push('ApprDetail')
                    }
                    this.props.button.setButtonVisible(visibleButtons, true)
                    this.props.button.setButtonVisible(unVisibleButtons, false)
				})
			})
        }
		getMultiLang({moduleId: '10140SPF', domainName: 'uapbd',callback})
	}
    
	afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{}
	
	getTableHead(tableId) {
		let {createButtonApp} = this.props.button
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
				</div>	
			</div>
		)
	}

	//通过单据id查询单据信息
	getdata = (pk) =>{
		let data = {pk};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					let formData = {
						[this.formId]: res.data.head[this.formId],
						"supplier_baseInfo": res.data['supplierBaseInfo']['supplier_baseInfo']
					}
                    this.props.form.setAllFormValue(formData)
                    this.setState({
                        billId: res.data.head[this.formId].rows[0].values[pk_item].value,
                    })
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
			}
		});
    }

    beforeUpload(billId, fullPath, file, fileList) {  
        return true
	}
	
	beforeDelete(billId, fullPath, file) {
		if(billId.creater == this.businessInfo.userId){
            return true
        }         
        else {
            return false
        }
    }
    
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

	buttonClick(props, id) {
		switch (id) {
			case 'ImgView':
			let billdata = this.props.createMasterChildData(pageId, formId, tableIds);
			let openShowbillid = this.props.getUrlParam('id');
			let billInfoMap = {}
			billInfoMap.pk_billid = openShowbillid;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_tradetype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_org = billdata.head.supplierPf.rows[0].values.pk_org.value;
			imageView(billInfoMap, 'iweb');		
			break
		case 'ImgScan':
			billdata = this.props.createMasterChildData(pageId, formId, tableIds);
			openShowbillid = this.props.getUrlParam('id');
			billInfoMap = {}
			billInfoMap.pk_billid = openShowbillid;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_tradetype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_org = billdata.head.supplierPf.rows[0].values.pk_org.value;

			billInfoMap.BillType = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.BillDate = billdata.head.supplierPf.rows[0].values.creationtime.value;
			billInfoMap.Busi_Serial_No = billdata.head.supplierPf.rows[0].values.pk_supplier_pf.value;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.OrgNo = billdata.head.supplierPf.rows[0].values.pk_org.value;
			billInfoMap.BillCode = billdata.head.supplierPf.rows[0].values.vbillno.value;
			billInfoMap.OrgName = billdata.head.supplierPf.rows[0].values.pk_org.display;
			billInfoMap.Cash = '0';
			imageScan(billInfoMap, 'iweb');
            break
        case 'Attach':
			this.setState({
				showUploader: true
			})
			break
        case 'Refresh':
            this.getdata(this.props.getUrlParam('id'),() => {
				toast({content:this.state.json['10140SPF-000025'],color:'success'});/* 国际化处理： 刷新成功*/
			})
            break
        case 'ApprDetail':
			this.setState({
				showApprInfo: true
			})
			break
        default:
            break
		}
    }
    
    closeApprDetail = () =>{
        this.setState({
            showApprInfo: false
        })
	}

	render() {
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
		const {createCardPagination} = cardPagination;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		const {createBillHeadInfo} = BillHeadInfo;
		let status = this.props.getUrlParam('status');

		let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

		let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

		//联系人form
		return (
			<div  className='nc-bill-extCard'>
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
								<div className='header-title-search-area'>
									{createBillHeadInfo({
                                        title : this.state.json['10140SPF-000043'],/* 国际化处理： 供应商申请单*/
                                        initShowBackBtn:false
									})}
								</div>
								<span className="bill-info-code" style={{fontSize: '16px',
								marginLeft: '8px',
								lineHeight: '32px',
								verticalAlign: 'baseline'}}>{(status=='browse' && this.state.title_code) ?`: ${this.state.title_code}`:""}</span>
								<div className="header-button-area">
									{createButtonApp({
										area: 'header-action',//按钮注册中的按钮区域
										//buttonLimit: 5, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
								</div>																		
							</NCDiv>
						</NCAffix>

						<NCAnchor>
							<NCScrollLink
								to={this.formId}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000002']/* 国际化处理： 供应商信息*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'finance'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000003']/* 国际化处理： 财务信息*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'purchase'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000004']/* 国际化处理： 采购信息*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'supbankacc'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000005']/* 国际化处理： 供应商银行账户*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'suplinkman'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000006']/* 国际化处理： 供应商联系人*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'supcountrytaxes'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json['10140SPF-000007']/* 国际化处理： 供应商国家税类*/}</p>
							</NCScrollLink>
						</NCAnchor>
						<NCScrollElement name={this.formId}>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {

								})}
							</div>
						</NCScrollElement>

						<NCScrollElement name={this.state.json['10140SPF-000000']/* 国际化处理： 供应商基本信息*/}>
							<div className="nc-bill-form-area">
								<div className='group-form-wrapper'>
									<NCDiv fieldid="supplierbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
										<span
											className={`toggle-form-icon iconfont ${iconItem}`}
											onClick={() => {
												let show = !this.state.showBaseInfo
												this.setState({
													showBaseInfo: show
												});
											}}
										/>
										<span className="name">{this.state.json['10140SPF-000000']/* 国际化处理： 供应商基本信息*/}</span>
									</NCDiv>
									<div className={`group-form-item ${groupItem} `}>
										{createForm('supplier_baseInfo', {
										})}
									</div>
								</div>
							</div>
						</NCScrollElement>
						<NCScrollElement name={'finance'}>
							<div className="nc-bill-table-area">
								{createCardTable("finance", {
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'purchase'}>
							<div className="nc-bill-table-area">
								{createCardTable("purchase", {
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'supbankacc'}>
							<div className="nc-bill-table-area">
								{createCardTable("supbankacc", {
									
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'suplinkman'}>
							<div className="nc-bill-table-area">
								{createCardTable("suplinkman", {
									tableHead: this.getTableHead.bind(this,'suplinkman'),
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'supcountrytaxes'}>
							<div className="nc-bill-table-area">
								{createCardTable("supcountrytaxes", {
									tableHead: this.getTableHead.bind(this,'supcountrytaxes'),
								})}
							</div>
						</NCScrollElement>
                        {this.state.showUploader && <NCUploader 
                            billId={"uapbd/d6be4596-55a6-4476-9b1d-cb770c03bfdd/" + this.state.billId}
                            billNo={'001'}
                            placement={'bottom'}
                            onHide={this.onHideUploader}
                            beforeUpload={this.beforeUpload.bind(this)}
                            beforeDelete={this.beforeDelete.bind(this)} />
                        }
					</div>
					{/* 审批详情组件 */}
					<ApproveDetail
						show={this.state.showApprInfo}
						close={this.closeApprDetail.bind(this)}
						billtype='10GY'
						billid={this.state.billId}
					/>
			</div>
			
		);
	}
}

Card = createPage({
	//initTemplate: initTemplate
})(Card);

//export default Card
ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
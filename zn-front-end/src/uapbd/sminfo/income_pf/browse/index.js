//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, getMultiLang, getBusinessInfo } from 'nc-lightapp-front';
const { NCUploader,ApproveDetail, PrintOutput } = high
import {imageView} from "sscrp/rppub/components/image";
const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink,NCDiv } = base;
const formId = 'sminfoPf';                      //表头id
const tableId = ' ';                  //子表id
const pageId = '10140VINCPFA_card';            //pagecode
const searchId = 'search';                  //查询区id
const queryCardUrl = '/nccloud/uapbd/incomeapply/queryIncomeApplyCard.do';   //卡片查询url
const pk_item = 'pk_income_pf';             //单据主键--用于卡片查询刷新
const printUrl = '/nccloud/uapbd/incomeapply/printIncomeApply.do'
const tableIds = ['incomech']

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
            pks: []
		}
    }
    initTemplate =(props, callback)=>{
		props.createUIDom(
			{
                pagecode: pageId//页面id
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
                    if(isPortal) {
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
		getMultiLang({moduleId: '10140INCPF', domainName: 'uapbd',callback})
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
						"income_baseInfo": res.data['incomeBaseInfo']['income_baseInfo']
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
			// billInfoMap.pk_tradetype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_org = billdata.head.supplierPf.rows[0].values.pk_org.value;
			imageView(billInfoMap, 'iweb');		
			break
        case 'Attach':
			this.setState({
				showUploader: true
			})
			break
        case 'Refresh':
            this.getdata(this.props.getUrlParam('id'),() => {
				toast({content:this.state.json['10140INCPF-000025'],color:'success'});/* 国际化处理： 刷新成功*/
			})
            break
        case 'ApprDetail':
			this.setState({
				showApprInfo: true
			})
            break
        case 'Print':
			this.output('print')
			break;
		case 'Output':
			let pks = [];
			pks.push(this.props.getUrlParam('id'))
			this.setState({
				pks
			},() => {
				this.refs.printOutput.open()
			})
			break;
        default:
            break
		}
    }

    output(type=''){
        let pks = [];
		pks.push(this.props.getUrlParam('id'))
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140INCPFA',     //功能节点编码
                    nodekey:'suppfcard',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
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
        return (
            <div className='nc-bill-extCard'>
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title: this.state.json['10140INCPF-000043'],/* 国际化处理： 收款协议申请单*/
                                    initShowBackBtn: false
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
								<p>{this.state.json ? this.state.json['10140INCPF-000002'] : '10140INCPF-000002'/* 国际化处理： 收款协议信息*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'incomech'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json ? this.state.json['10140INCPF-000005'] : '10140INCPF-000005'/* 国际化处理： 账期*/}</p>
							</NCScrollLink>
                            </NCAnchor>

							<NCScrollElement name={this.formId}>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {

								})}
							</div>
						</NCScrollElement>

						<NCScrollElement name={this.state.json['10140INCPF-000000']/* 国际化处理： 收款协议基本信息*/}>
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
										<span className="name">{this.state.json['10140INCPF-000000']/* 国际化处理： 收款协议基本信息*/}</span>
									</NCDiv>
									<div className={`group-form-item ${groupItem} `}>
										{createForm('income_baseInfo', {
										})}
									</div>
								</div>
							</div>
						</NCScrollElement>
						<NCScrollElement name={'incomech'}>
							<div className="nc-bill-table-area">
								{createCardTable("incomech", {
									tableHead: this.getTableHead.bind(this,'incomech'),
								})}
							</div>
						</NCScrollElement>
                        {this.state.showUploader && <NCUploader 
                            billId={"uapbd/713b9a16-add6-4b4f-87e9-e41e493aa865/" + this.state.billId}
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
						billtype='10SX'
						billid={this.state.billId}
					/>

                    <PrintOutput
						ref='printOutput'
						url={printUrl}
						data={{
							funcode: '10140INCPFA',
							oids: this.state.pks,
							nodekey: 'incomecard',
							outputType: 'output'
						}}
					/>
            </div>
        )
    }

}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
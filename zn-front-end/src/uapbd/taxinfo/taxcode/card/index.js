//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, print, promptBox, cardCache, createPageIcon} from 'nc-lightapp-front';
const { PrintOutput } = high;
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
import Util from '../util.js';
import Utils from '../../../public/utils';
import { setTimeout } from 'timers';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import './index.less';
const { NCDiv } = base;
const { getDefData, setDefData, getCurrentLastId, addCache, updateCache, getNextId, deleteCacheById } = cardCache;
const dataSource = 'uapbd.taxinfo.taxcode.dataSource';
const formId = 'head';                      //表头id
const tableId = 'taxrate';                  //子表id
const pageId = '10140VATCR_taxcode_card';   //pagecode
const listpageId = '10140VATCR_taxcode_list';   //pagecode
const appcode  ='10140VATCR';        //按钮注册id
const taxrateformId = 'editTaxRate';//调整税率formid
const pk_item = 'pk_taxcode';               //单据主键--用于卡片查询刷新
const titleCode = 'code';                   //单据编码--用于卡片表头显示
let taxtypeOptions = [{"display": "应税内含","value": "0"},{"display": "应税外加","value": "1"}];

let urls={
	queryCardUrl: "/nccloud/uapbd/taxcode/TaxcodeCardQryAction.do",
    delTaxsUrl:"/nccloud/uapbd/taxcode/TaxcodeDeleteAction.do",
    editTaxrateUrl:"/nccloud/uapbd/taxcode/TaxrateEditAction.do",
	SaveTaxrateUrl:"/nccloud/uapbd/taxcode/TaxcodeTaxrateSaveAction.do",
	SaveTaxcodeUrl:"/nccloud/uapbd/taxcode/TaxcodeSaveAction.do",
    enableTaxUrl:"/nccloud/uapbd/taxcode/TaxcodeEnableAction.do",
    disableTaxUrl:"/nccloud/uapbd/taxcode/TaxcodeDisableNccAction.do",
    print: "/nccloud/uapbd/taxcode/TaxcodeCardPrintAction.do"
};

class TaxcodeCard extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.tableId = tableId;
		let status = this.props.getUrlParam('status');
		let	pk = this.props.getUrlParam('id');
		let selCountry = getDefData("selCountry_10140VATCR", dataSource);

		this.state = {
			selCountry : selCountry, //报税国家
			pagesate : status,
			pk_taxcode: pk,
			title_code : '',
			totalcount : 0,
			applycount : 0,
			lastTaxrate_pk : '',
			addtaxraterows : null, //存放新增时税率信息rows
			pks: [],               //打印ids
			json : {},                      //多语json
			inlt : null
		}

		createUIDom(props)(
			{ pagecode: pageId},  //页面id 
			{ moduleId: appcode,domainName: 'uapbd' },
            (data,langData,inlt) => {
				//多语
				if(langData){
					this.state.json = langData;
					if(inlt){
						this.state.inlt = inlt;
					}
					taxtypeOptions = [{"display": this.state.json['10140VATCR-000000'],"value": "0"},{"display": this.state.json['10140VATCR-000001'],"value": "1"}];					/* 国际化处理： 应税内含,应税外加*/
				}
				if(data){
					if(data.template){
						let meta = this.modifierMeta(props, data.template)
						props.meta.setMeta(meta);
						data.button && props.button.setButtons(data.button);

						if(status==='add' || status==='edit'){
							this.onButtonClick(props, status==='add'?'Add':'Edit');
						}else{
							this.getdata();
						}
					}
				}   
			}
		);
	}

	modifierMeta = (props, meta) => {
		let selCountry = getDefData("selCountry_10140VATCR", dataSource);
		meta[formId].items.map((item) => {
			if (item.attrcode == 'iscusvat') {
				item.visible = (selCountry && selCountry['iseucountry']==='Y') ? true : false;
			}else if(item.attrcode==='suptaxes'){
				item.visible = (selCountry && selCountry['iseucountry']==='Y') ? false : true;
			}else if(item.attrcode==='taxtype'){
				taxtypeOptions = item['options'];
			}
		});
		return meta;
	}

	componentDidMount() {
		//
	}

	componentDidUpdate(){
        let l_formstatus = this.props.form.getFormStatus(this.formId);
		let l_formstatus1 = this.props.form.getFormStatus(taxrateformId);

        if(l_formstatus === 'add' || l_formstatus === "edit"  || (l_formstatus1 && l_formstatus1 === "edit")){
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{
			window.onbeforeunload = null;
		}
    }

	//通过单据id查询单据信息
	getdata = (callback) =>{
		let data = {
			pk : this.state.pk_taxcode,
			selCountryId : this.state.selCountry ? this.state.selCountry['refpk'] : '',
			pagesate : this.state.pagesate
		};
		ajax({
			url: urls['queryCardUrl'],
			data,
			success: (res) => {
				if(res.success){
					this.dealFormulHanhander(res);
					let toggleShowCallback = null;
					if (res.data && res.data['billcard'] && res.data.billcard['head']) {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
	
						let hfdat = res.data.billcard.head[this.formId];
						let dat = Util.setTab_hForTab_b(hfdat,'taxrate',
						[ ['taxtype','taxtype',taxtypeOptions],
						  ['taxrate_b','taxrate'],['realtaxrate','realtaxrate'],['begindate','begindate'],['enddate','enddate']]);

						let title_code = '';
						let addtaxraterows = [];
						if(this.state.pagesate!='add'){
							title_code = hfdat.rows[0].values[titleCode].value;
							//因为子表一定有数据，所以不用判断是否为空
							this.props.cardTable.setTableData(this.tableId, res.data.billcard.body[this.tableId]);
						}else{
							addtaxraterows = res.data.billcard.body[this.tableId]['rows'];

							//新增态时，先设置form状态，过滤空值再赋值，默认值才可生效
							this.props.form.setFormStatus(this.formId, this.state.pagesate);
							Utils.filterEmptyData(hfdat.rows[0].values);
						}
						this.props.form.setAllFormValue({ [this.formId]: hfdat });

						
						let lastTaxrate_pk = res.data['lastTaxrate_pk'];
						this.setState({title_code,lastTaxrate_pk,addtaxraterows});
					}else{
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						toggleShowCallback = () => {
							this.props.button.setButtonVisible(['Edit','Delete','EditTaxRate','Print','Save','SaveAdd','Cancel','Enable','Disable','Refresh'],false);
							this.props.button.setButtonVisible(['Add'],true);
						};
					}
					this.toggleShow(toggleShowCallback);
					
					callback && callback();
				}
			}
		});
	}

	//处理显示公式
	dealFormulHanhander = (res) => {
		//处理显示公式
		if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			this.props.dealFormulamsg(
				res.formulamsg,
				{
					[formId] : 'form',
					[tableId] : 'cardTable'
				}
			);
		}
	}

	//切换页面状态
	toggleShow = (callback) => {
		//按钮的显示状态
		if(this.state.pagesate == 'add'){
			this.props.button.setButtonVisible(['Add','Edit','Delete','EditTaxRate','Print','Enable','Disable','Refresh'],false);
			this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],true);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		}else if(this.state.pagesate == 'edit'){
			this.props.button.setButtonVisible(['Add','Edit','Delete','EditTaxRate','Print','Enable','Disable','Refresh','SaveAdd'],false);
			this.props.button.setButtonVisible(['Save','Cancel'],true);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		}else{
			this.props.button.setButtonVisible(['Add','Edit','Delete','EditTaxRate','Print','Refresh'],true);
			this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],false);
			this.updateButtonState();
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		}

		//新增态form需要出默认值不能放在此处
		if(this.state.pagesate==='edit' || this.state.pagesate==='browse'){
			this.props.form.setFormStatus(this.formId, this.state.pagesate);
		}
		this.props.cardTable.setStatus(this.tableId, this.state.pagesate);

		if(this.state.pagesate==='edit' || this.state.pagesate==='add'){
			let pursaletype = this.props.form.getFormItemsValue(this.formId,['pursaletype'])[0]['value'];
			if(this.state.pagesate==='edit'){
				this.props.form.setFormItemsDisabled(this.formId,{"pursaletype":true});//修改不可编辑 购销类型
			}
			this.pursaletypeChangeEvnt(pursaletype);
		}

		if(this.state.pagesate === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
		}
		
		callback && callback();
	};

    onButtonClick =(props, id)=>{
        let _this = this;
        switch (id) {
          case 'Add':
            props.form.EmptyAllFormValue(this.formId);
            props.cardTable.setTableData(this.tableId, { rows: [] });
			this.setState(
				{pagesate: 'add'},
				() => {
					this.getdata();
				}
			);
            break
          case 'Edit':
            this.setState(
				{pagesate: 'edit'},
				() => {
					this.getdata();
				}
			);
            break;
          case 'Delete':
			promptBox({
				color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140VATCR-000002'],/* 国际化处理： 确认删除*/
				content: this.state.json['10140VATCR-000003'],/* 国际化处理： 确定要删除吗？*/
				beSureBtnClick: () => {
					this.delConfirm();
				}
			});
            break
          case 'back': //'Back':
            props.pushTo('/list', {appcode: appcode,pagecode: listpageId});
            break
          case 'Save':
			this.saveClick(() => {
				this.state.pk_taxcode && this.getdata();
			});
			break
		  case 'SaveAdd':
		    this.saveClick(() => {
				this.onButtonClick(props,'Add');
			});
			break
		  case 'Cancel':
		  	promptBox({
				color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140VATCR-000004'],/* 国际化处理： 确认取消*/
				content: this.state.json['10140VATCR-000005'],/* 国际化处理： 是否确定要取消？*/
				beSureBtnClick: () => {
					let pk_taxcode = '';
					if (props.getUrlParam('status') === 'add') {
						pk_taxcode = getCurrentLastId(dataSource);
					}
					this.setState(
						{
							pagesate: 'browse',
							pk_taxcode: (pk_taxcode==null || pk_taxcode=='' || pk_taxcode==undefined) ? this.state.pk_taxcode : pk_taxcode
						},
						() => {
							this.getdata();
						}
					);
				}
			});
            break
          case 'Refresh':
			this.getdata(() => {
				toast({title:this.state.json['10140VATCR-000006'],color:'success'});/* 国际化处理： 刷新成功！*/
			});
			break
		  case 'EditTaxRate':
			this.editTaxRate();
			break
		  case 'Enable':
			this.enable();
			break;
		  case 'Disable':
			this.disEnable();
			break;
		  case 'Print':
			this.pintFunction();
			break;
		  case 'Output':
			this.output();
			break;
          default:
            break
        }
	}

	//打印功能函数
	pintFunction(){
		let pks=[this.state.pk_taxcode];
        let param={
            funcode : appcode,
			nodekey: 'taxcodecard',
            oids : pks
        };
		print(
			'pdf',
			urls['print'],
			param
		);
	}

	//输出功能函数
	output(){
        let pks=[this.state.pk_taxcode];
        this.setState({
            pks:pks
        },() => {
            this.refs.printOutput.open();
        });
    }

	
	/**调整税率 */
	editTaxRate = () => {
		this.props.modal.show(taxrateformId);
		ajax({
			url: urls['editTaxrateUrl'],
			data: {pk_taxcode: this.props.form.getFormItemsValue(formId,pk_item).value},
			success: (result) => {
				if(result.success){
					this.props.form.EmptyAllFormValue(taxrateformId);
					//设置表单为所选树节点数据
					let formdata = {};
					formdata[taxrateformId] = result.data['form'][taxrateformId];
					this.props.form.setAllFormValue(formdata);
					this.props.form.setFormStatus(taxrateformId,'edit');
					/**
					 * <p>
					 * 如果老终止日期是9999年遵循以下规则：<br>
					 * 如果起始日期在今年之前，新起始日期设上明年，如果起始日期在今年之后，设上起始日期后一年
					 * </p>
					 * 如果老终止日期不是9999，新起始日期设上老终止日期后一年。
					 * <p>
					 * 比如今年是2012年：
					 * </p>
					 * <table border="1px" style="text-align:center">
					 * <tr>
					 * <td>老日期</td>
					 * <td>默认新日期</td>
					 * </tr>
					 * <tr>
					 * <td>2011-9999</td>
					 * <td>2013-9999</td>
					 * </tr>
					 * <tr>
					 * <td>2013-9999</td>
					 * <td>2014-9999</td>
					 * </tr>
					 * <tr>
					 * <td>2013-2015</td>
					 * <td>2016-9999</td>
					 * </tr>
					 * </table>
					 */
					let newbegindate;
					let fdata = formdata[taxrateformId]['rows'][0];
					if (fdata.values.enddate.value.substr(0,4) === '9999' || fdata.values.enddate.value === "9999-12-31" ) {
						if ( parseInt(fdata.values.begindate.value.substr(0,4)) > new Date().getFullYear()) {
							newbegindate = (parseInt(fdata.values.begindate.value.substr(0,4))+1) + "-01-01";
						}else{
							newbegindate = (new Date().getFullYear()+1) + "-01-01";
						}
					} else {
						newbegindate = (parseInt(fdata.values.begindate.value.substr(0,4)) +1)+ "-01-01";
					}
					let dataParam = {
						'oldtaxtype': fdata.values.taxtype,
						'oldtaxrate': fdata.values.taxrate,
						'oldrealtaxrate': fdata.values.realtaxrate,
						'oldbegindate': fdata.values.begindate,
						'oldenddate': fdata.values.enddate,
						'begindate': {value: newbegindate},
						'enddate': {value: "9999-12-31"},
						'taxrate': {value: ''},
						'realtaxrate': {value: ''},
						'note': {value: ''}
					};
					this.props.form.setFormItemsValue(taxrateformId,dataParam);
				}
			}
		});
	} 
	/**启用 */
	enable = () => {
		let paramData = {
			id: this.props.form.getFormItemsValue(formId,pk_item).value,
			ts: this.props.form.getFormItemsValue(formId,'ts').value
		};
		promptBox({
			color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['10140VATCR-000007'],/* 国际化处理： 确认启用*/
			content: this.state.json['10140VATCR-000008'],/* 国际化处理： 是否确定要启用？*/
			beSureBtnClick: ()=>{
				ajax({
					url: urls['enableTaxUrl'],
					data: paramData,
					success:(res)=>{
						if(res.success){
							toast({ color: 'success', title: this.state.json['10140VATCR-000009'] });/* 国际化处理： 启用成功！*/
							this.getdata();
						}
					}
				});
			}
		});
	}
	/**停用 */
	disEnable = () => {
		let paramData = {
			id: this.props.form.getFormItemsValue(formId,pk_item).value,
			ts: this.props.form.getFormItemsValue(formId,'ts').value
		};
		promptBox({
			color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['10140VATCR-000010'],/* 国际化处理： 确认停用*/
			content: this.state.json['10140VATCR-000011'],/* 国际化处理： 是否确定要停用？*/
			beSureBtnClick: ()=>{
				ajax({
					url: urls['disableTaxUrl'],
					data: paramData,
					success:(res)=>{
						if(res.success){
							toast({ color: 'success', title: this.state.json['10140VATCR-000012'] });/* 国际化处理： 停用成功！*/
							this.getdata();
						}
					}
				});
			}
		});
	}

    pageInfoClick=(props, pk)=>{
        if(pk&&pk!=null) {
			props.setUrlParam({id: pk});
			this.setState(
				{
					pk_taxcode: pk
				},
				() => {
					this.getdata();
				}
			);
        }
	}

	updateButtonState = () => {
		let enablestate = this.props.form.getFormItemsValue(formId,"enablestate").value;
		if(enablestate === '2'){
			this.props.button.setButtonVisible({'Disable':true, 'Enable':false});
		}else{
			this.props.button.setButtonVisible({'Enable':true, 'Disable':false});
		}
	}

	//保存单据
	saveClick = (callback) =>{
		if(!this.props.form.isCheckNow(formId))return;

		this.props.cardTable.filterEmptyRows(tableId);
		let cardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
		let cardDataVals = cardData['head']['head']['rows'][0]['values'];
		cardDataVals['taxrate'] = null;
		let adupFlag = '';//新增修改标识  新增 add 修改 update
		if(cardDataVals['pk_taxcode']['value']){//修改	
			cardData.body['taxrate']['rows'].map((taxratevo) => {
				if(taxratevo['values']['pk_taxrate']['value']===this.state.lastTaxrate_pk){
					taxratevo['status'] = '1';
					taxratevo['values']['taxtype']['value'] = cardDataVals['taxtype']['value'];
					taxratevo['values']['taxrate']['value'] = cardDataVals['taxrate_b']['value'];
					taxratevo['values']['realtaxrate']['value'] = cardDataVals['realtaxrate']['value'];
					taxratevo['values']['begindate']['value'] = cardDataVals['begindate']['value'];
					taxratevo['values']['enddate']['value'] = cardDataVals['enddate']['value'];
				}
			});
		}else{//新增
			adupFlag = 'add';		
			let addtaxraterows = this.state.addtaxraterows[0];
			addtaxraterows['values']['taxtype']['value'] = cardDataVals['taxtype']['value'];
			addtaxraterows['values']['taxrate']['value'] = cardDataVals['taxrate_b']['value'];
			addtaxraterows['values']['realtaxrate']['value'] = cardDataVals['realtaxrate']['value'];
			addtaxraterows['values']['begindate']['value'] = cardDataVals['begindate']['value'];
			addtaxraterows['values']['enddate']['value'] = cardDataVals['enddate']['value'];

			cardData.body['taxrate']['rows'] = [addtaxraterows];
		}

		let saveajax = () => {
			ajax({
				url: urls['SaveTaxcodeUrl'],
				data: cardData,
				success: (res) => {
					if (res.success) {
						toast({title : this.state.json['10140VATCR-000013'],color : 'success'});/* 国际化处理： 保存成功！*/
						let pk_value = res.data['pk_taxcode'];
						if(adupFlag === 'add'){
							this.props.setUrlParam(pk_value);//动态修改地址栏中的id的值
							addCache(pk_value,res.data,formId,dataSource);
						}
						this.setState(
							{
								pagesate: 'browse',
								pk_taxcode: pk_value
							},
							() => {
								callback && callback();
							}
						);
					}
				}
			})
		}
		this.props.validateToSave(cardData, saveajax,{[formId]:'form',[tableId]:'cardTable'},'card');
	  }

	//删除单据
	delConfirm = () => {
		ajax({
			url: urls['delTaxsUrl'],
			data: {
				id: this.state.pk_taxcode,
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: (res) => {
				if(res){
					toast({ color: 'success', title: this.state.json['10140VATCR-000014'] });/* 国际化处理： 删除成功！*/
					
					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let nextId = getNextId(this.state.pk_taxcode, dataSource);
					
					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(pk_item,this.state.pk_taxcode,dataSource);

					if(!nextId){
						this.props.pushTo('/list', {
							status: 'browse',
							appcode: appcode,
							pagecode: listpageId
						});
					}else{
						this.setState(
							{pk_taxcode : nextId},
							() => {
								this.props.setUrlParam(this.state.pk_taxcode);//动态修改地址栏中的id的值
								this.getdata();
							}
						);
						this.props.setUrlParam(nextId)//动态修改地址栏中的id的值
					}
				}
				
			}
		});
	};

	//编辑后事件 props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
	onAfterEvent =(props, moduleId, key,value, oldValue) => {debugger
		switch (key) {
			case 'pursaletype':
				let pursaletype = value['value'];
				this.pursaletypeChangeEvnt(pursaletype);
				break;
			default:
			  break
		}
		return true;
	}

	//是不是欧盟国家
	isEU() {
		let selCountry = this.state.selCountry['refpk'];
		if(!selCountry || selCountry['iseucountry']!='Y'){
			return false;
		}
		return true;
	}

	//购销类型 变化联动事件
	pursaletypeChangeEvnt = (pursaletype) => {debugger
		let iseu = this.isEU();
		if (pursaletype === '1') {//国内销售
			if (iseu) {
				this.setItemsEditable(['mattaxes','custaxes','iscusvat']);
			} else {
				this.setItemsEditable(['mattaxes','custaxes']);
			}
		} else if (pursaletype == '2') {//国内采购
			if (iseu) {
				this.setItemsEditable(['mattaxes']);
			} else {
				this.setItemsEditable(['mattaxes','suptaxes']);
			}
		} else if (pursaletype == '3') {//出口
			if (iseu) {
				this.setItemsEditable(['istriangletrade','custaxes','iscusvat','mattaxes']);
			} else {
				this.setItemsEditable(['mattaxes']);
			}
		} else if (pursaletype == '4') {//进口
			if (iseu) {
				this.setItemsEditable(['istriangletrade','mattaxes']);
			} else {
				this.setItemsEditable(['mattaxes']);
			}
		} else {//不区分
			if (iseu) {
				this.setItemsEditable(['mattaxes', 'suptaxes', 'custaxes', 'iscusvat','istriangletrade']);
			} else {
				this.setItemsEditable(['mattaxes','custaxes','suptaxes']);
			}
		}
	}

	//设置属性属性可编辑性
	setItemsEditable(items) {
		let edit_changeable_itemkeys = ['mattaxes','suptaxes','custaxes','iscusvat','istriangletrade'];
		edit_changeable_itemkeys.forEach((itemkey) => {
			let obj = {};
			if (Util.isInArray(items,itemkey)) {
				obj[itemkey] = false;
				this.props.form.setFormItemsDisabled(this.formId,obj);
			} else {
				obj[itemkey] = true;
				this.props.form.setFormItemsDisabled(this.formId,obj);
				obj[itemkey] = {value:'',display:null};
				this.props.form.setFormItemsValue(this.formId, {itemkey: {value:'',display:null} });
			}
		});
	}

	//获取列表肩部信息
	getTableHead = () => {
        return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max','setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
				</div>	
			</div>
        )
	}

	render() {
		let { cardTable, form, button, modal, cardPagination ,BillHeadInfo} = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		const {createCardPagination} = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;

		let titleName = this.state.json['10140VATCR-000015']; //节点名称/* 国际化处理： 增值税税码税率*/

		return (
			<div className='nc-bill-card'>
				<div className='nc-bill-top-area'>
					<NCAffix>
						<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
							{this.state.pagesate=='browse' &&  
								<NCBackBtn 
									className='title-search-detail'
									onClick={ this.onButtonClick.bind(this,this.props,'back') } 
								/>
							}

							<div className="header-title-search-area">
								{createBillHeadInfo({
										title:(titleName),
										initShowBackBtn:false
									}
								)}
							</div>
							
							<div className="header-button-area">
								{createButtonApp({
									area: 'card-area',
									onButtonClick: this.onButtonClick.bind(this),
									popContainer: document.querySelector('.card-area')
								})}
							</div>
							
							<div className='header-cardPagination-area' style={{float:'right'}}>
								{createCardPagination({
									handlePageInfoChange: this.pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area nc-theme-area-bgc">
						{createForm(this.formId, {
							onAfterEvent: this.onAfterEvent.bind(this)
						})}
					</div>
				</div>

				<div className="nc-bill-bottom-area nc-theme-gray-area-bgc nc-theme-area-split-bc" style={{marginTop: 8}}>
                    <div className="nc-bill-tableTab-area taxcode-tab-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this),
							showIndex: true,
							adaptionHeight: true
						})}
                    </div>
                </div>
				
				{createModal(taxrateformId,{
					title: this.state.json['10140VATCR-000016'],/* 国际化处理： 调整税率*/
					userControl: true,
					content: 
					<div>
						{createForm(taxrateformId, {
							//onAfterEvent: this.onAfterFormEvent.bind(this)
						})}
					</div>,
					beSureBtnClick: () => {
						let formData = this.props.form.getAllFormValue(taxrateformId);
						let requestParam = {
							model: formData,
							pageid: '10140VATCR_taxcode_card' //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
						};
						//ajax请求
						ajax({
							url: urls['SaveTaxrateUrl'],
							data: requestParam,
							success: (result) => {
								let {success,data} = result;
								if(success){
									toast({title: this.state.json['10140VATCR-000013'],color: 'success'});/* 国际化处理： 保存成功！*/
									this.props.modal.close(taxrateformId);
									//保存后刷新界面
									this.getdata();
								}
							}
						});
					},
					cancelBtnClick: () => {
						this.props.form.setFormStatus(taxrateformId,'browse');
						this.props.modal.close(taxrateformId);
					} //取消按钮事件回调
				})}
				<PrintOutput
					ref='printOutput'
					url= {urls['print']}
					data={{
						funcode : appcode,
						nodekey :'taxcodecard',  //模板节点标识
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

TaxcodeCard = createPage({
	billinfo:{
		billtype: 'card',
		pagecode: '10140VATCR_taxcode_card',
		headcode: 'head',
        bodycode: 'taxrate'
	}
})(TaxcodeCard);
export default TaxcodeCard;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
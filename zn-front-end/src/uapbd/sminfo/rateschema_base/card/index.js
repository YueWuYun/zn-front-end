//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,print,high,getBusinessInfo,deepClone,cardCache,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const {PrintOutput} = high;
import './index.less';
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
//import Utils from "../../../public/utils";
const { NCDiv } = base;
let dataSource = 'uapbd.sminfo.rateschema';//缓存的标识
const formId = 'head';                      //表头id
const tableId = 'rateschemach';                  //子表id
const pageId = '10140RATEG_ratecard';            //pagecode
//const searchId = 'search';                  //查询区id
const appId ='0001Z010000000001RAJ';        //按钮注册id
const appcode = '10140RATEG';   //注册按钮id
const queryCardUrl = '/nccloud/uapbd/rateschema/querycardrateschema.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/rateschema/saverateschema.do';             //新增保存
const updateUrl = '/nccloud/uapbd/rateschema/updaterateschema.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/rateschema/deleterateschema.do';         //删除
const qryUserInfoUrl = '/nccloud/uapbd/rateschema/rateschemaloginuserinfoquery.do'//登录用户信息
const printUrl =  '/nccloud/uapbd/rateschema/rateschemaprint.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/rateschema/rateschemavalid.do';                   //权限校验
const pk_item = 'pk_rateschema';               //单据主键--用于卡片查询刷新
const titleCode = 'code';           //单据编码--用于卡片表头显示
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮
let isShowBack = true;	
const keys = ['showorder'];  //过来空行时，忽略的字段

let tableBtnAry =(props)=>{
	return props.getUrlParam('status') === 'browse'
				? [ 'detail' ]: ['delline','insertline'];
} 


// let initTemplate =(props)=>{
	
// }

function 
modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	if(props.nodeType == 'group'){

        meta[formId].items.map((item)=>{

            if(item.attrcode == 'pk_org'){
                item.disabled = 'false';
            }
        })
    }
	
	let porCol = {
		attrcode: 'opr',
		label:props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000001'),/* 国际化处理： 操作*/
		key: 'opr',
		visible: true,
		className:'table-opr',
		width:'200px',
		itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {

			let btnArray = tableBtnAry(props);

			return props.button.createOprationButton(
				btnArray,
				{
					area: "table-opr-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)

			// let status = props.cardTable.getStatus(tableId);
			// return status === 'browse' ? (
			// 	<span
    		// 		onClick={() => {
            //             props.cardTable.toggleRowView(tableId, record)
        
            //         }}
            //         > 展开
            //  	</span>
			// ):(<div className="currency-opr-col">
			// 		<span
			// 			className="currency-opr-del"
			// 			onClick={(e) => {
			// 				props.cardTable.openModel(tableId, 'edit', record, index);
			// 				e.stopPropagation();
			// 			}}
			// 		>更多</span>
			// 		&nbsp;&nbsp;
			// 		<span
			// 			className="currency-opr-del"
			// 			onClick={(e) => {
			// 				props.cardTable.delRowsByIndex(tableId, index);
			// 				e.stopPropagation();
			// 			}}
			// 		>删除</span>
			// 	</div>
			// );
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

function tableButtonClick(props, id, text, record, index){

	switch(id){

		case 'insertline':
			//let allData = props.cardTable.getAllRows(tableId, false)
			let allData = props.cardTable.getVisibleRows(tableId)
			let value = {}
			let showordervalue = record.values["showorder"].value;
			allData.forEach(element => {
				if(element.values['showorder'].value >= record.values["showorder"].value){
					value = (parseInt(element.values['showorder'].value)  + 1).toString()
					props.cardTable.setValByKeyAndRowId(tableId,element.rowid,'showorder',{value: value})
				}
			})
			
			props.cardTable.addRow(tableId,index,{'showorder':{display:'',value:showordervalue}},false);
			break;
		case "delline"://删除行
			props.cardTable.delRowsByIndex(tableId, index);
			let allData1 = props.cardTable.getVisibleRows(tableId)
			let value1 = {}
			allData1.forEach(element => {
				if(element.values['showorder'].value >= record.values["showorder"].value){
					value1 = (parseInt(element.values['showorder'].value)  - 1).toString()
					props.cardTable.setValByKeyAndRowId(tableId,element.rowid,'showorder',{value: value1})
				}
			})
			break;
		case "detail"://更多
			props.cardTable.toggleRowView(tableId, record);
			break;
		// case "spread"://展开
		// 	props.cardTable.openModel(tableId, 'edit', record, index);
		// 	break;
		default:
			console.log(id,index);
			break;
	}
}

 //切换页面状态
function toggleShow(props){
	let status = props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
	let pk_rate = props.form.getFormItemsValue(formId,'pk_rateschema').value;
    if(!pk_rate){
        pk_rate = props.getUrlParam('id');
    }
	//按钮的显示状态
	if(status == 'add'){
		props.cardTable.showColByKey(tableId,'opr');
		isShowBack = false;
		props.button.setButtonVisible(['edit','add','back','delete','refresh','detail','printGrp','print','output'],false);
		props.button.setButtonVisible(['save','saveAdd','cancel','addline','delline','insertline'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}else if(status == 'edit'){
		props.cardTable.showColByKey(tableId,'opr');
		isShowBack = false;
		props.button.setButtonVisible(['edit','add','saveAdd','back','delete','refresh','detail','printGrp','print','output'],false);
		props.button.setButtonVisible(['save','cancel','addline','delline','insertline'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}else{
		props.cardTable.hideColByKey(tableId,'opr');
		isShowBack = true;
		props.button.setButtonVisible(['save','saveAdd','cancel','back','addline','delline','insertline'],false);
		props.button.setButtonVisible(['add','edit','delete','refresh','detail','printGrp','print','output'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		if(!pk_rate){
			props.button.setButtonDisabled(['edit','delete','refresh','detail','printGrp','print','output'],true);
		}else{
			props.button.setButtonDisabled(['edit','delete','refresh','detail','printGrp','print','output'],false);
		}
	}
	props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status);
};

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		//this.searchId = searchId;
        this.tableId = tableId;
		this.state = {
			json:{},
			pk_org : '',
			title_code : '',
			backVisible: true,
			context: {
                nodeType: props.nodeType,
                pk_org: '',
                pk_org_v: '',
                org_Name: '',
                org_v_Name: '',
                mdid: '',
                PermissionOrgIDs: []
            }
		}
		const that = this;
		props.createUIDom(
			{
				pagecode: props.pagecode_card//页面id
				//appcode: props.appcode//注册按钮的id
				//appid: props.appid//注册按钮的id
			}, 
			function (data){
				if(data){
					let context = data.context;
					debugger
                    that.state.context = Object.assign(that.state.context, context);
					if(data.template){
						let meta = data.template;
						meta[formId].items.map((obj)=>{
							if((obj.attrcode == 'pk_org')){
								//let pkGroup = '0001HR100000000005M3';
								if(props.nodeType == 'org')
								{
									obj.queryCondition = function () {
										return {
											//"pk_org": pkGroup,
											// "pk_group":pkGroup,
											// "isContains":pkGroup,
											AppCode:'10140RATEO',
											TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
										}
									}
								}
							}
						})
						modifierMeta(props, meta)
						props.meta.setMeta(meta,() => {
                            that.setDefaultValue();
                        })
						// let status = props.getUrlParam('status');
						// if(status && status == 'add'){
						// 	props.cardTable.addRow(tableId);
						// }
					}
					if(data.button){
						let button = data.button;
						props.button.setButtons(button);
						toggleShow(props);
					}
				}   
			}
		)
	}
	componentDidMount() {
		// toggleShow(this.props);
		
		let status = this.props.getUrlParam('status');
		if(status != "add"){
			let	pk = this.props.getUrlParam('id');
			if(pk && pk != 'undefined'){
				this.getdata(pk);
			}
		}
		else{
			this.setDefaultValue();
		}
		
	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		  if (status) {
			  this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
		  } else {
			  console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		  }
	
		}
		getMultiLang({moduleId: appcode, domainName: 'uapbd',callback})
	 }

	componentDidUpdate(){
        let formStatus = this.props.getUrlParam('status')
		if(formStatus != 'add' && formStatus != 'edit'){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	componentWillReceiveProps(){}

	setDefaultValue = () =>{
		debugger
		//this.props.form.setFormItemsValue(this.formId,{'pk_org':{value: this.props.CacheTools.get("pk_org"),display:'自由态'}});
		// if(this.props.nodeType == 'group'){
        //     ajax({
        //         url:qryUserInfoUrl,
        //         success:(res)=>{
        //             this.props.form.setFormItemsValue(this.formId,{'pk_org':
        //                     {
        //                         value:res.data.group.pk_group,
        //                         display:res.data.group.name
        //                     }});
        //         }
        //     })
		// }
		if(this.props.nodeType == 'group'){
			let businessInfo = getBusinessInfo();
			if(businessInfo != null){
				let pkGroup = businessInfo.groupId;
				let grpName = businessInfo.groupName;
				this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:pkGroup,display:grpName}});
			}
        
		}else {
            //此处暂且先仿照原作者去后台取登录用户集团信息并取form默认值，
            //后续登录用户集团信息应从businessinfo里取，form默认值应再写个action
            ajax({
                url: qryUserInfoUrl,
                success: (res) => {
                    this.props.form.setFormItemsValue(this.formId, {
                        'pk_org':
                        {
                            value: this.state.context.pk_org,
                            display: this.state.context.org_Name
                        }
                    });
                }
            })
        }
	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
          case 'add':
		  	this.add(props);
			props.setUrlParam({
			  status: 'add',
			  appcode:props.appcode,
			  pagecode:props.pagecode_card
            })
            toggleShow(this.props);
            break
		  case 'edit':
		  	this.valid(props,()=>{
				props.setUrlParam({
				status: 'edit',
				id: props.getUrlParam('id'),
				appcode:props.appcode,
				pagecode:props.pagecode_card
				})
				toggleShow(this.props);
			})
            break;
		  case 'delete':
		  	this.valid(props,()=>{
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140RATEG-000002'],/* 国际化处理： 确认删除*/
					content:this.state.json['10140RATEG-000017'],/* 国际化处理： 您确定要删除所选数据吗?*/
					beSureBtnClick:()=>{this.delConfirm()}
				})
			  });
            break;
          case 'back':
            props.pushTo(props.listUrl, {
				appcode:props.appcode,
				pagecode:props.pagecode_list,
				status: 'browse'

			})
            break
		  case 'save':
			this.saveClick('save');
			break
		  case 'saveAdd':
			this.saveClick('saveAdd');
			break
		  case 'cancel':
		 	 promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title : this.state.json['10140RATEG-000004'],/* 国际化处理： 确认取消*/
				content : this.state.json['10140RATEG-000005'],/* 国际化处理： 是否确认要取消？*/
				beSureBtnClick : ()=>{

					let pk = getCurrentLastId(dataSource);
					if (props.getUrlParam('status') === 'add') {
						// this.getDataForCache(pk, () => { 
						//   props.form.cancel(this.formId);
						//   props.cardTable.resetTableData(this.tableId);
						//   props.setUrlParam({
						// 	status: 'browse',
						// 	id: props.getUrlParam('id'),
						// 	appcode:props.appcode,
						// 	pagecode:props.pagecode_card
						//   })
						//   toggleShow(this.props);
						// })
						this.getDataForCache(pk, () => {
							//编辑态取消时，修正一下页面状态
							props.pushTo('/card', {
								status: 'browse',
								id: props.getUrlParam('id')
							})
			
							props.form.setFormStatus(this.formId, 'browse')
							props.cardTable.setStatus(this.tableId, 'browse')
						})
					}
					if ((props.getUrlParam('status') === 'edit')) {
						props.form.cancel(this.formId);
						props.cardTable.resetTableData(this.tableId);
						props.setUrlParam({
						  status: 'browse',
						  id: props.getUrlParam('id'),
						  appcode:props.appcode,
						  pagecode:props.pagecode_card
						})
					}
					if(pk){
						toggleShow(this.props);
					}
				}
			});
            
            
            break
		  case 'addline':
			let rowNum = props.cardTable.getNumberOfRows(this.tableId);
			props.cardTable.addRow(this.tableId,rowNum,{'showorder':{display:'',value:rowNum+1+''}},false);
            break
          case 'refresh':
		  	props.setUrlParam({
			  status:props.getUrlParam('status'),
			  appcode:props.appcode,
			  id:props.getUrlParam('id'),
			  pagecode:props.pagecode_card
			})
			toggleShow(this.props);
			this.getdata(props.getUrlParam('id'),true);
            toast({title:this.state.json['10140RATEG-000006'],color:'success'});/* 国际化处理： 刷新成功！*/
            break
			case 'printGrp':
			this.onPrint();
			break;
		  case 'print':
			this.onPrint();
			break;
		  case 'output':
			this.onOutput();
			break;
		  default:
			break
        }
	}

	add=(props)=>{
		//let pk_org = Utils.clone(props.form.getFormItemsValue(this.formId,'pk_org'));
		let pk_org = deepClone(props.form.getFormItemsValue(this.formId,'pk_org'));
        props.form.EmptyAllFormValue(this.formId)
        props.cardTable.setTableData(this.tableId, { rows: [] })
        props.setUrlParam({
            appcode:props.appcode,
            pagecode:props.pagecode_card,
            status: 'add'
        })
        let date = getBusinessInfo().businessDate;
        let grpId = getBusinessInfo().groupId;
        let grpName = getBusinessInfo().groupName;
        //组织节点不能赋值集团
        if(props.nodeType == 'org' && pk_org.value == grpId){
            pk_org = {value:'',display:''};
        }
        //集团一定是集团
        if(props.nodeType == 'group' && pk_org != grpId){
            pk_org = {value:grpId,display:grpName};
        }
        props.form.setFormItemsValue(this.formId,{'pk_org':{value:pk_org.value,display:pk_org.display}});
        props.form.setFormItemsValue(this.formId,{'effectdate':{value:date,display:date}});
    }

    valid=(props,callback)=>{
        let data = {
            pks:[props.form.getFormItemsValue(formId,pk_item).value],
            nodeType:props.nodeType
        }
        ajax({
            url:validUrl,
            data,
            success:(res)=>{
                callback && callback();
            }
        })
    }
	
	//打印pk_item
    onPrint=()=>{

        let allData = this.props.form.getAllFormValue(formId);

        if(allData.length === 0){
            toast({content:this.state.json['10140RATEG-000007'],color:'warning'});/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
				appcode:this.props.printFunCode,
                funcode:this.props.printFunCode,//小应用编码
                nodekey:this.props.printNodeKey,//模板节点编码
                oids:pks
            }
        )
    }
    //输出
    onOutput=()=>{

        let allData = this.props.form.getAllFormValue(formId);
        if(allData.length === 0){
            toast({content:this.state.json['10140RATEG-000008'],color:'warning'});/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids : pks
        },this.refs.printOutput.open());
    }

    
    pageInfoClick=(props, pk)=>{
        this.getDataForCache(pk)
        // let data = {
		// 	'pk_org':cacheTools.get('pk_org'),
        //     'pk': pk,
		// 	'pageid': props.pagecode_card
        // };
        // ajax({
        //     url: queryCardUrl,
        //     data: data,
        //     success: (res) =>{
        //         if (res.data.head) {
                    
        //             props.form.setAllFormValue({ [formId]: res.data.head[formId] });
        //             props.setUrlParam(pk)//动态修改地址栏中的id的值
        //         }
        //         if (res.data.body) {
        //             props.cardTable.setTableData(tableId, res.data.body[tableId]);
        //         }
        //     }
        // });
    }


    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{}

	//通过单据id查询单据信息
	getdata = (pk) =>{
		let data = {
			pk,
			//pk_org: cacheTools.get('pk_org')
		};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
					//放入缓存
					updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					// let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					// let arr = this.props.cardTable.getAllRows(this.tableId);
					// let applycount = 0;
					// // arr.map((item)=>{
					// // 	applycount += parseInt(item.values.pk_project.value);
					// // })
					// this.setState({applycount});
					// this.setState({totalcount});
				}

				//查询时执行显示公式前端适配
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg,  //参数一：返回的公式对象
						{                //参数二：界面使用的表格类型
							[this.tableId]:"table",
							[this.formId]:"form"
						}
					);
				}
			}
		});
	}

	//保存单据
	saveClick = (btn) =>{
		this.props.cardTable.filterEmptyRows(tableId,keys);
		if (this.props.form.isCheckNow(formId) && this.props.cardTable.checkTableRequired(tableId)) {
			this.props.cardTable.filterEmptyRows(tableId);
			let CardData = this.props.createMasterChildData(this.props.pagecode_card, this.formId, this.tableId);
			// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
			let url = saveUrl;//新增保存
			let flag = false;
			if (this.props.getUrlParam('status') === 'edit') {
				url = updateUrl;//修改保存
				for(let row of CardData.body.rateschemach.rows){
					if(row.status != 3){
						flag = false;
						break;
					}else{
						flag = true;
					}
				}
			}
			if(CardData.body.rateschemach.rows.length <1 || flag){
				toast({title:this.state.json['10140RATEG-000009'],content: this.state.json['10140RATEG-000010'],color : 'danger'});/* 国际化处理： 保存失败！,折扣期行不能为空!*/
				return
			}
			//适配保存校验公式
            this.props.validateToSave( CardData , ()=>{
				ajax({
					url: url,
					data: CardData,
					success: (res) => {
						let pk_value = null
						if (res.success) {
							if (res.data) {
								if (res.data.head && res.data.head[this.formId]) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
									//更正缓存
								if(url == saveUrl) {
									//新增保存
									addCache(pk_value,res.data,this.formId,dataSource);
								}
								else {
									//修改保存
									updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
								}
								}
								if (res.data.body && res.data.body[this.tableId]) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
								}
							}
							toast({title : this.state.json['10140RATEG-000011'],color : 'success'});/* 国际化处理： 保存成功！*/
							if(btn == 'save') {

								this.getdata(pk_value);
								this.props.setUrlParam({
									status: 'browse',
									appcode: this.props.appcode,
									pagecode:this.props.pagecode_card,
									id: pk_value
								})
							}else {
								this.add(this.props);
								this.props.setUrlParam({
									appcode: this.props.appcode,
									pagecode:this.props.pagecode_card,
									status: 'add'
								})
							}
							toggleShow(this.props)
						}
					}
				})
			},{[tableId]:'cardTable'} , 'card' )
		}
	  }


	  getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
			this.props.cardTable.setTableData(this.tableId, {rows: []})
			this.props.setUrlParam({status: 'browse'})
			toggleShow(this.props)
			this.props.button.setButtonVisible(['enable','disable','edit','delete','output','refresh','print'],false);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			return
		}
	
		let cardData = getCacheById(pk, dataSource);
		if(cardData) {
			this.props.form.setAllFormValue({ [formId]:cardData.head[formId] });
			let title_code = cardData.head[formId].rows[0].values[titleCode].value;
			this.setState({title_code});
			if(cardData.body && cardData.body[tableId]) {
				this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
			}
			else {
				this.props.cardTable.setTableData(tableId, {rows: []})
			}
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}
		else {
			this.getdata(pk)
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}

		if(callback && typeof callback == 'function') {
			callback.call(this)
		}
	}
	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				//pk_org: cacheTools.get('pk_org'),
				deleteinfo:[{
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			}]},
			success: (res) => {
				if(res){
					// this.props.pushTo(this.props.listUrl,{
                    //     appcode:this.props.appcode,
                    //     pagecode:this.props.pagecode_list,
                    //     status: 'browse'
					// });
					let id = this.props.getUrlParam("id");

					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let nextId = getNextId(id, dataSource);

					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(pk_item,id,dataSource);
					
					this.getDataForCache(nextId,() => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
						toast({ color: 'success', title: this.state.json['10140RATEG-000012'] });/* 国际化处理： 删除成功！*/
					})
				}
				
			}
		});
	};

	modelSave = (props)=>{
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
	}

    getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};

	//获取列表肩部信息
	getTableHead = () => {
		let {button} = this.props;
		let { createButtonApp } = button;
		let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: 'definition-icons',//按钮注册中的按钮区域
						//buttonLimit: 5, 
						onButtonClick: this.buttonClick.bind(this)
						//popContainer: document.querySelector('.header-button-area')
					})}
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max','setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
					{/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
				</div>	
			</div>
        )
    }
	render() {
		let { cardTable, form, button, modal, cardPagination ,BillHeadInfo} = this.props;
		const {createCardPagination} = cardPagination;
		const {createBillHeadInfo} = BillHeadInfo;
		let buttons = this.props.button.getButtons();
		// buttons = buttons.sort((a,b)=>{
		// 	return b.btnorder - a.btnorder;
		// });
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
					<div className="nc-bill-extCard rateschema_weixue">
						<div className="nc-bill-top-area"> 
							<NCAffix>
								<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
	
									<div className='header-title-search-area'>
                                       {createBillHeadInfo({
                                            backBtnClick: this.buttonClick.bind(this,this.props,'back'),
                                            title:(this.state.json[this.props.nodeName]),
                                            initShowBackBtn:status == 'browse' ? true :false
                                        }
                                        )}
                                   </div>
									{/*分页 */}
									{/* {status=='browse'?<div className='header-button-cardPagination'>
										{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
										</div>:''} */}
									<div className="header-button-area btn-list-card">
										{createButtonApp({
											area: 'header-button-area',//按钮注册中的按钮区域
											buttonLimit: 3,  
											//buttonLimit: 5, 
											onButtonClick: this.buttonClick.bind(this) 
											//popContainer: document.querySelector('.header-button-area')
										})}
										{createCardPagination({
											handlePageInfoChange: this.pageInfoClick.bind(this),
											dataSource: dataSource
										})}
									</div>
				                </NCDiv>
							</NCAffix>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									onAfterEvent: this.afterEvent.bind(this)
								})}
							</div>
						</div>
						<div className="nc-bill-bottom-area">
							<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
								{createCardTable(this.tableId, {
									tableHead: this.getTableHead.bind(this),
									modelSave: this.modelSave.bind(this),
									showIndex:true
								})}
							</div>
						</div>
						{/* {createModal('delete', {
							title: "注意",
							content: '确认删除？',
							beSureBtnClick: this.delConfirm
						})} */}
						<PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
							appcode:this.props.printFunCode,
                            funcode:this.props.printFunCode,//小应用编码
                            nodekey:this.props.printNodeKey,//模板节点编码
                            oids : this.state.ids,
                            outputType : 'output'
                        }}
                    />
					</div>
		);
	}
}

export default Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: pageId, 
        headcode: formId,
        bodycode: tableId
    },
	initTemplate: [],
	mutiLangCode: appcode
})(Card);


// ajav({

// 	success: function(temp){
// 		var temp0 = temp;
// 		Card = createPage({
// 			initTemplate: function(){
// 				return temp0;
// 			}
// 		})(Card);
// 	}
// })

//ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cardCache,print,high,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn,NCDiv } = base;
const {PrintOutput} = high;
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
import './index.less';

let dataSource = 'uapbd.org.orgrole';//缓存的标识
const formId = 'head';                      //表头id
const tableId = 'BusiFunctionVO';                  //子表id
const pageId = '10100PSRC_card';            //pagecode
//const searchId = 'search';                  //查询区id
const appId ='0001Z010000000002YTH';        //按钮注册id
const appcode ='10100PSRC';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/orgrole/querycardbusifunc.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/orgrole/savebusifunc.do';             //新增保存
const updateUrl = '/nccloud/uapbd/orgrole/savebusifunc.do';        //修改保存
const enableUrl = '/nccloud/uapbd/orgrole/enablebusifunc.do' //启用
const deleteUrl = '/nccloud/uapbd/orgrole/deletebusifunc.do';         //删除
const printUrl =  '/nccloud/uapbd/orgrole/BusiFuncPrintAction.do';                  //列表打印url
const checkUrl = '/nccloud/uapbd/orgrole/BusiCheckDeptMDAction.do'  //校验部门管控模式
const pk_item = 'pk_busirole';               //单据主键--用于卡片查询刷新
const titleCode = 'pk_busirole';           //单据编码--用于卡片表头显示
//const titleName = this.state.json['10100PSRC-000019'];					//节点名称/* 国际化处理： 业务人员来源*/
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮
const listUrl = '/list';
const cardUrl = '/card';
let isShowBack = true;

let tableBtnAry =(props)=>{
	return props.getUrlParam('status') === 'browse'
				? [ 'detail' ]: ['delline'];
} 


let initTemplate =(props)=>{
	props.createUIDom(
		{
			pagecode: pageId//页面id
			//appcode: appcode//注册按钮的id
		}, 
		function (data){
			if(data){
				if(data.template){
					let meta = data.template;
					meta[tableId].items.map((obj)=>{
						if((obj.attrcode == 'pk_org')){
							obj.isMultiSelectedEnabled = true;
						}
						if((obj.attrcode == 'item')){
							obj.isMultiSelectedEnabled = true;
						}
					})
					modifierMeta(props, meta)
					props.meta.setMeta(meta);
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


function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	meta[formId].items.map((item)=>{

		if(item.attrcode == 'enablestate'){
			item.disabled = 'false';
		}
		if((item.attrcode == 'pk_adminorg')){
			item.queryCondition = function () {
				return {
					AppCode:'10100PSRC',
					TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
				}
			}
		}
	})
	
	let porCol = {
		attrcode: 'opr',
		key: 'opr',
		label:props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000024'),/* 国际化处理： 操作*/
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

		case "delline"://删除行
			props.cardTable.delRowsByIndex(tableId, index);
			break;
		case "detail"://更多
			props.cardTable.toggleRowView(tableId, record);
			break;
		case "spread"://展开
			props.cardTable.openModel(tableId, 'edit', record, index);
			break;
		default:
			console.log(id,index);
			break;
	}
}

 //切换页面状态
function toggleShow(props,enablestate = 2){
	let status = props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
	let pk_busi = props.form.getFormItemsValue(formId,'pk_busirole').value;
    if(!pk_busi){
		pk_busi = props.getUrlParam('id');
    }
	if(props.form.getFormItemsValue(formId,'enablestate')){
	   enablestate = props.form.getFormItemsValue(formId,'enablestate').value;
	}
	//按钮的显示状态
	if(status == 'edit' || status == 'add'){
		if( status == 'add'){
			props.form.setFormItemsValue(formId,{'enablestate':{value: '2',display:props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000041')}});/* 国际化处理： 已启用*/
		}
		props.cardTable.showColByKey(tableId,'opr');
		isShowBack = false;
		props.button.setButtonVisible(['edit','add','back','delete','refresh','detail','printGrp','print','saveAdd','enable','disable'],false);
		if(status == 'add'){
			props.button.setButtonVisible(['saveAdd'],true);
		}
		props.button.setButtonVisible(['save','cancel','addline','delline','spread'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}else{
		props.cardTable.hideColByKey(tableId,'opr');
		isShowBack = true;
		props.button.setButtonVisible(['save','cancel','addline','back','delline','spread','saveAdd'],false);
		props.button.setButtonVisible(['add','edit','delete','refresh','detail','printGrp','print','enable','disable'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		if(enablestate == 2) {
			props.button.setButtonDisabled(['enable'],true);
			props.button.setButtonDisabled(['disable'],false);
		}
		else {
			props.button.setButtonDisabled(['enable'],false);
			props.button.setButtonDisabled(['disable'],true);
		}
		if(!pk_busi){
			props.button.setButtonDisabled(['edit','delete','refresh','detail','printGrp','print','enable','disable','output'],true);
		}else{
			props.button.setButtonDisabled(['edit','delete','refresh','detail','printGrp','print','output'],false);
		}
		
	}
	props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status);
	if(status == 'add'){
		props.cardTable.setStatus(tableId, 'edit');
	}
};

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		//this.searchId = searchId;
        this.tableId = tableId;
		this.state = {
			json:{},
			//pk_org : '',
			title_code : '',
			backVisible: true
		}
	}

	componentWillMount() {
		let callback = (json) => {
			this.setState({json})
			}
		getMultiLang({moduleId: appcode, domainName: 'uapbd',callback})
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

	componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(formId)
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
		this.props.form.setFormItemsValue(this.formId,{'enablestate':{value: '2',display:this.state.json['10100PSRC-000041']}});/* 国际化处理： 已启用*/
	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
          case 'add':
            props.form.EmptyAllFormValue(this.formId)
            props.cardTable.setTableData(this.tableId, { rows: [] })
            props.setUrlParam({
			  status: 'add',
			  pagecode:'10100PSRC_card',
			  appcode:appcode
            })
            toggleShow(this.props);
            break
          case 'edit':
		  	props.setUrlParam({
              status: 'edit',
			  id: props.getUrlParam('id'),
			  pagecode:'10100PSRC_card',
			  appcode:appcode
            })
            toggleShow(this.props);
            break;
          case 'delete':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title:this.state.json['10100PSRC-000033'],/* 国际化处理： 确认删除*/
				content:this.state.json['10100PSRC-000023'],/* 国际化处理： 您确定要删除所选数据吗?*/
				beSureBtnClick:()=>{this.delConfirm()}
			})
            break
          case 'back':
		  	props.pushTo(listUrl, {
				status: 'browse',
				appcode:appcode,
				pagecode:'10100PSRC_listview'
			})
            break
          case 'save':
			this.saveClick('save');
			break
		  case 'saveAdd':
		    this.saveClick('saveAdd');
			break
		  case 'enable':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10100PSRC-000026'],/* 国际化处理： 提示*/
				content: this.state.json['10100PSRC-000027'],/* 国际化处理： 您确定要启用所选数据吗？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: () => {
					let requestData = {
						isEnable: true,
						list: []
					}

					let dataObj = {}
					dataObj.id = this.props.getUrlParam('id')
					requestData.list.push(dataObj)
					ajax({
						url: enableUrl,
						data: requestData,
						success: res => {
							this.getdata(this.props.getUrlParam('id'), () => {
								toast({ color: 'success', title: this.state.json['10100PSRC-000029'] });/* 国际化处理： 启用成功！*/
							});
						}
					})
				},
				cancelBtnClick: () => {
					return;
				}
			})
			break;
		  case 'disable':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10100PSRC-000062'],/* 国际化处理： 提示*/
				content: this.state.json['10100PSRC-000030'],/* 国际化处理： 您确定要停用所选数据吗？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: () => {
					let requestData = {
						isEnable: false,
						list: []
					}

					let dataObj = {}
					dataObj.id = this.props.getUrlParam('id')
					requestData.list.push(dataObj)
					ajax({
						url: enableUrl,
						data: requestData,
						success: res => {
							this.getdata(this.props.getUrlParam('id'), () => {
								toast({ color: 'success', title: this.state.json['10100PSRC-000031'] });/* 国际化处理： 停用成功！*/
							});
						}

					})
				},
				cancelBtnClick: () => {
					return;
				}
			});
			break;
		  case 'cancel':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title : this.state.json['10100PSRC-000001'],/* 国际化处理： 确认取消*/
				content : this.state.json['10100PSRC-000042'],/* 国际化处理： 是否确认要取消？*/
				beSureBtnClick : ()=>{
					// if (props.getUrlParam('status') === 'add') {
			
					// 	//if(cacheTools.get("preid")){
							
					// 		props.form.cancel(this.formId);
					// 		props.cardTable.resetTableData(this.tableId);
					// 		props.setUrlParam({
					// 			status: 'browse',
					// 			id: cacheTools.get("preid"),
					// 			pagecode:'10100PSRC_card',
					// 			appcode:appcode
					// 		})
					// 		toggleShow(this.props);
						// }
						// else{
						// 	props.pushTo(listUrl, {
						// 	status: 'browse',
						// 	appcode:appcode,
						// 	pagecode:'10100PSRC_listview'
						// 	})
						// }
					//}

					let pk = getCurrentLastId(dataSource);
					if (props.getUrlParam('status') === 'add') {
						// this.getDataForCache(pk, () => { 
						//   props.form.cancel(this.formId);
						//   props.cardTable.resetTableData(this.tableId);
						//   props.setUrlParam({
						// 	status: 'browse',
						// 	id: props.getUrlParam('id'),
						// 	pagecode:'10100PSRC_card',
						// 	appcode:appcode
						//   })
						//   //toggleShow(this.props);
						// })
						this.getDataForCache(pk, () => {
							//编辑态取消时，修正一下页面状态
							props.pushTo('/card', {
								status: 'browse',
								pagecode:'10100PSRC_card',
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
							pagecode:'10100PSRC_card',
							appcode:appcode
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
			  id:props.getUrlParam('id'),
			  pagecode:'10100PSRC_card',
			  appcode:appcode
			})
			toggleShow(this.props);
			this.getdata(props.getUrlParam('id'),true);
            toast({title:this.state.json['10100PSRC-000032'],color:'success'});/* 国际化处理： 刷新成功！*/
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
	
	//打印
    onPrint=()=>{

        let allData = this.props.form.getAllFormValue(formId);

        if(allData.length === 0){
            toast({content:this.state.json['10100PSRC-000043'],color:'warning'});/* 国际化处理： 无可打印数据*/
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
				funcode:'10100PSRC',//小应用编码
				nodekey:'',     //模板节点标识
                //nodekey:this.props.printNodeKey,//模板节点编码
                oids:pks
            }
        )
    }
    //输出
    onOutput=()=>{

        let allData = this.props.form.getAllFormValue(formId);
        if(allData.length === 0){
            toast({content:this.state.json['10100PSRC-000036'],color:'warning'});/* 国际化处理： 无可输出的数据*/
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
		// 	//'pk_org':cacheTools.get('pk_org'),
        //     'pk': pk,
		// 	'pageid': pageId
        // };
        // ajax({
        //     url: queryCardUrl,
        //     data: data,
        //     success: (res) =>{
        //         if (res.data.head) {
                    
		// 			props.form.setAllFormValue({ [formId]: res.data.head[formId] });
		// 			let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
		// 			this.setState({title_code});
        //             props.setUrlParam(pk)//动态修改地址栏中的id的值
        //         }
        //         if (res.data.body) {
        //             props.cardTable.setTableData(tableId, res.data.body[tableId]);
        //         }else{
		// 			props.cardTable.setTableData(tableId, { rows: [] })
		// 		}
        //     }
        // });
    }

	onBeforerFormEvent(props, moduleId, key, value, index){
		switch(key){
			case "pk_dept":
				let meta = props.meta.getMeta()
				meta["head"].items.map((obj)=>{
					if(obj.attrcode == 'pk_dept'){
						obj.queryCondition = function () {
							return {
								"pk_org": index.pk_adminorg.value
							}
						}
					}
				})
				props.meta.setMeta(meta)
				return true;
				break;
			default:
				return true;
				break;
				
		}
	}

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
		let rowNum = props.cardTable.getNumberOfRows(this.tableId)-1;
		debugger
		if(key === 'pk_org' && s.status === '2' && i > rowNum){ 
			rowNum = props.cardTable.getNumberOfRows(this.tableId)-1;
			props.cardTable.delRowsByIndex(moduleId, rowNum);
			value.forEach(element => {	
				props.cardTable.addRow(this.tableId,rowNum,{'showorder':{display:'',value:rowNum+1+''},'pk_org':{display:element.refcode,value:element.refpk},'pk_org.name':{display:element.refname,value:element.refname}},false);
			});
		}
		if((key === 'pk_org' && s.status === '1') || (key === 'pk_org' && s.status === '2' && i <= rowNum)){ 
			if(value.length < 1){
				props.cardTable.setValByKeyAndIndex(moduleId,i,'item',{value: null, display:null});
				props.cardTable.setValByKeyAndIndex(moduleId,i,'pk_org.name',{value: null, display:null})
			}else{
				//props.cardTable.delRowsByIndex(moduleId, i);
				setTimeout(()=>{
					props.cardTable.delRowsByIndex(moduleId, i);
				
					var ss = s.values["pk_org"].display.split(",");
					var sss = ''
					let rowNum = props.cardTable.getNumberOfRows(this.tableId);
					//props.cardTable.setValByKeyAndRowId(moduleId,rowNum,'item',{value: '' })
					value.forEach((element,index) => {	
						if(element.refcode){
							for(var i = 0;i < ss.length;i++){
								if(element.refcode === ss[i]){
									ss.splice(i,1)
									break;
								}
							}
						}
					});

					value.forEach(element => {	
						if(element.refcode == undefined){
							element.refcode = ss[0]
						}
						if(rowNum==0){
							props.cardTable.addRow(this.tableId,rowNum,{'showorder':{display:'',value:rowNum+1+''},'pk_org':{display:element.refcode,value:element.refpk},'pk_org.name':{display:element.refname,value:element.refname}},false);
						}
						props.cardTable.addRow(this.tableId,rowNum-1,{'showorder':{display:'',value:rowNum+1+''},'pk_org':{display:element.refcode,value:element.refpk},'pk_org.name':{display:element.refname,value:element.refname}},false);
					});
				},50)
			}
		}
		if(key === 'pk_adminorg'){
			this.props.form.setFormItemsValue(formId, { 'pk_adminorg.name': { value: i.refname, display: i.refname } });
			this.props.form.setFormItemsValue(formId, { 'pk_dept': { value: null, display: null } });
			this.props.form.setFormItemsValue(formId, { 'pk_dept.name': { value: null, display: null } });
		}
		if(key === 'pk_dept'){
			this.props.form.setFormItemsValue(formId, { 'pk_dept.name': { value: i.refname, display: i.refname } });
		}

		// if(key === 'pk_org'){
		// 	let params = {
		// 		pk_org: s.values["pk_org"].value
		// 	}
		// 	ajax({
		// 		url: '/nccloud/uapbd/orgrole/BusiQueryFuncByOrgAction.do',
		// 		data: params,
		// 		success: (res) => {
		// 			let meta = props.meta.getMeta()
		// 			meta[tableId].items.map((obj)=>{
		// 				if(obj.attrcode == 'item'){
		// 					obj.queryCondition = function () {
		// 						return {
		// 							function_id : res.data,
        //                             GridRefActionExt:'nccloud.web.org.orgrole.action.BusiFuncSQLBuilder'
		// 						}
		// 					}
		// 				}
		// 			})
		// 			props.meta.setMeta(meta)
		// 		}
		// 	});
			
		// }
	}

	beforeEvent =(props,moduleId,key,value,index,record,s,line,model)=>{

		let status = props.getUrlParam('status');
		if(status != 'browse' && key === 'item'){
			let params = {
				pk_org: record.values["pk_org"].value
			}
			
			ajax({
				url: '/nccloud/uapbd/orgrole/BusiQueryFuncByOrgAction.do',
				data: params,
				async:false,
				success: (res) => {
					let meta = props.meta.getMeta()
					meta[tableId].items.map((obj)=>{
						if(obj.attrcode == 'item'){
							obj.queryCondition = function () {
								return {
									function_id : res.data,
                                    GridRefActionExt:'nccloud.web.org.orgrole.action.BusiFuncSQLBuilder'
								}
							}
						}
					})
					props.meta.setMeta(meta)
				}
			});
			
		}
		return true;
	}

	//通过单据id查询单据信息
	getdata = (pk,callback) =>{
		let data = {
			pk
			//pk_org: cacheTools.get('pk_org')
		};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if(!res.data){
                    deleteCacheById(pk_item,pk,dataSource);
                    let nextId = getNextId(pk, dataSource);
                    this.getDataForCache(nextId,() => {
                        //this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
                    })
                    return
                }

				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
					toggleShow(this.props)
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
				}else {
					this.props.cardTable.setTableData(this.tableId, {rows: []})
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

				if(callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		});
	}

	validBodyRepeat=(rows)=> {

        if(!rows || rows.length == 0)
            return true;

        let pkMap = new Map();

        if(rows && rows.length>0){
            let i = 1;
            rows.forEach((row,key)=>{
                let pk = row.values.pk_org.value;
                let rowNum = pkMap.get(pk);
                if(!rowNum || rowNum == null){
                    rowNum = i.toString();
                    i++;
                }else{
                    rowNum = `${rowNum},${i}`;
                    i++;
                }
                pkMap.set(pk,rowNum);
            });
        }
        let errMsg = this.state.json['10100PSRC-000044'];/* 国际化处理： 下列字段值已存在，不允许重复，请检查：*/
        pkMap.forEach((value,key, map) => {
            if(value.includes(',')){
				let ss = value.split(",");
				ss.shift();
				ss.forEach(element => {
					errMsg = errMsg + this.state.json['10100PSRC-000045']+ element + this.state.json['10100PSRC-000046']/* 国际化处理： 第,行业务单元已存在，不允许重复，请在已有的业务单元下增补职能*/
				});
                
            }
        });
        if(errMsg != this.state.json['10100PSRC-000044']){/* 国际化处理： 下列字段值已存在，不允许重复，请检查：*/
            toast({content : errMsg ,color : 'danger'});
            return false;
        }
        return true;
    } 


	//保存单据
	saveClick = (btn) =>{
		if(this.props.form.isCheckNow(this.formId) && this.props.cardTable.checkTableRequired(tableId)){
			this.props.cardTable.filterEmptyRows(tableId);

			let visibleRows = this.props.cardTable.getVisibleRows(tableId);
            if(!this.validBodyRepeat(visibleRows))
				return;
				
			let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
			// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
			let urlCheck = 0;
            let url = saveUrl;//新增保存
            //if (this.props.getUrlParam('status') === 'edit') {
            if(this.props.form.getFormStatus(this.formId) === 'edit'){
                url = updateUrl;//修改保存
				urlCheck = 1
            }
			CardData.body.BusiFunctionVO.rows.forEach(element => {
				if(element.values["item"]){
					element.values["org_function"].value = element.values["item"].value
					element.values["org_function"].display = element.values["item"].display
				}
			});
            var realSave=()=>{
				this.props.validateToSave( CardData , ()=>{
					ajax({
						url: url,
						data: CardData,
						success: (res) => {
							let pk_value = null
							if (res.success) {
								console.log(res.data)
								if (res.data) {
									if (res.data.head && res.data.head[this.formId]) {
										this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
										pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
										//更正缓存
										if(urlCheck == 0) {
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
								toast({title : this.state.json['10100PSRC-000047'],color : 'success'});/* 国际化处理： 保存成功！*/
								if(btn == 'save') {
									this.getdata(pk_value);
									this.props.setUrlParam({
										status: 'browse',
										id: pk_value,
										pagecode:'10100PSRC_card',
										appcode:appcode
									})
								}else {
									this.props.form.EmptyAllFormValue(this.formId)
									this.props.cardTable.setTableData(this.tableId, { rows: [] })
									this.props.setUrlParam({
										appcode: appcode,
										pagecode:'10100PSRC_card',
										status: 'add'
									})
								}
								toggleShow(this.props)
							}
						}
					})
				},{[tableId]:'cardTable'} , 'card' )
			}
			//保存前先校验部门管控模式
			ajax({
				url:checkUrl,
				data:{},
				success:(res)=>{
					if(res.data){
						if(res.data.needWarn && res.data.needWarn=='Y'){
							promptBox({
								color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
								title: this.state.json['10100PSRC-000064'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 询问*/
								content: this.state.json['10100PSRC-000063'],             // 提示内容,非必输/* 国际化处理：部门的唯一性规则模式必须是集团，否则会导致财务的一些功能（比如转账，取数函数等）会出现问题而不可用,是否继续保持？*/
								beSureBtnClick: () => {
									realSave()
								}   // 确定按钮点击调用函数,非必输
							})
						}
						
					}else{
						realSave()
					}
				}
			})

		}
	  }

	getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
			this.props.cardTable.setTableData(this.tableId, {rows: []})
			this.props.setUrlParam({status: 'browse'})
			toggleShow(this.props)
			this.props.button.setButtonDisabled({
				enable: true,
				disable: true,
				edit:true,
				delete:true,
				print:true,
				output:true,
				refresh:true
			})
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
		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		if(cardData) {
			let enableState = cardData.head[formId].rows[0].values.enablestate.value
			toggleShow(this.props, enableState)
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
					toast({ color: 'success', title: this.state.json['10100PSRC-000025'] });/* 国际化处理： 删除成功！*/
					this.getDataForCache(nextId,() => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
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
				<div className='definition-search'>
				</div>
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
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		const {createCardPagination} = cardPagination;
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
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
						<div className="nc-bill-top-area">  
							<NCAffix>
							{/* //新增div */}
							<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area' style={{paddingRight: 0}}>
								{/* <NCBackBtn className='title-search-detail' style={{'verticle-align': 'middle',display: isShowBack ? 'inline' : 'none'}}
										onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn> */}
								<div className='header-title-search-area'>
									{createBillHeadInfo({
										title:this.state.json['10100PSRC-000019'],
										backBtnClick: this.buttonClick.bind(this,this.props,'back'),
										showBackBtn:status=='browse',
										initShowBackBtn:status=='browse'}
									)}
								</div>
								{/*分页 */}
								{/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
								<div className="header-button-area" style={{marginRight: -30}}>
									{createButtonApp({
										area: 'header-button-area',//按钮注册中的按钮区域
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
									onBeforeEvent: this.onBeforerFormEvent.bind(this),
									onAfterEvent: this.afterEvent.bind(this)
								})}
							</div>
						</div>
						<div className="nc-bill-bottom-area"> 
							<div className="nc-bill-table-area">
								{createCardTable(this.tableId, {
									tableHead: this.getTableHead.bind(this),
									modelSave: this.modelSave.bind(this),
									showIndex:true,
									onBeforeEvent:this.beforeEvent.bind(this),
									onAfterEvent: this.afterEvent.bind(this)
								})}
							</div>
						</div>
						{/* {createModal('delete', {
							title: "注意",
							content: '确认删除？',
							beSureBtnClick: this.delConfirm
						})}
						{createModal('modal', {
							title: "注意",
							content: '是否确认要取消？',
							beSureBtnClick: ()=>{
								console.log('aaa')
							}
						})} */}
						<PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode:'10100PSRC',//小应用编码
							//nodekey:this.props.printNodeKey,//模板节点编码
							nodekey: '',     //模板节点标识
                            oids : this.state.ids,
                            outputType : 'output'
                        }}
                    />
					</div>
			</div>
			
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card',
        pagecode: pageId,
        headcode: formId,
        bodycode: tableId
    },
	initTemplate: initTemplate,
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
export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
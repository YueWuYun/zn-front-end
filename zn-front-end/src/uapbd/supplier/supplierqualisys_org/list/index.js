//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import Setpart from '../../supplierqualisys/list'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax,base,toast,cardCache,cacheTools,getBusinessInfo} from 'nc-lightapp-front';
const {setDefData, getDefData } = cardCache;
const dataSource = "supplierqualisys-list";
const key_list = "key_list";
const key_search = "key_search";
const {NCPopconfirm, NCIcon,NCTabs}=base;
const queryListUrl = '/nccloud/uapbd/supplierqualisys/list.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/pmbase/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/suppliergradesys/del.do';                 //删除url

let config = {
	nodeName: '10140SAQSG-000057',
    nodetype: 'org',
	pageCode: '10140SAQSG_ORG_list',
	pageCodeCard: '10140SAQSG_ORG_listcard',
    appid: '0001Z010000000001NMZ',
    searchId: 'search',
    tableId: 'supqualidoc',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_supqualidoc',
    appcode:'10140SAQSO',
    formId:'supqualidoc',
    template:'10140SAQSG_ORG_list',
    defaultOrg:{}
}
let businessInfo = getBusinessInfo();
let initTemplate =(props) =>{

	let _this = this;
	props.createUIDom(
		{
            pagecode: config.pageCode,//页面id
            // appcode:config.appcode,
			// appid: config.appid//注册按钮的id
		},
		function (data) {console.log('inittemplage');console.log(data);
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
                    props.search.setSearchValByField(config.searchId,'pk_org',{value:businessInfo.groupId,display:businessInfo.groupName});
                    let searchVal = cacheTools.get("searchParams");
                    console.log('searchParams');
                    console.log(searchVal);
                    if(searchVal == null || searchVal == false){
                        searchVal = [];
                    }searchVal = [];
					if(searchVal && searchVal != false || true){
						// searchVal.map((v)=>{
						// 	props.search.setSearchValByField('searchArea',v.field,v.display);
						// 	return v;
						// })
						// props.search.setSearchValue(config.searchId,searchVal);
						let data = {
							conditions: searchVal,
							pageInfo: {
								pageIndex: 0,
								pageSize: 10,
								total: 0,
								totalPage: 0
							},
							pagecode: config.pageId,
							queryAreaCode: config.searchId,  //查询区编码
							oid: config.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                            queryType:'tree',
                            template:config.template
						};
                        let { hasCacheData } = props.table;
                        if(hasCacheData(dataSource)){
                            console.log('使用缓存');
                            return;
                        }
						ajax({
							url: queryListUrl,
							data,
							success: (res) => {
                                console.log('queryListUrl');
                                console.log(res);
                                if(res.data){console.log(11);console.log(res.data[config.tableId]);
                                    setDefData(key_list,dataSource,res.data[config.tableId]);
                                    props.table.setAllTableData(config.tableId, res.data[config.tableId]);
                                    //toast({content:'查询成功，共'+res.data[config.tableId].pageInfo.total+'条数据。',color:'success'});
								}else{
                                    //toast({content:'未查询出符合条件的数据。',color:'warning'});
								}
                            },
							error : (res)=>{
								console.log(res);
							}
						});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
                }
                console.log(data.context);
                props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
			}
		}
	)
}

function modifierMeta(props, meta) {
    	meta[config.searchId].items = meta[config.searchId].items.map((item, key) => {
    		item.col = '3';
    		return item;
        });
        
        //查询参数参照
        let searchItems = meta[config.searchId].items;
        for(let i = 0; i < searchItems.length; i++){
            // if(searchItems[i].attrcode == 'pk_org'){//所属组织
            //     searchItems[i].required = false;
            //     searchItems[i].refcode = '../../../../uapbd/refer/org/BusinessUnitTreeRef/index.js';
            //     if(config.nodetype === 'group'){
            //         searchItems[i].disabled = true;
            //     }
            // }
            if(searchItems[i].attrcode == 'pk_qualitype'){//资质分类
                searchItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';
            }
        }

    	meta[config.tableId].pagination = true;
    	meta[config.tableId].items = meta[config.tableId].items.map((item, key) => {
    		//item.width = 150;
    		if (item.attrcode == 'cmaterialvid') {//
    			item.render = (text, record, index) => {
    				return (
    					<span
    						style={{ textDecoration: 'underline', cursor: 'pointer' }}
    						onClick={() => {
    							let searchVal = props.search.getAllSearchData(searchId);
    							props.CacheTools.set("searchParams",searchVal);
    							props.CacheTools.set('preid',record[config.pk_item].value);
    							props.pushTo('/card', {
									pagecode:props.config.pageCodeCard,
    								status: 'browse',
    								id: record['pk_setpart'].value//列表卡片传参
    							});
    						}}
    					>
    						{record && record['cmaterialvid'] && record['cmaterialvid'].value}
    					</span>
    				);
    			};
    		}
    		return item;
    	});
        //添加操作列
        console.log("meta push");
    	meta[config.tableId].items.push({
    		attrcode: 'opr',
    		label: '操作',
    		width: 200,
    		fixed: 'right',
    		className : 'table-opr',
    		visible: true,
    		render: (text, record, index) => {
    			return (
    				<span>
    					{/* <NCIcon
    						type="uf-pencil-s"
    						onClick={() => {
    							props.linkTo('../card/index.html', {
    								status: 'edit',
    								id: record.crevecontid.value
    							});
    						}}
    					/> */}
    					<span
    						style={{cursor: 'pointer' }}
    						onClick={() => {
    							props.pushTo('/card', {
									pagecode:props.config.pageCodeCard,
    								status: 'browse',
    								id: record[config.pk_item].value
    							});
    						}}
    					>
    						详情
    					</span><span>&nbsp; &nbsp;</span>
    					{/* <NCPopconfirm
    						trigger="click"
    						placement="top"
    						content='确定删除？'
    						onClose={() => {
    							ajax({
    								url: deleteUrl,
    								data: {deleteinfo:[{
    									id: record[config.pk_item].value,
    									ts: record.ts.value
    								}]},
    								success: (res) => {
    									if (res.success) {
    										toast({ color: 'success', content: '删除成功' });
    										props.table.deleteTableRowsByIndex(config.tableId, index);
    									}
    								}
    							});
    						}}
    					>
    						<span style={{cursor: 'pointer' }}>删除</span>
    					</NCPopconfirm> */}
    				</span>
    			);
    		}
    	});
    	return meta;
    }
    
let Setpart_grp = createPage({
	initTemplate: ()=>{}
})(Setpart);

// ReactDOM.render(<Setpart_grp {...{config:config}}/>, document.querySelector('#app'));
export default Setpart_grp
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
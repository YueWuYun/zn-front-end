//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import Setpart from '../../setpart/list'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax,base,toast,cacheTools} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const queryListUrl = '/nccloud/uapbd/setpart/query.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/pmbase/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/setpart/del.do';                 //删除url

let config = {
	nodeName: '成套件-业务单元',
    nodetype: 'org',
    pageCode: '10141487_list',
    pageCodeCard: '10141487_card',
    appid: '0001Z0100000000019BE',
    searchId: 'search',
    tableId: 'ic_setpart',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_setpart',
    formId:'head',
    appcode:'10141486',
    template:'10141487_list'//模板编码
}

let initTemplate =(props) =>{

	let _this = this;
	props.createUIDom(
		{
			pagecode: config.pageCode,//页面id
            // appid: config.appid,//注册按钮的id
            // appcode: config.appcode
		},
		function (data) {console.log('inittemplage');console.log(data);
			if (data) {
				if (data.template) {
					let meta = data.template;
                    meta = modifierMeta(props, meta);
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    props.meta.setMeta(meta);
                    let searchVal = cacheTools.get(config.searchId);
                    if(searchVal != null && searchVal.conditions != null){
                        props.search.setSearchValue(config.searchId,searchVal);
                    }
                    /*let searchVal =props.search.getAllSearchData(config.searchId);
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
							queryType:'tree'
						};
				
						ajax({
							url: queryListUrl,
							data,
							success: (res) => {
                                console.log('queryListUrl');
                                console.log(res);
								if(res.data){console.log(11);console.log(res.data[config.tableId]);
									props.table.setAllTableData(config.tableId, res.data[config.tableId]);
								}else{
									toast({content:"无数据",color:"warning"});
								}
                            },
							error : (res)=>{
								console.log(res);
							}
						});
                    }*/
				}
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
            if(searchItems[i].attrcode == 'cmaterialoid.code'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                searchItems[i].queryCondition = () => {
                    return {setpartsflag : 'Y'};
                };
            }
            if(searchItems[i].attrcode == 'cmaterialoid.name'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                searchItems[i].queryCondition = () => {
                    return {setpartsflag : 'Y'};
                };
            }
            if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                searchItems[i].queryCondition = () => {
                    return {setpartsflag : 'Y'};
                };
            }
            if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid.name'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                searchItems[i].queryCondition = () => {
                    return {setpartsflag : 'Y'};
                };
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
    							let searchVal = props.search.getAllSearchData(config.searchId);
    							// props.CacheTools.set("searchParams",searchVal);
    							// props.CacheTools.set('preid',record[config.pk_item].value);
    							props.pushTo('/card', {
                                    pagecode:props.config.pageCodeCard,
    								status: 'browse',
    								id: record['pk_setpart'].value//列表卡片传参
    							});
    						}}
    					>
    						{record && record['cmaterialvid'] && record['cmaterialvid'].display}
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
    		width: 300,
    		fixed: 'right',
    		className : 'table-opr',
    		visible: true,
    		render: (text, record, index) => {
                // return props.button.createOprationButton(
                //     ['tableedit','tabledel'],
                //     {
                //         area: "table-button-area",
                //         buttonLimit: 3,
                //         onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                //     }
                // )
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
                                // if(record['pk_group'].value != record['pk_org'].value){
                                //     toast({content:"集团节点只能维护当前登录集团的数据！",color:"warning"});
                                //     return;
                                // }
    							// props.linkTo('/uapbd/material/setpart-grp/card/index.html', {
    							// 	status: 'edit',
    							// 	id: record[config.pk_item].value
                                // });
                                props.pushTo('/card', {
                                    status: 'browse',
                                    pagecode:props.config.pageCodeCard,
    								id: record[config.pk_item].value
                                });
    						}}
    					>详情</span>
    					<span
    						style={{cursor: 'pointer' }}
    						onClick={() => {
                                let curOrg = cacheTools.get('curOrg');console.log(curOrg);
                                if(record['pk_org'].value != curOrg){
                                    toast({content:"组织节点只能维护当前节点有权限组织的数据！",color:"warning"});
                                    return;
                                }
    							props.pushTo('/card', {
                                    status: 'edit',
                                    pagecode:props.config.pageCodeCard,
    								id: record[config.pk_item].value
    							});
    						}}
    					>
    						{
                                props.button.createOprationButton(
                                    ['tableedit','tabledel-'],
                                    {
                                        area: "table-button-area",
                                        buttonLimit: 3,
                                        onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                                    }
                                )
                            }
    					</span>
    					<NCPopconfirm
    						trigger="click"
    						placement="top"
    						content='确定删除？'
    						onClose={() => {
                                let curOrg = cacheTools.get('curOrg');console.log(curOrg);
                                if(record['pk_org'].value != curOrg){
                                    toast({content:"组织节点只能维护当前节点有权限组织的数据！",color:"warning"});
                                    return;
                                }
    							ajax({
    								url: deleteUrl,
    								data: {deleteinfo:[{
    									id: record[config.pk_item].value,
    									ts: record.ts.value
    								}]},
    								success: (res) => {
    									if (res.success) {
    										toast({ color: 'success', content: '删除成功' });
                                            let allData = props.table.getAllTableData(config.tableId);
                                            allData.rows.splice(index,1)
                                            allData.allpks.splice(index,1)
                                            props.table.setAllTableData(config.tableId, allData)
    										//props.table.deleteTableRowsByIndex(config.tableId, index);
    									}
    								}
    							});
    						}}
    					>
                            {/* <span style={{cursor: 'pointer' }}>删除</span> */}
                            {
                                props.button.createOprationButton(
                                    ['tableedit-','tabledel'],
                                    {
                                        area: "table-button-area",
                                        buttonLimit: 3,
                                        onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                                    }
                                )
                            }
    					</NCPopconfirm>
    				</span>
    			);
    		}
    	});
    	return meta;
    }

    function tableButtonClick(props, id, text, record, index){return;
        console.log(id);console.log(record);console.log(index);
        let curOrg = cacheTools.get('curOrg');console.log(curOrg);
        if(record['pk_org'].value != curOrg){
            toast({content:"组织节点只能维护当前节点有权限组织的数据！",color:"warning"});
            return;
        }
        switch(id){
            case 'tableedit':
                props.pushTo('/card', {
                    status: 'edit',
                    pagecode:props.config.pageCodeCard,
                    id: record[config.pk_item].value//列表卡片传参
                });
                break;
            case 'tabledel':
                props.modal.show('delete',{
                    color:"warning",
                    title:'提示',
                    content:"确认删除？",
                    beSureBtnClick:()=>{
                        let params = {
                            deleteinfo:[{
                                id: record[config.pk_item].value,
                                ts: record.ts.value
                            }]
                        }
                        ajax({
                            url: deleteUrl,
                            data: params,
                            success: (res) => {
                                toast({color:"success",content:"删除成功"});console.log(index);
                                let allData = props.table.getAllTableData(config.tableId);
                                allData.rows.splice(index,1)
                                allData.allpks.splice(index,1)
                                props.table.setAllTableData(config.tableId, allData)
                                //props.table.deleteTableRowsByIndex(config.tableId,index);
                            }
                        });
                    },
                    cancelBtnClick:()=>{
                        return;
                    }
                });
                break;
            default:
                break;
        }
    }
    
let Setpart_grp = createPage({
	initTemplate: () => {}
})(Setpart);

// ReactDOM.render(<Setpart_grp {...{config:config}}/>, document.querySelector('#app'));
export default Setpart_grp
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
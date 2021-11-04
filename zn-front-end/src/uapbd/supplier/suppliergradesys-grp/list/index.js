//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import Setpart from '../../suppliergradesys/list'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax,base,toast,cacheTools} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const queryListUrl = '/nccloud/uapbd/suppliergradesys/query.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/pmbase/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/suppliergradesys/del.do';                 //删除url

let config = {
	nodeName: '10140SGRADEG-000043',
    nodetype: 'group',
    pageCode: '10140SGRADEG_bsgrade_list',
    appid: '0001Z010000000001L2L',
    searchId: 'search',
    tableId: 'supplier_grade_sys',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_suppliergrade',
    formId:'head',
    appcode:'10140SGRADEG'
}

let initTemplate =(props) =>{

	let _this = this;
	props.createUIDom(
		{
            pagecode: config.pageCode,//页面id
            // appcode: config.appcode,
			// appid: config.appid//注册按钮的id
		},
		function (data) {console.log('inittemplage');console.log(data);
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    let searchVal = cacheTools.get("searchParams");
                    if(searchVal != null){
                        props.search.setSearchValue(config.searchId,searchVal);
                    }
                    // let searchVal = props.search.getAllSearchData("search");
                    // console.log('searchParams');
                    // console.log(searchVal);
                    // if(searchVal == null || searchVal == false){
                    //     searchVal = [];
                    // }
                    //searchVal = [];
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
                                    let data = res.data[config.tableId];
                                    if(data.rows != null && data.rows.length > 0){
                                        this.props.button.setDisabled({
                                            print: false,
                                            output: false,
                                        });
                                    }else{
                                        this.props.button.setDisabled({
                                            print: true,
                                            output: true,
                                        });
                                    }
                                    for(let i = 0; i < data.rows.length; i++){
                                        if(data.rows[i].values['enablestate'].value == '2'){
                                            data.rows[i].values['enablestate'].value = true;
                                        }else{
                                            data.rows[i].values['enablestate'].value = false;
                                        }
                                    }
									props.table.setAllTableData(config.tableId, data);
								}else{
                                    //toast({content:"无数据",color:"warning"});
                                    this.props.button.setDisabled({
                                        print: true,
                                        output: true,
                                    });
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
                props.button.setPopContent('tabledel','确认删除？')
			}
		}
	)
}
function tableButtonClick(props, id, text, record, index){
    console.log(record);
    if(id == 'tableedit'){
        props.pushTo('/card', {
			pagecode:'10140SGRADEG_bsgrade_card',
            status: 'edit',
            id: record[config.pk_item].value
        });
    }
    if(id == 'tabledel'){
            // return(
            //     <NCPopconfirm
            //         trigger="click"
            //         placement="top"
            //         content='确定删除？'
            //         onClose={() => {
                        ajax({
                            url: deleteUrl,
                            data: {deleteinfo:[{
                                id: record[config.pk_item].value,
                                ts: record.ts.value
                            }]},
                            success: (res) => {
                                if (res.success) {
                                    toast({ color: 'success', title: '删除成功！' });
                                    props.table.deleteTableRowsByIndex(config.tableId, index);
                                }
                            }
                        });
                //     }}
                // ></NCPopconfirm>
            // )
        };
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
            }
            if(searchItems[i].attrcode == 'cmaterialoid.name'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
            }
            if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
            }
            if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid.name'){//物料编码
                searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
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
									status: 'browse',
									pagecode:'10140SGRADEG_bsgrade_card',
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
    		label: '操作',
            attrcode: 'opr',
            key: 'opr',
            itemtype: 'customer',
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
                                console.log(record);
    							props.pushTo('/card', {
									status: 'browse',
									pagecode:'10140SGRADEG_bsgrade_card',
    								id: record[config.pk_item].value
    							});
    						}}
    					>
    						<a>详情</a>
    					</span><span>&nbsp; &nbsp;</span>
                        <span
    						style={{cursor: 'pointer' }}
    						onClick={() => {
                                console.log(record);
    							props.pushTo('/card', {
									status: 'edit',
									pagecode:'10140SGRADEG_bsgrade_card',
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
    					</span><span>&nbsp;</span>
    					<NCPopconfirm
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
    						<span style={{cursor: 'pointer' }}>
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
                            </span>
    					</NCPopconfirm>
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
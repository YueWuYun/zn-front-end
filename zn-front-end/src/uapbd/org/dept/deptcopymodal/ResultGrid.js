//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {base,ajax,createPage } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl,NCPagination  } = base;
import Table from '../../../public/excomponents/Table.js';

var EMPTY_FN = function(){};

let urls={
    querydepts:''
}
;
let tableid='dept';
let  listpagecode='10100DEPT_copy';
let appid='0001Z0100000000081E1';

class ResultGrid extends Component {

    constructor(props) {
        super(props);
        this.loadMeta(()=>{
            //无论何时，该组件表单状态都是可编辑态
            this.props.editTable.setStatus(tableid, 'edit');
            if(this.props.config.resultData.pk_depts.length==0||this.props.config.resultData.curOrg.refpk.length==0){
                return 
            }
            ajax({
                url: '/nccloud/baseapp/dept/copyqry.do',
                data: {
                pk_depts:this.props.config.resultData.pk_depts
                },
                success:(result) => {
                    let { success, data } = result;
                    if (success) {
                        //适配显示公式
						if(result.formulamsg&&result.formulamsg instanceof Array&&result.formulamsg.length>0){
							this.props.dealFormulamsg(
								result.formulamsg,
								{
									tableid:"editTable"
								}
							);
						}

                        //处理显示顺序为999999的数据
                        data[tableid].rows.forEach((row)=>{
                            row.values['displayorder'].value=row.values['displayorder'].value=='999999'?null:row.values['displayorder'].value
                        });
                        //let data=this.props.editTable.getAllData('dept');
                        data[tableid].rows.forEach( (row) => {
                            row.values['pk_org'].value=this.props.config.resultData.curOrg.refpk;
                            row.values['pk_org'].display=this.props.config.resultData.curOrg.refname;
                        } );
                        this.props.editTable.setTableData(tableid, data[tableid]);
                        this.props.editTable.setStatus(tableid, 'edit');
                    }
                }
            });
        });
    }

    loadMeta(initData){
        let prop=this.props;
        prop.createUIDom({
            pagecode : listpagecode
        },
        (data)=>{
            let meta=data.template;
            let principalItem = meta['dept'].items.find(item => item.attrcode === 'principal');
            principalItem.isShowUnit = true;
            principalItem.unitCondition = () => {
                return {
                    "isMutiGroup": "Y"
                }
            };
    
            let fatherDeptItem = meta['dept'].items.find(item => item.attrcode === 'pk_fatherorg');
            fatherDeptItem.isShowUnit = false;
            /*fatherDeptItem.unitCondition = () => {
                return {
                    "isMutiGroup": "N"
                }
            };*/
            fatherDeptItem.queryCondition = () => {
                return {
                    "pk_org": prop.config.resultData.curOrg.refpk
                }
            };
    
            let pk_org = meta['dept'].items.find(item => item.attrcode === 'pk_org');
            pk_org.disabled=true;
    
            prop.meta.setMeta(data.template);

            initData();
        });
    }

    render() {
        const {editTable} = this.props;
        let { createEditTable } = editTable;  //模态框
        return (
            <div className="table-area">
				{createEditTable(tableid, {//列表区
					//onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
                    useFixedHeader:true,
                    height: "320px",
					//selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
					//statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
					showIndex:true,				//显示序号
					//showCheck:true			//显示复选框
					//params: 'test',                                  // 自定义传参
				})}
			</div>
        )
    }
}


export default ResultGrid = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:listpagecode,
        bodycode:tableid
    },
    initTemplate: ()=>{},
})(ResultGrid)

//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
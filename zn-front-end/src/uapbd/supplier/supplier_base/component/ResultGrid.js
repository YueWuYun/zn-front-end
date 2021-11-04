//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {component} from '../../../public/platwapper/index.js';
const {NCButton} = component;
class SupAssignResultGrid extends Component {
    constructor(props) {
        super(props);
        this.pageInfoClick = this.props.pageInfoClick || function(){};
        this.state = {
            btnCheckedAll:{
                id:'btnCheckedAll',
                onClick: () =>{
                  this.onSelectedAllPage(true);
                }
            },
            btnUnCheckedAll:{
                id:'btnUnCheckedAll',
                onClick: () =>{
                  this.onSelectedAllPage(false);
                }
            },
            btnCurPageCheck:{
                id:'btnCurPageCheck',
                onClick: () =>{
                    this.onSelectedCurPage(true);
                  }
            },
            btnCurPageUnCheck:{
                id:'btnCurPageUnCheck',
                onClick: () =>{
                    this.onSelectedCurPage(false);
                  }
            },
            selectpks: [], //选中的pk集合,
            allpks: []      //所有的PK;
        };
    }

  
    onSelected(props,moduleId,record,index,status){
        var pk = record.pk_supplier.value;
        if(status){
            this.state.selectpks = [...this.state.selectpks, pk];
        }else{
            this.state.selectpks =  this.state.selectpks.filter(d => d != pk);
        }
        this.setState(this.state,() => {
            this.renderCheckData();
        });
      }
  
    onSelectedPage(props, moduleId, status, length){
        setTimeout(() => {//平台bug 没有setState
            var datas = this.props.table.getAllTableData('assign_supplier_baseInfo').rows;
            var pks = datas.map( d => {
                    return d.values.pk_supplier.value;
            });
           
            if(status){
                pks = pks.filter(d =>  this.state.selectpks.indexOf(d) == -1);
                this.state.selectpks = [... this.state.selectpks, ...pks];
            }else{
                this.state.selectpks =  this.selectpks.filter(d =>  pks.indexOf(d) != -1);
            }
            this.setState(this.state,() => {
                this.renderCheckData();
            });
        }, 0);
    }
    onSelectedAllPage(checked){
        debugger
        this.state.selectpks = checked ? this.state.allpks : [];
        this.setState(this.state,() => {
            this.renderCheckData();
        });
    }

    // update bu yufwm 2020-03-17 添加 data null 校验
    afterDataUpdate(data, page){
        if(!page){ //如果page=true,是分页加载数据, page=false是按条件重新查询了数据,此时情况allpks和selectpks
            this.state.selectpks = [];
            this.state.allpks =data && data.assign_supplier_baseInfo.allpks;
        }
        this.setState(this.state, () =>{//设置check值
            this.renderCheckData();
        });
    }

    

    renderCheckData(){
        debugger
        var datas = this.props.table.getAllTableData('assign_supplier_baseInfo').rows;
        var indexs = []; //获取index
        datas.forEach((d, index) => { 
            if(this.state.selectpks.indexOf(d.values.pk_supplier.value) != -1){
              indexs.push(index);
            }
        });
        this.props.table.selectAllRows('assign_supplier_baseInfo', false);
        this.props.table.selectTableRows('assign_supplier_baseInfo', indexs, true);
    }
    /**
     * 获得选中的行
     */
    getCheckedRows = ()=>{
       //return this.props.table.getCheckedRows('assign_supplier_baseInfo');

       var pks =  this.state.selectpks || [];
       return pks.map(pk => {
           var row = {
                data:{
                    values: {
                        pk_supplier:{
                            value: pk
                        },
                        ts:{
                            value: 0
                        }
                    }
               }
           };
           return row;
       });
    }
    /**
     * 选择当前页
     */
    onSelectedCurPage = (curPageChecked)=>{
        this.props.table.selectAllRows('assign_supplier_baseInfo',curPageChecked);
        if(curPageChecked){
            this.props.table.getCheckedRows('assign_supplier_baseInfo').forEach((e)=>{
                this.state.selectpks.push(e.data.values.pk_supplier.value);
            })
        }else{
            this.state.selectpks = new Array();
        }
        this.setState(this.state,()=>{
            this.renderCheckData();
        });
    }


    // update by yufwm 2020-03-20 获取选中数据方法 修改
    getSelectedData = () =>{
        // let tableData = this.props.table.getCheckedRows('assign_supplier_baseInfo');

        // let pks = [];
        // tableData.forEach(row => {
        //     pks.push(row.data.values['pk_supplier'].value);
        // });
        // return pks;

        return this.state.selectpks;
    }
    render() {
        const {table} = this.props;
        const{createSimpleTable} = table;
        return (
            <div className="nc-singleTable-table-area">
                <div style={{width:'100%',height:'30px','margin-bottom':'5px','margin-top':'5px'}}>
                        <NCButton {...this.state.btnCheckedAll   }>{this.props.Lang['10140SUG-000041']/* 国际化处理： 全部选择*/}</NCButton>
                        <NCButton {...this.state.btnUnCheckedAll }>{this.props.Lang['10140SUG-000042']/* 国际化处理： 全部取消*/}</NCButton>
                        <NCButton {...this.state.btnCurPageCheck}>{this.props.Lang['10140SUG-000201']/* 国际化处理： 本页选择*/}</NCButton>
                        <NCButton {...this.state.btnCurPageUnCheck}>{this.props.Lang['10140SUG-000202']/* 国际化处理： 本页取消*/}</NCButton>
                </div>
                {createSimpleTable('assign_supplier_baseInfo', {
                    showIndex:true,
                    showCheck:true,
                    onSelected:this.onSelected.bind(this),
                    onSelectedAll:this.onSelectedPage.bind(this),
                    handlePageInfoChange: () =>{
                        this.pageInfoClick(...arguments);
                    }
                })}
            </div>
        )
    }
}
export default SupAssignResultGrid;

//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
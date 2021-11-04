//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
import React, { Component } from 'react';
import { base, ajax } from 'nc-lightapp-front';
const {NCTable,NCMessage,} = base;
*/

import React, { Component } from "react";
import {base,ajax,toast,getMultiLang,createPage,createPageIcon} from 'nc-lightapp-front';
//const { ColumnGroup, Column } = Table;
import AccSystem from '../../../refer/fiacc/AccSystemGridRef/index.js';
import AccChart from '../../../refer/fiacc/AccChartTreeRef/index.js'
import './index.less'
import createUIDom from '../../../public/utils/BDCreateUIDom';
const {NCTable,NCSelect,NCOption,NCButton,NCModal,NCCheckbox,NCAffix,NCDiv} = base;




let urls={
    queryVersionUrl:'/nccloud/uapbd/accchartcmp/QueryAllVersionAction.do',
    accChartCompareUrl:'/nccloud/uapbd/accchartcmp/AccchartCompareAction.do',
    accChartAccCompareUrl:'/nccloud/uapbd/accchartcmp/AccchartAccCompareAction.do',
};

class AccChartCmp extends Component {

    constructor(props){
        super(props);
        this.props = props;
        this.columns = [];
        this.modalColumns = [];
        this.state={
            doubleClickIndex : null,
            json:{},
            lVersionData:{//记录下左版本数据
                placeholder:'',/* 国际化处理： 版本一*/
                datas:[],
                value: undefined,
                onChange: (value) => {
                    this.state.lVersionData.value = value;
                    this.setState(this.state);
                },
                renderOption: function() {
                    return this.datas.map( (d) => {
                        return <Option value={d.value}>{d.name}</Option>
                    });
                }                
            },
            rVersionData:{//记录下右版本数据
                placeholder:'',/* 国际化处理： 版本二*/
                datas:[],
                value: undefined,
                onChange: (value) => {
                    this.state.rVersionData.value = value;
                    this.setState(this.state);
                },
                renderOption: function() {
                    return this.datas.map( (d) => {
                        return <Option value={d.value}>{d.name}</Option>
                    });
                }      
            },
            curAccSystem:'',//科目体系参照
            curAccChart:'',//科目表参照
            curSelTableIndex:'',//当前表中选中的数据的次序，主要是被用于科目对比这个按钮使用；
            chartTableData:[],//科目表数据，
            selectedRow:undefined,//记录选中行，用来显示变色；
            modalTableData:[],//弹出模态框中的数据；
            originChartData:[],//后台返回的查询出来的数据，用于弹出模态框的数据做字典；
            chartCond: function(){//这个用来做科目体系的查询条件，
                return {};
            },
            selCond:function(){//这个用来做科目表的查询条件；
                return {};
            },
            showModal:false,
            
            inlt:null
        }; 
        this.props.MultiInit.getMultiLang({              
        moduleId: "10140ACCCB",
        domainName: 'uapbd',
        callback: (data, success,inlt)=>{
            if(!success){
                toast({content:'load muti lang error',color:'warning'});
            }
            this.state.json = data;
            this.state.lVersionData.placeholder = this.state.json['10140ACCCB-000000'];
            this.state.rVersionData.placeholder = this.state.json['10140ACCCB-000001'];
            this.columns = [

                {
                  title: this.state.json['10140ACCCB-000002'],/* 国际化处理： 版本1*/
                  children: [
                    {
                      title: (<div fieldid='lcode'>{this.state.json['10140ACCCB-000003']}</div>),/* 国际化处理： 科目编码*/
                      dataIndex: "lcode",
                      key: "lcode",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='lcode' style={{color:'red'}}>{item.lcode}</div>
                          }else{
                              return <div fieldid='lcode'>{item.lcode}</div>;
                          }
                      }           
                    },
                    {
                      title: (<div fieldid='lname'>{this.state.json['10140ACCCB-000004']}</div>),/* 国际化处理： 科目名称*/
                    //   title: this.state.json['10140ACCCB-000004'],
                      dataIndex: "lname",
                      key: "lname",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='lname' style={{color:'red'}}>{item.lname}</div>
                          }else{
                              return <div fieldid='lname'>{item.lname}</div>;
                          }
                      }        
                    },
                    {
                      title: (<div fieldid='laccassname'>{this.state.json['10140ACCCB-000005']}</div>),/* 国际化处理： 辅助核算项*/
                    //   title: this.state.json['10140ACCCB-000005'],
                      dataIndex: "laccassname",
                      key: "laccassname",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='laccassname' style={{color:'red'}}>{item.laccassname?item.laccassname:<span >&nbsp;</span>}</div>
                          }else{
                              return <div fieldid='laccassname'>{item.laccassname?item.laccassname:<span >&nbsp;</span>}</div>;
                          }
                      }
                    }       
                  ]
                },
                {
                  title: this.state.json['10140ACCCB-000006'],/* 国际化处理： 版本2*/
                  children: [
                    {
                      title: (<div fieldid='rcode'>{this.state.json['10140ACCCB-000003']}</div>),/* 国际化处理： 科目编码*/
                      // title: this.state.json['10140ACCCB-000003'],
                      dataIndex: "rcode",
                      key: "rcode",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='rcode' style={{color:'red'}}>{item.rcode}</div>
                          }else{
                              return <div fieldid='rcode'>{item.rcode}</div>;
                          }
                      }            
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000004'],
                      title: (<div fieldid='rname'>{this.state.json['10140ACCCB-000004']}</div>),/* 国际化处理： 科目名称*/
                      dataIndex: "rname",
                      key: "rname",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='rname' style={{color:'red'}}>{item.rname}</div>
                          }else{
                              return <div fieldid='rname'>{item.rname}</div>;
                          }
                      }            
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000005'],
                      title: (<div fieldid='raccassname'>{this.state.json['10140ACCCB-000005']}</div>),/* 国际化处理： 辅助核算项*/
                      dataIndex: "raccassname",
                      key: "raccassname",
                      width: 200,
                      render:(index, item)=>{
                          if(!item.isRowEqual){
                          return <div fieldid='raccassname' style={{color:'red'}}>{item.raccassname?item.raccassname:<span >&nbsp;</span>}</div>
                          }else{
                              return <div fieldid='raccassname'>{item.raccassname?item.raccassname:<span >&nbsp;</span>}</div>;
                          }
                      }        
                    },            
              
                  ]
                }
              
              ];
            this.modalColumns=[
                  {
                    //   title: this.state.json['10140ACCCB-000007'],
                      title: (<div fieldid='versioninfo'>{this.state.json['10140ACCCB-000007']}</div>),/* 国际化处理： 版本信息*/
                      dataIndex: "versioninfo",
                      key: "versioninfo",
                      width: 200,
                      render : (text,record,index)=><div fielded='versioninfo'>{text?text:<span >&nbsp;</span>}</div>
                    },
                  {
                    //   title: this.state.json['10140ACCCB-000003'],
                      title: (<div fieldid='code'>{this.state.json['10140ACCCB-000003']}</div>),/* 国际化处理： 科目编码*/
                      dataIndex: "code",
                      key: "code",
                      width: 200,
                      render : (text,record,index)=><div fielded='code'>{text?text:<span >&nbsp;</span>}</div>
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000004'],
                      title: (<div fieldid='name'>{this.state.json['10140ACCCB-000004']}</div>),/* 国际化处理： 科目名称*/
                      dataIndex: "name",
                      key: "name",
                      width: 200,
                      render : (text,record,index)=><div fielded='name'>{text?text:<span >&nbsp;</span>}</div>
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000008'],
                      title: (<div fieldid='pk_acctype'>{this.state.json['10140ACCCB-000008']}</div>),/* 国际化处理： 科目类型*/
                      dataIndex: "pk_acctype",
                      key: "pk_acctype",
                      width: 200,
                      render : (text,record,index)=><div fielded='pk_acctype'>{text?text:<span >&nbsp;</span>}</div>
                    },  
                    {
                    //   title: this.state.json['10140ACCCB-000009'],
                      title: (<div fieldid='cashtype'>{this.state.json['10140ACCCB-000009']}</div>),/* 国际化处理： 现金分类*/
                      dataIndex: "cashtype",
                      key: "cashtype",
                      width: 200,
                      render : (text,record,index)=><div fielded='cashtype'>{text?text:<span >&nbsp;</span>}</div>
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000010'],
                      title: (<div fieldid='remcode'>{this.state.json['10140ACCCB-000010']}</div>),/* 国际化处理： 助记码*/
                      dataIndex: "remcode",
                      key: "remcode",
                      width: 200,
                      render : (text,record,index)=><div fielded='remcode'>{text?text:<span >&nbsp;</span>}</div>
                    }, 
                    {
                    //   title: this.state.json['10140ACCCB-000011'],
                      title: (<div fieldid='balanorient'>{this.state.json['10140ACCCB-000011']}</div>),/* 国际化处理： 科目方向*/
                      dataIndex: "balanorient",
                      key: "balanorient",
                      width: 200,
                      render : (text,record,index)=><div fielded='balanorient'>{text?text:<span >&nbsp;</span>}</div>
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000012'],
                      title: (<div fieldid='currency'>{this.state.json['10140ACCCB-000012']}</div>),/* 国际化处理： 默认币种*/
                      dataIndex: "currency",
                      key: "currency",
                      width: 200,
                      render : (text,record,index)=><div fielded='currency'>{text?text:<span >&nbsp;</span>}</div>
                    },   
                    {
                    //   title: this.state.json['10140ACCCB-000013'],
                      title: (<div fieldid='incurflag'>{this.state.json['10140ACCCB-000013']}</div>),/* 国际化处理： 发生额方向控制*/
                      dataIndex: "incurflag",
                      key: "incurflag",
                      width: 200,
                      render:(text,record,index)=>(
                        <div fieldid='incurflag'>  
                          <NCCheckbox
                              checked={record.incurflag}
                              disabled='false'
                              >
                          </NCCheckbox>
                        </div>
                  )
                    },   
                    {
                    //   title: this.state.json['10140ACCCB-000014'],
                      title: (<div fieldid='balanflag'>{this.state.json['10140ACCCB-000014']}</div>),/* 国际化处理： 余额方向控制*/
                      dataIndex: "balanflag",
                      key: "balanflag",
                      width: 200,
                      render:(text,record,index)=>(
                        <div fieldid='balanflag'>  
                          <NCCheckbox
                              checked={record.balanflag}
                              disabled='false'
                              >
                          </NCCheckbox>  
                        </div>
                      )      
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000015'],
                      title: (<div fieldid='bothorient'>{this.state.json['10140ACCCB-000015']}</div>),/* 国际化处理： 账簿余额双向显示*/
                      dataIndex: "bothorient",
                      key: "bothorient",
                      width: 200,
                      render:(text,record,index)=>(
                          <div fieldid='bothorient'>
                              <NCCheckbox
                                  checked={record.bothorient}
                                  disabled='false'
                                  >
                              </NCCheckbox>
                           </div> 
                      )
                    },  
                    {
                    //   title: this.state.json['10140ACCCB-000016'],
                      title: (<div fieldid='outflag'>{this.state.json['10140ACCCB-000016']}</div>),/* 国际化处理： 表外科目*/
                      dataIndex: "outflag",
                      key: "outflag",
                      width: 200,
                      render:(text,record,index)=>(
                        <div fieldid='outflag'> 
                          <NCCheckbox
                              checked={record.outflag}
                              disabled='false'
                              >
                          </NCCheckbox>
                        </div> 
                  )        
                    },
                    {
                    //   title: this.state.json['10140ACCCB-000017'],
                      title: (<div fieldid='allowclose'>{this.state.json['10140ACCCB-000017']}</div>),/* 国际化处理： 提前关账*/
                      dataIndex: "allowclose",
                      key: "allowclose",
                      width: 200,
                      render:(text,record,index)=>(
                        <div fieldid='allowclose'>   
                          <NCCheckbox
                              checked={record.allowclose}
                              disabled='false'
                              >
                          </NCCheckbox>
                        </div> 
                  )            
                    },    
                    {
                    //   title: this.state.json['10140ACCCB-000018'],
                      title: (<div fieldid='unit'>{this.state.json['10140ACCCB-000018']}</div>),/* 国际化处理： 默认计量单位*/
                      dataIndex: "unit",
                      key: "unit",
                      width: 200,
                      render : (text,record,index)=><div fielded='unit'>{text?text:<span >&nbsp;</span>}</div>
                    },  
                    {
                    //   title: this.state.json['10140ACCCB-000019'],
                      title: (<div fieldid='sumprint_level'>{this.state.json['10140ACCCB-000019']}</div>),/* 国际化处理： 汇总打印级次*/
                      dataIndex: "sumprint_level",
                      key: "sumprint_level",
                      width: 200,
                      render : (text,record,index)=><div fielded='sumprint_level'>{text?text:<span >&nbsp;</span>}</div>
                    },  
                    {
                    //   title: this.state.json['10140ACCCB-000020'],
                      title: (<div fieldid='enablestate'>{this.state.json['10140ACCCB-000020']}</div>),/* 国际化处理： 启用状态*/
                      dataIndex: "enablestate",
                      key: "enablestate",
                      width: 200,
                      render : (text,record,index)=><div fielded='enablestate'>{text?text:<span >&nbsp;</span>}</div>
                    }, 
                    {
                    //   title: this.state.json['10140ACCCB-000021'],
                      title: (<div fieldid='accassname'>{this.state.json['10140ACCCB-000021']}</div>),/* 国际化处理： 辅助核算*/
                      dataIndex: "accassname",
                      key: "accassname",
                      width: 200,
                      render : (text,record,index)=><div fielded='accassname'>{text?text:<span >&nbsp;</span>}</div>
                    },   
                    {
                    //   title: this.state.json['10140ACCCB-000022'],
                      title: (<div fieldid='ctrlmodulename'>{this.state.json['10140ACCCB-000022']}</div>),/* 国际化处理： 受控模块*/
                      dataIndex: "ctrlmodulename",
                      key: "ctrlmodulename",
                      width: 200,
                      render : (text,record,index)=><div fielded='ctrlmodulename'>{text?text:<span >&nbsp;</span>}</div>
                    },                                         
              ]
            this.init = true;
			this.setState(this.state,()=>{
                });  
                }
            });
        }           

onCloseModal(){
    this.setState({curSelTableIndex: '',selectedRow: undefined,showModal:false});//关闭模态框以后将当前选中数据设置为空；
}

    loadAllVersion(){
        ajax({
            loading: true,
            url:urls.queryVersionUrl, 
            data: {
                pk_accchart:this.state.curAccChart.refpk,
            }, 
            success: (res) => {
                if(res.hasOwnProperty("data")){
                  let  retVersions = [];
                res.data.forEach(
                    (ele,i)=>{
                        retVersions.push(ele);
                });
                //console.log(res);
                this.state.lVersionData.datas = retVersions;
                this.state.rVersionData.datas = retVersions;
                this.setState(this.state);  
                //这里将当前查询到的版本信息加载到NCSelect中            
            }

            }
        });   
    }
    onSysChange(value){

        this.state.curAccSystem = value;
        this.state.curAccChart = '';
        this.state.chartCond = ()=>{
            return {
                pk_accsystem : value ? value.refpk : '',
                TreeRefActionExt:'nccloud.web.uapbd.accchartcmp.action.AccChartRefExt2',
            }           
        };
        this.state.lVersionData.datas = [];
        this.state.lVersionData.value = undefined;
        this.state.rVersionData.datas = [];
        this.state.rVersionData.value = undefined;
        this.state.chartTableData = [];//清空表数据；        
        this.setState(this.state);

    }
    onChartChange(value){
        /*这里需要做两个动作：
        *1，从后台查询当前科目表的版本信息
        *2，将查询出来的数据
        */
       this.state.curAccChart = value;
       this.state.lVersionData.datas = [];
       this.state.lVersionData.value = undefined;
       this.state.rVersionData.datas = [];
       this.state.rVersionData.value = undefined;
       this.state.chartTableData = [];//清空表数据
        this.setState(this.state);
        setTimeout(()=>this.loadAllVersion(),10);
    }
    onAccchartCompare(){
        let isLRSel = (this.state.lVersionData.value !== undefined && this.state.rVersionData.value !== undefined);
        if(isLRSel)
        {
            let isLREqual = (this.state.lVersionData.value === this.state.rVersionData.value);
            if(isLREqual){
                toast({color:'warning',content:this.state.json['10140ACCCB-000023']});/* 国际化处理： 请选择不同的版本进行比较！*/
                return;
            }
        }else{
            toast({color:'warning',content:this.state.json['10140ACCCB-000024']});/* 国际化处理： 请选择科目表版本进行比较！*/
            return;
        }
        ajax({
            loading: true,
            url:urls.accChartCompareUrl, 
            data: {
                pk_laccchart:this.state.lVersionData.value,
                pk_raccchart:this.state.rVersionData.value,
            }, 
            success: (res) => {
                if(res.data  ){
                  let  retVersions = [];
                res.data.forEach(
                    (ele,i)=>{
                        let crow = {
                        lcode:ele.leftVO && ele.leftVO.code  ? ele.leftVO.code :"",
                        lname:ele.leftVO && ele.leftVO.name ? ele.leftVO.name :"",
                        laccassname:ele.leftVO && ele.leftVO.accassname ? ele.leftVO.accassname :"",
                        rcode:ele.rightVO && ele.rightVO.code ? ele.rightVO.code :"",
                        rname:ele.rightVO  && ele.rightVO.name ? ele.rightVO.name :"",
                        raccassname:ele.rightVO && ele.rightVO.accassname ? ele.rightVO.accassname :"",}; 
                        //let isRowEqual =(crow.lcode === crow.rcode && crow.lname === crow.rname && crow.laccassname === crow.raccassname);                       
                        let isRowEqual = this.checkEqual(ele);//检验一下左右两边数据是否一致，
                        crow.isRowEqual = isRowEqual;
                        retVersions.push(crow);
                });
                //console.log(res);
                this.setState({chartTableData:retVersions,originChartData:res.data});              
            }

            }
        });         

    }
    checkEqual(item){//检验一下左右两边的数据是否一致；
        let leftPart ={
            code:item.leftVO && item.leftVO.code? item.leftVO.code :"",
            name:item.leftVO && item.leftVO.name ? item.leftVO.name :"",
            pk_acctype:item.leftVO && item.leftVO.pk_acctype ? item.leftVO.pk_acctype :"",
            cashtype:Object.keys(item.leftMap).length  > 0 && item.leftMap.cashtype ? item.leftMap.cashtype :"",
            remcode:item.leftVO && item.leftVO.item ? item.leftVO.item : "",
            balanorient:Object.keys(item.leftMap).length >0 && item.leftMap.balanorient  ?item.leftMap.balanorient :"",
            currency:item.leftVO && item.leftVO.currency? item.leftVO.currency :"",
            incurflag:item.leftVO && item.leftVO.incurflag? item.leftVO.incurflag :"",
            balanflag:item.leftVO && item.leftVO.balanflag? item.leftVO.balanflag :"",
            bothorient:item.leftVO && item.leftVO.bothorient ? item.leftVO.bothorient :"",
            outflag:item.leftVO && item.leftVO.outflag ? item.leftVO.outflag :"",
            allowclose:item.leftVO && item.leftVO.allowclose ? item.leftVO.allowclose :"",
            unit:item.leftVO && item.leftVO.unit ?item.leftVO.unit :"",
            sumprint_level:Object.keys(item.leftMap).length >0 &&  item.leftMap.sumprint_level ? item.leftMap.sumprint_level :"",
            enablestate:Object.keys(item.leftMap).length >0 && item.leftMap.enablestate ? item.leftMap.enablestate :"",
            accassname:item.leftVO && item.leftVO.accassname ? item.leftVO.accassname :"",
            ctrlmodulename:item.leftVO && item.leftVO.ctrlmodulename? item.leftVO.ctrlmodulename :"",
        };
        let rightPart={
            code:item.rightVO && item.rightVO.code? item.rightVO.code :"",
            name:item.rightVO && item.rightVO.name ? item.rightVO.name :"",
            pk_acctype:item.rightVO && item.rightVO.pk_acctype ? item.rightVO.pk_acctype :"",
            cashtype:Object.keys(item.rightMap).length  > 0 && item.rightMap.cashtype ? item.rightMap.cashtype :"",
            remcode:item.rightVO && item.rightVO.item ? item.rightVO.item : "",
            balanorient:Object.keys(item.rightMap).length >0 && item.rightMap.balanorient  ?item.rightMap.balanorient :"",
            currency:item.rightVO && item.rightVO.currency? item.rightVO.currency :"",
            incurflag:item.rightVO && item.rightVO.incurflag? item.rightVO.incurflag :"",
            balanflag:item.rightVO && item.rightVO.balanflag? item.rightVO.balanflag :"",
            bothorient:item.rightVO && item.rightVO.bothorient ? item.rightVO.bothorient :"",
            outflag:item.rightVO && item.rightVO.outflag ? item.rightVO.outflag :"",
            allowclose:item.rightVO && item.rightVO.allowclose ? item.rightVO.allowclose :"",
            unit:item.rightVO && item.rightVO.unit ?item.rightVO.unit :"",
            sumprint_level:Object.keys(item.rightMap).length >0 &&  item.rightMap.sumprint_level ? item.rightMap.sumprint_level :"",
            enablestate:Object.keys(item.rightMap).length >0 && item.rightMap.enablestate ? item.rightMap.enablestate :"",
            accassname:item.rightVO && item.rightVO.accassname ? item.rightVO.accassname :"",
            ctrlmodulename:item.rightVO && item.rightVO.ctrlmodulename? item.rightVO.ctrlmodulename :"",
        }
        let isEqual = (
            leftPart.code === rightPart.code &&
            leftPart.name === rightPart.name &&
            leftPart.pk_acctype === rightPart.pk_acctype &&
            leftPart.cashtype === rightPart.cashtype &&
            leftPart.remcode === rightPart.remcode &&
            leftPart.balanorient === rightPart.balanorient &&
            leftPart.currency === rightPart.currency &&
            leftPart.incurflag === rightPart.incurflag &&
            leftPart.balanflag === rightPart.balanflag &&
            leftPart.bothorient === rightPart.bothorient &&
            leftPart.outflag === rightPart.outflag &&
            leftPart.allowclose === rightPart.allowclose &&
            leftPart.unit === rightPart.unit &&
            leftPart.sumprint_level === rightPart.sumprint_level &&
            leftPart.enablestate === rightPart.enablestate &&
            leftPart.accassname === rightPart.accassname &&
            leftPart.ctrlmodulename === rightPart.ctrlmodulename 
        );
        return isEqual;

    }
    onAccchartAccCompare(){
        //let isData = (this.state.chartTableData.length === 0);
        if(!this.state.selectedRow){
            toast({color:'warning',content:this.state.json['10140ACCCB-000025']});/* 国际化处理： 请选择比较数据！*/
            return;
        }
        let curInd = this.state.curSelTableIndex;
        this.modalTableProcess(curInd);
    }
    modalTableProcess(index){
        //根据当前选中的次序，设置模态框中显示的数据；
        let curSelData = this.state.originChartData[index];
        let firstRow ={
            versioninfo:this.state.json['10140ACCCB-000002'],/* 国际化处理： 版本1*/
            code:curSelData.leftVO && curSelData.leftVO.code ? curSelData.leftVO.code :"",
            name:curSelData.leftVO && curSelData.leftVO.name  ? curSelData.leftVO.name :"",
            pk_acctype:curSelData.leftVO && curSelData.leftVO.pk_acctype ? curSelData.leftVO.pk_acctype :"",
            cashtype:Object.keys(curSelData.leftMap).length >0 && curSelData.leftMap.cashtype ? curSelData.leftMap.cashtype :"",
            remcode:curSelData.leftVO && curSelData.leftVO.curSelData? curSelData.leftVO.curSelData :"",
            balanorient:Object.keys(curSelData.leftMap).length >0 && curSelData.leftMap.balanorient ? curSelData.leftMap.balanorient:"",
            currency:curSelData.leftVO && curSelData.leftVO.currency ? curSelData.leftVO.currency :"",
            incurflag:curSelData.leftVO && curSelData.leftVO.incurflag ? curSelData.leftVO.incurflag :"",
            balanflag:curSelData.leftVO && curSelData.leftVO.balanflag ? curSelData.leftVO.balanflag :"",
            bothorient:curSelData.leftVO && curSelData.leftVO.bothorient ? curSelData.leftVO.bothorient :"",
            outflag:curSelData.leftVO &&  curSelData.leftVO.outflag ? curSelData.leftVO.outflag :"",
            allowclose:curSelData.leftVO && curSelData.leftVO.allowclose ? curSelData.leftVO.allowclose :"",
            unit:curSelData.leftVO  && curSelData.leftVO.unit ? curSelData.leftVO.unit :"",
            sumprint_level:Object.keys(curSelData.leftMap).length  > 0 && curSelData.leftMap.sumprint_level? curSelData.leftMap.sumprint_level: "",
            enablestate:Object.keys(curSelData.leftMap).length  > 0 && curSelData.leftMap.enablestate? curSelData.leftMap.enablestate:"",
            accassname:curSelData.leftVO && curSelData.leftVO.accassname ? curSelData.leftVO.accassname:"",
            ctrlmodulename:curSelData.leftVO && curSelData.leftVO.ctrlmodulename ? curSelData.leftVO.ctrlmodulename:"",
        };
        let secondRow={
            versioninfo:this.state.json['10140ACCCB-000006'],/* 国际化处理： 版本2*/
            code:curSelData.rightVO && curSelData.rightVO.code ? curSelData.rightVO.code :"",
            name:curSelData.rightVO && curSelData.rightVO.name  ? curSelData.rightVO.name :"",
            pk_acctype:curSelData.rightVO && curSelData.rightVO.pk_acctype ? curSelData.rightVO.pk_acctype :"",
            cashtype:Object.keys(curSelData.rightMap).length >0 && curSelData.rightMap.cashtype ? curSelData.rightMap.cashtype :"",
            remcode:curSelData.rightVO && curSelData.rightVO.curSelData? curSelData.rightVO.curSelData :"",
            balanorient:Object.keys(curSelData.rightMap).length >0 && curSelData.rightMap.balanorient ? curSelData.rightMap.balanorient:"",
            currency:curSelData.rightVO && curSelData.rightVO.currency ? curSelData.rightVO.currency :"",
            incurflag:curSelData.rightVO && curSelData.rightVO.incurflag ? curSelData.rightVO.incurflag :"",
            balanflag:curSelData.rightVO && curSelData.rightVO.balanflag ? curSelData.rightVO.balanflag :"",
            bothorient:curSelData.rightVO && curSelData.rightVO.bothorient ? curSelData.rightVO.bothorient :"",
            outflag:curSelData.rightVO &&  curSelData.rightVO.outflag ? curSelData.rightVO.outflag :"",
            allowclose:curSelData.rightVO && curSelData.rightVO.allowclose ? curSelData.rightVO.allowclose :"",
            unit:curSelData.rightVO  && curSelData.rightVO.unit ? curSelData.rightVO.unit :"",
            sumprint_level:Object.keys(curSelData.rightMap).length  > 0 && curSelData.rightMap.sumprint_level? curSelData.rightMap.sumprint_level: "",
            enablestate:Object.keys(curSelData.rightMap).length  > 0 && curSelData.rightMap.enablestate? curSelData.rightMap.enablestate:"",
            accassname:curSelData.rightVO && curSelData.rightVO.accassname ? curSelData.rightVO.accassname:"",
            ctrlmodulename:curSelData.rightVO && curSelData.rightVO.ctrlmodulename ? curSelData.rightVO.ctrlmodulename:"",
        };
        let lmodalData = [];
        lmodalData.push(firstRow);
        lmodalData.push(secondRow);        
        this.setState({modalTableData:lmodalData,showModal:true,});
    }
    onTableClick(record,index,event){
        this.state.doubleClickIndex = index;
        this.setState({curSelTableIndex:index,selectedRow:record});//将当前选中的数据拿出来，放到state中；
    }
    onTableDoubleClick(record, index, event){
        this.state.doubleClickIndex = index;
        this.setState(this.state);
        //第一行为版本一；第二行为版本二
        this.modalTableProcess(index);

    }

  render() {
    const { createBillHeadInfo } = this.props.BillHeadInfo
    if(!this.init){
        return '';
    }	  
    return (
        <div className="nc-single-table">
        <NCAffix>
                <div className="nc-singleTable-header-area" style={{border:'none'}}>

                <NCDiv areaCode={NCDiv.config.HEADER } className="header-title-search-area">


                     {
                        createBillHeadInfo(
                            {
                                title: this.state.json['10140ACCCB-000026'],             //标题
                                initShowBackBtn: false,

                            }
                    )}  
                <div className="title-search-detail ref"  style={{marginRight:'5px'}}>
                {AccSystem({
                    onChange:this.onSysChange.bind(this),
                    value:this.state.curAccSystem,
                    fieldid:'accsystem',
                })}
                </div>
                <div className="title-search-detail ref"  style={{marginRight:'5px'}}>
                {AccChart({
                    onChange:this.onChartChange.bind(this),
                    value:this.state.curAccChart,
                    queryCondition:this.state.chartCond(),
                    isShowUnit:true,//modified by liusenc 20180921
                    fieldid:'accchart',
                })} 
                </div>
                <div className="title-search-detail ref"  style={{marginRight:'5px'}}>
                {<NCSelect {...this.state.lVersionData} fieldid='lversiondate'>
                    {this.state.lVersionData.renderOption()}
                </NCSelect>} 


                </div>
                <div className="title-search-detail ref"  style={{marginRight:'5px'}}>
                    {<NCSelect {...this.state.rVersionData} fieldid='rversiondate'>
                        {this.state.rVersionData.renderOption()}
                    </NCSelect>}                  
                </div>
                </NCDiv> 
                <div className="header-button-area">
                    <NCButton   fieldid='chartcom' colors="primary" onClick={this.onAccchartCompare.bind(this)}>{this.state.json['10140ACCCB-000026']}</NCButton>{/* 国际化处理： 科目表版本对比*/}
                    <NCButton   fieldid='acccom' onClick={this.onAccchartAccCompare.bind(this)}>{this.state.json['10140ACCCB-000027']}</NCButton>{/* 国际化处理： 科目对比*/}     
                </div> 
                </div>
                </NCAffix>
        <div className="nc-singleTable-table-area">
          <NCDiv fieldid="accchartcmp" areaCode={NCDiv.config.TableCom} className="accchartcmp_fiacc">
            <NCTable
              // rowClassName={(record,index,indent)=>{
              //     return record === this.state.selectedRow ? 'selected' : '';
              // }}
              rowClassName={(record,index,indent)=> this.state.doubleClickIndex == index ? 'doubleClickSelected': ''}
              columns={this.columns}
              adaptionHeight={true}
              scroll = {{y:500}}
              data={this.state.chartTableData}
              onRowClick={this.onTableClick.bind(this)}
              onRowDoubleClick={this.onTableDoubleClick.bind(this)}
            />
        </NCDiv>
          <NCModal show={this.state.showModal}
            fieldid='acccmp'
            size="xlg"
            onHide={this.onCloseModal.bind(this)}>
            <NCModal.Header>
              <NCModal.Title>{this.state.json['10140ACCCB-000027']}</NCModal.Title>{/* 国际化处理： 科目对比*/}
            </NCModal.Header>
            <NCModal.Body>
              <NCTable
                columns={this.modalColumns}
                scroll={{ x: true }}
                data={this.state.modalTableData}
              />
            </NCModal.Body>
            <NCModal.Footer>
              <NCButton fieldid='submit' onClick={this.onCloseModal.bind(this)} colors="primary">{this.state.json['10140ACCCB-000028']}</NCButton>{/* 国际化处理： 确定*/}
              <NCButton fieldid='cancel' onClick={this.onCloseModal.bind(this)}>{this.state.json['10140ACCCB-000029']}</NCButton>{/* 国际化处理： 取消*/}
            </NCModal.Footer>
          </NCModal>          
      </div>
      </div>
    );
  }
}
 AccChartCmp = createPage({

})(AccChartCmp) 
ReactDOM.render(<AccChartCmp/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
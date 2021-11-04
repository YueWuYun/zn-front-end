//y3omlY7Heaymj2G9RwagXQ/oPeNpTaOL6camEj/ummKokyiIZZS8uuVFw/c5N5Wg
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree  } = base;

var EMPTY_FN = function(){};

class SearchSelect extends Component {
    constructor(props) {
      super(props);
      this.lang = props.lang;
      this.common = props.common;
      this.onSelectPKChange = props.onSelectPKChange;
      this.pks =[];
      this.state = {
        search:{
          defaultConditionsNum:2,
          oid:'-1',
          clickSearchBtn: (props,data,tyep,queryInfo) => {
             this.searchData( (data) =>{
              this.fillData(data);
             });
          }
        },
        selectPkChart:[],
        btnCheckedAll:{
            onClick: () =>{
              this.setAllPageData(true);
            }
        },
        btnUnCheckedAll:{
            onClick: () =>{
              this.setAllPageData(false);
            }
        },
        allpks: []
      };
    }


    searchData(callback){
      let searchVal = this.common.search.getAllSearchData('batEditSearch') || {};
      let pageInfo  = this.common.table.getTablePageInfo('batEditList');
      let selectPkChart = this.state.selectPkChart;
      var param = {
              querycondition:searchVal,
              pagecode: this.common.config.pagecode,
              ...this.curParam.config,
              pk_org : this.common.config.nodetype == 'org' ?   this.curParam.pkorg : '',
              queryAreaCode:'batEditSearch',
              oid: this.state.search.oid , 
              pageInfo: pageInfo,
              querytype:'tree',
              selectPkChart: selectPkChart
      };
      ajax({
          loading: true,
          data: param,
          url: '/nccloud/uapbd/account/BatEditSearchAction.do',
          success:  (res) => {
              debugger;
              if(res.data && res.data.batEditList && res.data.batEditList.allpks){
                this.state.allpks = res.data.batEditList.allpks;
              }else{
                this.state.allpks =  [];
              }
              this.pks = [];
              this.setState(this.state, () =>{
                callback && callback(res.data);
              });
          }
      });
    }

    fillData(data, callback){
      if(data)
        this.common.table.setAllTableData('batEditList',data['batEditList']);
      else
        this.common.table.setAllTableData('batEditList',{
            areacode: 'batEditList',
            rows: []
        });
      setTimeout(() => {
        callback && callback();
      }, 0);
    }

    setAllPageData(checked){
      if(checked){
        this.pks = [...this.state.allpks];
      }else{
        this.pks = [];
      }

      var datas = this.common.table.getAllTableData('batEditList').rows;
      var indexs = [];
  
      datas.forEach((d, index) => {
          if(this.pks.indexOf(d.values.pk_accasoa.value) != -1){
            indexs.push(index);
          }
      });

      this.common.table.selectAllRows('batEditList', false);
      this.common.table.selectTableRows('batEditList', indexs, true);
      setTimeout(() => {
        this.onSelectPKChange(this.pks);
      }, 0);
    }
    
    onSelectedData(props,moduleId,record,index,status){
      var pk = record.pk_accasoa.value;
      if(status){
          this.pks =  this.pks.filter(d => d !== pk);//modified by liusenc 20180907,这个的作用是去重
          this.pks = [...this.pks, pk];
      }else{
          this.pks =  this.pks.filter(d => d !== pk);//modified by liusenc 201801907 这个的作用是过滤
      }
      this.onSelectPKChange(this.pks);
    }

    onSelectedAllData(props, moduleId, status, length){
      setTimeout(() => {
        var datas = this.common.table.getAllTableData('batEditList').rows;
        var pks = datas.map( d => {
          return d.values.pk_accasoa.value;
        });
        if(status){
          this.pks =  this.pks.filter(d =>  pks.indexOf(d) === -1);//modified by liusenc 20180907这个的作用是去重
          this.pks = [...this.pks, ...pks];
        }else{
          this.pks =  this.pks.filter(d =>  pks.indexOf(d) === -1);//modified by liusenc 20180907去除已有的；
        }
        this.onSelectPKChange(this.pks);
      }, 0);
    }

  //   componentWillReceiveProps(newProps){
  //     this.state.pks = newProps.pks || [];
  //     this.state.onSelectPKChange = newProps.onSelectPKChange || EMPTY_FN;
  //     this.setState(this.state, () =>{
  //       var rowNos = [];
  //       var datas = this.common.table.getAllTableData('batEditList').rows;
  //       rowNos = datas.filter( d =>{
  //         var id = d.values.pk_accasoa.value;
  //         return this.state.pks.indexOf(id) != -1
  //       }).map( d=>{
  //         return d.rowid;
  //       });
  //       this.common.table.selectTableRows('batEditList', rowNos, true);
  //     });
  // }

    init(curParam){
      this.curParam = curParam;
      this.state.search.oid = curParam.searchoid;
      this.setState(this.state);
        this.common.table.setAllTableData('batEditList',{
          areacode: 'batEditList',
          rows: []
      });
    }

    initSelectChart(pkcharts){
      this.state.selectPkChart = pkcharts;
      this.setState(this.state, () =>{
        //this.pageInfoClick();
      });
    }

    pageInfoClick(){
      setTimeout(() => {
        this.searchData( (data) =>{
          this.fillData(data, () =>{
            var datas = this.common.table.getAllTableData('batEditList').rows;

            var indexDatas = datas.map((data, index) => {
                return {
                  index: index,
                  data: data
                };
            }); 
         
            var selectIndexs = indexDatas.filter( d =>{
                var id = d.data.values.pk_accasoa.value;
                return this.pks.indexOf(id) != -1
            }).map( d=>{
              return d.index;
            });
            this.common.table.selectTableRows('batEditList', selectIndexs, true);
          });
        });
      },0);
    
    }

    render() {
      return (
        <div>
          {this.common.search.NCCreateSearch('batEditSearch', this.state.search)}
          <div style={{marginBottom: 5}}>
            <NCButton fieldid='checkedall' {...this.state.btnCheckedAll   }>{this.lang['10140ACCB-000009']}</NCButton>{/* 国际化处理： 选中所有页*/}
            <NCButton fieldid='uncheckedall' {...this.state.btnUnCheckedAll }>{this.lang['10140ACCB-000010']}</NCButton>{/* 国际化处理： 取消选中所有页*/}
          </div>
          {this.common.table.createSimpleTable('batEditList', {
            onSelected:this.onSelectedData.bind(this),
            onSelectedAll:this.onSelectedAllData.bind(this),
            showCheck:true,
            handlePageInfoChange: this.pageInfoClick.bind(this)
          })}
        </div>
      )
    
    }
}
export default SearchSelect;

//y3omlY7Heaymj2G9RwagXQ/oPeNpTaOL6camEj/ummKokyiIZZS8uuVFw/c5N5Wg
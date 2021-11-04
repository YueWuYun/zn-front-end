//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl,NCPagination  } = base;

var EMPTY_FN = function(){};
class ResultGrid extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.common = props.common;
        this.state = {
            pks: []
        }
      }
  
      searchData(callback){
        let pageInfo  = this.common.table.getTablePageInfo('batEditResult');
        var param = {
                pagecode: this.common.config.pagecode,
                ...this.curParam.config,
                pageInfo: pageInfo,
                pks: this.state.pks
        };
        if(this.state.pks && this.state.pks.length > 0){
          ajax({
              loading: true,
              data: param,
              url: '/nccloud/uapbd/account/BatEditResultAction.do',
              success: function (res) {
                  callback && callback(res.data);
              }
          });
        }else{
          callback && callback();
        }
       
      }
  
      fillData(data, callback){
        if(data)
          this.common.table.setAllTableData('batEditResult',data['batEditResult']);
        else
          this.common.table.setAllTableData('batEditResult',{
              areacode: 'batEditResult',
              rows: []
          });
      }
  
      onSelectedData(){
        var  records = this.common.table.getCheckedRows('batEditResult') || [];
        var pks = records.map( d=> {
            return d.pk_accasoa.value;
        });
      }
  
      init(curParam){
        this.curParam = curParam;
        this.state.pks = [];
        this.setState(this.state, () =>{
            this.common.table.setAllTableData('batEditResult',{
                areacode: 'batEditResult',
                rows: []
            });
        });
      }

      initSelectPK(pks){
        this.state.pks = pks;
        this.setState(this.state, () =>{
            this.searchData( (data) =>{
                this.fillData(data);
              });
        });
      }
  
      pageInfoClick(){
        setTimeout(() => {
          this.searchData( (data) =>{
            this.fillData(data);
          });
        },0);
      }
  
      render() {
        return (
          <div style={{marginTop: 10}}>
            {this.common.table.createSimpleTable('batEditResult', {
              onSelected:this.onSelectedData.bind(this),
              handlePageInfoChange: this.pageInfoClick.bind(this)
            })}
          </div>
        )
      
      }
}
export default ResultGrid;

//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
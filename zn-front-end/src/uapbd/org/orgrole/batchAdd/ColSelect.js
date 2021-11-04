//7TK51v2IMYUqY3fs584hiAGKe3nZHGK8d5Z6XEcpArWZ8pUiTKUgUh3SapEkGdPW
import React, { Component } from 'react';
import {base,ajax} from 'nc-lightapp-front';
let { NCTable,NCTabs,NCCheckbox,NCCol,NCRow  } = base;
import { Table,Record } from '../../../public/excomponents';
var EMPTY_FN = function(){};

class ColSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
          table:{
            json:{},
            fieldid:'colselect',
            checkedModel:{},
            columns:[{
              title: props.main.state.json['10100PSRC-000017'], /* 国际化处理： 编码*/
              dataIndex: 'function_id',
              width: 150,
            },{
              title: props.main.state.json['10100PSRC-000018'], /* 国际化处理： 名称*/
              dataIndex: 'function_name',
                width: 150,
            }]
        } 
      };
    }

    rest(){
        ajax({
          url: '/nccloud/uapbd/orgrole/SelectBusiFuncAction.do',
          data: {
          },
          success:(res) => {
                this.table.loadData(res.data);
          }
      });
    }
    onInit(){

    }
    getData(){
      return this.table.getCheckedRecords();
    }
    render() {
        return (<Table {...this.state.table}  ref={(table) => this.table = table}/>)
    }
}
export default ColSelect;
//7TK51v2IMYUqY3fs584hiAGKe3nZHGK8d5Z6XEcpArWZ8pUiTKUgUh3SapEkGdPW
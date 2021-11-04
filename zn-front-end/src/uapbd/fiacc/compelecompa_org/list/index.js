//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage,high,base,toast,getMultiLang} from 'nc-lightapp-front';
import {multiLangCode,searchId,tableId,oid,dataSource,pagecode,module} from './constants';
import ListPage from '../../compelecompa_com/list';
//引入缓存---end
/**
 * 
 *
 */

class JobEditTable extends Component {
    constructor(props){
        super(props);
        this.state={
            json:{},
        }
    }
    componentWillMount(){
        let  callback= (json) =>{
            this.setState({json:json},()=>{
           })
       }
       getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
    }
    render() {
        return (
            <ListPage
                title={this.state.json['10140CECA-000000']}
                dataSource={dataSource}
                // queryCondition = {{}}
            />
        )
    }
}
JobEditTable = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode:  pagecode,
        bodycode: tableId
    },
})(JobEditTable);
export default JobEditTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
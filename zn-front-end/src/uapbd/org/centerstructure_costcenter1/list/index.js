//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 Created By xianggang5 on 2020/04/17
 成本中心结构
 */

import React, { Component } from 'react';
import { createPage,getMultiLang,} from 'nc-lightapp-front';
import List from '../../centerstructure/list';
import {pagecode, tableId} from "./constants";


let dataSource = 'uapbd.org.centersture_factor.10100CCS';


class ListPageBase extends Component{
    constructor(props){
        super(props);
        this.state={
            json: {}
        }
    }
    componentWillMount(){
        let  callback= (json) =>{
            this.setState({json:json})
        }
        getMultiLang({moduleId: ['10100CCS'], currentLocale: 'simpchn',domainName:'resa',callback})
    }

    render(){

        return (
            <List
                title={"成本中心结构-集团"}//this.state.json['38200ISPCG-000000']
                dataSource={dataSource}
                refcode='uapbd/refer/org/LiabilityBookGridTreeRef/index.js'//参照的路径
                field='pk_list_refer'
            />
        )
    }
}
ListPageBase = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode:  pagecode,
        bodycode:  tableId
    }
})(ListPageBase);
export default ListPageBase;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
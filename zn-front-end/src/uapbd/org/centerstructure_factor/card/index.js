//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 Created By liqiankun on 2019/10/14
 内部结算管理 -- 内部服务价格分类-集团
 */

import React, { Component } from 'react';
import { createPage,ajax,base,toast,cardCache,getMultiLang, high,cacheTools } from 'nc-lightapp-front';
import Card from '../../centerstructure/card';
import {pagecode, tableId} from "./constants";


let dataSource = 'resa.innernalsettle.innersettlepriceclass_group.38200ISPCG';


class CardpageBase extends Component{
    constructor(props){
        super(props);
        this.state = {
            json: {}
        }
    }
    componentWillMount(){
        let  callback= (json) =>{
            this.setState({json:json})
        }
        getMultiLang({moduleId: ['38200ISPCG'], currentLocale: 'simpchn',domainName:'resa',callback})
    }

    render(){
        return(
            <Card
                title={'成本要素结构-集团'}
                dataSource={dataSource}
                field='group_card_refer'
            />
        )
    }
}
CardpageBase = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode:  pagecode,
        bodycode:  tableId
    }
})(CardpageBase);
export default CardpageBase;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
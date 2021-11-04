//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Orgunittable from  '../../orgunit/main'

/**
 * author wanglqh
 *
 */
export default class Orgtable extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            pageTitle:'业务单元',
            NODE_TYPE:'GROUP_NODE',
            pagecode:'10100ORG_orgunit',
            cardpagecode:'10100ORG_orgunitcard',
            datasource : 'uapbd.org.orgunit.orgunit',
            appid:'0001Z010000000001NOH',
            appcode:'10100ORG',
            json:{},
            oid:"0001Z010000000005YAD",
            gridId:'orglist',
            searchId:'10100ORGSEARCH',
        };
        return(
            <Orgunittable {...{config:config}}/>
        );
    }
}
//ReactDOM.render(<OrgTable />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
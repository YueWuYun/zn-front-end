//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Orgunitversion from '../../orgunit/version';

import { createPage} from 'nc-lightapp-front';
/**
 * author wanglqh
 *
 */
export default class Orgversion extends Component {
    constructor(props){
        
        //let pk_org = props.getUrlParam('pk_org');
        super(props);
    }
    render(){
        let config = {
            pageTitle:'业务单元',
            NODE_TYPE:'GROUP_NODE',
            pagecode:'10100ORG_orgunit',
            datasource : 'uapbd.org.orgunit.orgunit',
            appid:'0001Z010000000001NOH',
            appcode:'10100ORG',
            oid:"0001Z010000000005YAD",
            gridId:'orglist',
            searchId:'10100ORGSEARCH',
        };
        return(
            <Orgunitversion {...{config:config}}/>
        );
    }
}
//ReactDOM.render(<OrgCard />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
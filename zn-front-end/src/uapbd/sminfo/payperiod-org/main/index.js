//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PayPeriod from '../../payperiod-base/main'
import {createPage, base, ajax, toast, cardCache} from 'nc-lightapp-front'
let { NCPopconfirm} = base;
let {setDefData, getDefData } = cardCache;

const dataSource = 'uapbd.sminfo.payperiod-org.data'
const tableid = 'payperiod';
const appid = '0001Z010000000000NXQ'
const pagecode = '10140PAYPO_list';
const primaryKey = 'pk_payperiod'
const urls = {
	save : '/nccloud/uapbd/payperiod/savePayPeriod.do',
	query : '/nccloud/uapbd/payperiod/queryPayPeriod.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

let SingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },
	initTemplate: [],
	mutiLangCode: '10140PAYPG'
})(PayPeriod);

let config = {
	pagecode: '10140PAYPO_list',
	nodetype: 'org',
	appcode: '10140PAYPO',
	dataSource: dataSource
}
ReactDOM.render(<SingleTable {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
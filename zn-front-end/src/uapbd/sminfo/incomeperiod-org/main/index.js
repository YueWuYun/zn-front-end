//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IncomePeriod from '../../incomeperiod-base/main'
import {createPage, base, ajax, toast, cardCache} from 'nc-lightapp-front'
let { setDefData } = cardCache;
let { NCPopconfirm} = base;

const dataSource = 'uapbd.sminfo.incomeperiod-org.data'
const tableid = 'incomeperiod';
const appid = '0001Z010000000000NXI'
const pagecode = '10140INCPO_list';
const primaryKey = 'pk_incomeperiod'
const urls = {
	save : '/nccloud/uapbd/incomeperiod/saveIncomePeriod.do',
	query : '/nccloud/uapbd/incomeperiod/queryIncomePeriod.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

let SingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },
	initTemplate: [],
	mutiLangCode: '10140INCPG'
})(IncomePeriod);

let config = {
	pagecode: '10140INCPO_list',
	nodetype: 'org',
	appcode: '10140INCPO',
	dataSource: dataSource

}
ReactDOM.render(<SingleTable {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
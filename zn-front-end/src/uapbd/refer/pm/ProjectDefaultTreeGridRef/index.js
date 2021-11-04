//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps } from '../../org/BusinessUnitTreeRef/index';
const { Refer } = high;


export var conf =  {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000359',/* 国际化处理： 项目*/
		placeholder: 'refer-000359',/* 国际化处理： 项目*/
		refCode: 'uapbd.pm.ProjectDefault',
		rootNode:{refname:'refer-000360',refpk:'root'},/* 国际化处理： 项目基本分类*/
        queryGridUrl: '/nccloud/uapbd/ref/ProjectDefaultGridRef.do',
		queryTreeUrl: '/nccloud/uapbd/ref/ProjectDefaultTreeRef.do',
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
       columnConfig: [{name: [ 'refer-000361', 'refer-000362' ],
						code: [ 'refcode', 'refname'],
						fullTxtCode: { 'refcode': true, 'refname': true },
					}],/* 国际化处理： 项目编码,项目名称,项目简称*/
		isMultiSelectedEnabled: false,
		isShowUnit: false,
		unitProps: unitProps,	
		isShowUsual: true,	
	};

	export default function (props = {}){
		return <Refer {...conf} {...props} />
	}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
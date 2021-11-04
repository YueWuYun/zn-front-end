//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../org/BusinessUnitTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-003573',/* 国际化处理：利润中心*/
		placeholder: 'refer-003573',/* 国际化处理：利润中心*/
		rootNode: { refname: 'refer-003573', refpk: 'root' },/* 国际化处理： 利润中心*/
		refCode: 'uapbd.ref.ProfitCenterTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/ProfitCenterTreeRef.do',
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
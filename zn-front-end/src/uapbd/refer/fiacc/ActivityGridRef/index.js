//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;
export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'grid',
		refName: 'refer-003562',/* 国际化处理： 作业档案*/
		placeholder: 'refer-003562',/* 国际化处理： 作业档案*/
		placeholder: '',
		queryGridUrl: '/nccloud/uapbd/ref/bdActivityRef.do',
		columnConfig:[{name:['refer-003560','refer-003561'],code:["refcode","refname"]}]/* 国际化处理： 编码,名称*/
	};
	return <Refer {...Object.assign(conf, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
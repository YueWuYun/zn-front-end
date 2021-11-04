//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const {Refer} = high;

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

export 	var conf = {multiLang: { 		domainName: 'uap', 		currentLocale: 'zh-CN', 		moduleId: 'uapRefer', 	},
	queryTreeUrl:'/nccloud/riart/ref/groupRefTreeAction.do',
	refType:"tree",
	//isMultiSelectedEnabled:true
	placeholder:'集团',/* 国际化处理： 集团*/
	refName:'集团',/* 国际化处理： 集团*/
	rootNode: { refname: '集团 	', refpk: 'root' },/* 国际化处理： 集团*/
};

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
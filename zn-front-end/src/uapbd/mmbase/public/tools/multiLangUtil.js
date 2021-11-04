//2Uuv1cMWZkg2BRt9wxfm3YK/SJV29PNHPCB42Yq1EINcMJA67tCN3PkSODEBBxb8
/*
 * 多语使用工具类
 * @Author: guozhq 
 * @Date: 2018-10-18 16:01:37 
 * @Last Modified by: xiahui
 * @Last Modified time: 2018-12-24 16:23:55
 */
import { getMultiLang, toast } from 'nc-lightapp-front';

/**
 * 初始化多语文件到组件内
 * @param {*} _this 
 * @param {*} resPath 数组
 * @param {*} moduleCode 
 * @param {*} callback 初始化模板回调
 */
function initLang(_this, resPath, moduleCode, callback) {
	// 初始化集合
	_this.lang = null;
	_this.inlt = null;

	// _this.state.lang = {};
	// _this.state.inlt = null;

	let success = (lang, status, inlt) => {
		if (status) {
			_this.lang = lang;
			_this.inlt = inlt;

			// _this.setState({ lang: lang, inlt: inlt });
		}
		// 模板初始化
		callback && callback();
	};
	getMultiLang({ moduleId: resPath, domainName: moduleCode, callback: success, needInlt: true });
}

/**
 * 获取多语
 * @param {*} _this 
 * @param {*} resid 
 * @param {*} param 
 */
function getLangByResId(_this, resid, param) {
	check(_this, resid);
	let str = resid;
	if (param) {
		if (_this.inlt) {
			str = _this.inlt.get(resid, param);
			return str ? str : resid;
			// str = _this.state.inlt.get(resid, param);
		} else {
			return '';
		}
	} else {
		// 如果还没有加载回来，则返回空，避免页面显示多语字符串
		if (_this.lang) {
			// if (_this.state.lang){
			// str = _this.state.lang[resid];
			str = _this.lang[resid];
			return str ? str : resid;
		} else {
			return '';
		}
	}
}

/**
 * 检查
 * @param {*} _this 
 * @param {*} resid 
 */
function check(_this, resid) {
	if (!_this) {
		toast({ color: 'danger', content: '请检查代码中this是否能够取到！当前为undifined,位置：' + resid });
		throw new Error('请检查代码中this是否能够取到！当前为undifined,位置：' + resid);
	}
}

export { initLang, getLangByResId };

//2Uuv1cMWZkg2BRt9wxfm3YK/SJV29PNHPCB42Yq1EINcMJA67tCN3PkSODEBBxb8
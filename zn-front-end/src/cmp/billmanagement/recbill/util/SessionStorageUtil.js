/*o++dgj4q/pccqfoOQZFchnURRjc+TGUXRjP6hTKdVBEZXSXGO6k5VUMBJtkyeJfe*/
import { viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * [收款结算]-设置全局缓存sessionStorage
 */
export const setSessionStorage = function () {
	if (this.state.tradetype && this.state.tradetype.length > 0) {
		//若存储值是字符串，可以直接存储
		setGlobalStorage('sessionStorage', 'sessionTP', this.state.tradetype);
	}
	if (this.state.tradename && this.state.tradename.length > 0) {
		setGlobalStorage('sessionStorage', 'sessionName', this.state.tradename);
	}
	if (this.state.tradepk && this.state.tradepk.length > 0) {
		setGlobalStorage('sessionStorage', 'sessionpk', this.state.tradepk);
	}
	//console.log('transtype:', getGlobalStorage('sessionStorage', 'sessionTP'));
	//console.log('transtype_name:', getGlobalStorage('sessionStorage', 'sessionName'));
	//console.log('pk_transtype:', getGlobalStorage('sessionStorage', 'sessionpk'));
}
/**
 * [收款结算]-设置本地缓存localStorage
 */
export const setCookieStorage = function () {
	if (this.state.tradetype && this.state.tradetype.length > 0) {
		//若存储值是字符串，可以直接存储
		setGlobalStorage('localStorage', 'sessionTP', this.state.tradetype);
	}
	if (this.state.tradename && this.state.tradename.length > 0) {
		setGlobalStorage('localStorage', 'sessionName', this.state.tradename);
	}
	if (this.state.tradepk && this.state.tradepk.length > 0) {
		setGlobalStorage('localStorage', 'sessionpk', this.state.tradepk);
	}
	let type = getGlobalStorage('localStorage', 'sessionTP');
	let name = getGlobalStorage('localStorage', 'sessionName');
	let trpk = getGlobalStorage('localStorage', 'ncsessionpkc1');
	//console.log('sessionTP:', type);
	//console.log('sessionName:', name);
	//console.log('ncsessionpkc1:', trpk);
}

/*o++dgj4q/pccqfoOQZFchnURRjc+TGUXRjP6hTKdVBEZXSXGO6k5VUMBJtkyeJfe*/
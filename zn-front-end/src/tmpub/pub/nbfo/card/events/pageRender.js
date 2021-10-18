/*PAziQH6DzI/3G4jEhQgEOkv5pYD7iLkQJByQFsE/nrmwgloO4d4H66nJVd9M+/ys*/
/**
 * 根据卡片页状态渲染页面
 * @param {*} props  页面内置对象
 */

export function pageRender(props) {
	let status = props.getUrlParam('status');
	if (status === 'browse') {
		props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
		props.button.setButtonVisible([ 'Add', 'Revise', 'Delete', 'Copy', 'Account' ], true);
	} else if (status != undefined) {
		props.button.setButtonVisible([ 'Save', 'Cancel' ], true);
		props.button.setButtonVisible([ 'Add', 'Revise', 'Delete', 'Copy', 'Account' ], false);
	}
	if (status == undefined) {
		props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
		props.button.setButtonVisible([ 'Add', 'Revise', 'Delete', 'Copy', 'Account' ], true);
	}
}

/*PAziQH6DzI/3G4jEhQgEOkv5pYD7iLkQJByQFsE/nrmwgloO4d4H66nJVd9M+/ys*/
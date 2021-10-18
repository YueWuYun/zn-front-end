/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisabled }  from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let cacheDataSource = constant.cacheDataSource;

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode,
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					
					let searchVal = getDefData(constant.queryCacheKey, this.cacheDataSource);
					ajax({
						url: requesturl.queryHisRecord,
						data: searchVal,
						success: (res) => {
							let { success, data } = res;
							if (success && data != null) {
								this.props.table.setAllTableData(this.tableId2, data[constant.ltablecode2]);
								if(data[constant.ltablecode2].rows.length > 0){
									this.props.button.setButtonVisible(buttonDisabled.allBtn, true);
									this.props.button.setButtonDisabled(buttonDisabled.queryHaveRecordDisable, true);
								} else {
									this.props.button.setButtonVisible(buttonDisabled.allBtn, true);
									this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
								}
								let message = this.state.json['36070AA-000067'] + data[constant.ltablecode2].rows.length + this.state.json['36070AA-000068'];
								toast({
									content: message,/* 国际化处理： 查询成功！*/
									color: 'success'
								})
							} else {
								this.props.table.setAllTableData(this.tableId2, {rows:[]});
								this.props.button.setButtonVisible(buttonDisabled.allBtn, true);
								this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
							}
						}
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	// //设置参照可以多选和是否清楚记录
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').isMultiSelectedEnabled = true;
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').showHistory = true;
	
	// //财务组织:全加载
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').isTreelazyLoad = false;

	// //设置参照可以多选和是否清楚记录
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').isMultiSelectedEnabled = true;
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').showHistory = true;
	
	// //财务组织:全加载
	// meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').isTreelazyLoad = false;
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
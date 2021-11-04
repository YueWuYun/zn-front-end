//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: hufei 
 * @PageInfo: PO 参数面板 穿梭类型 适用于 PO06,PO16,PO27,PO83
 * @Date: 2018-07-24 16:07:45 
 * @Last Modified by: hufei
 * @Last Modified time: 2019-01-15 15:14:36
 */
import React, { Component } from 'react';
import { base, high, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../public/tools/multiLangUtil';
let { NCModal: Modal, NCButton: Button, NCCheckbox: Checkbox } = base;
let { Transfer } = high;
let { Header, Body, Footer } = Modal;
import './index.less';
import getParamData from './data.js';

export default class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data || {};
		let targetKeys = [];
		let checkVal = 'N';
		let DATA = getParamData.call(this);
		let CODE = props.initcode;
		console.log(this.data, 'data');
		initLang(this, [ '10140BOMM' ], 'uapbd', () => {
			// initLang 放在底部会出现初次点开有多语，再次点开没有多语的问题，并且这里的回调的setState也不能把加载多语后的DataSource渲染到页面，原因暂未知
			DATA = getParamData.call(this);
			this.setState({
				dataSource: (DATA[CODE] && DATA[CODE].dataSource) || [],
				targetKeys,
				checkVal
			});
		});
		if (!props.batch) {
			// 穿梭已选的项是传过来的props.data.sysinitvo.value(逗号分隔的字符串)所代表的值,如果没有值，则放默认值到右边
			// sysinitvo.value结尾有时候是个逗号，分割后会生成一个空字符串的已选项，会影响已选项不能为空校验，需要去掉结尾的逗号
			if (this.data.sysinitvo.value) {
				let valStr = this.data.sysinitvo.value.replace(/,$/, '');
				if (valStr) {
					let valAry = valStr.split(',');
					if (CODE === 'MMBD006') {
						[ checkVal, ...targetKeys ] = valAry;
					} else {
						targetKeys = valAry;
					}
				}
			} else if (DATA[CODE]) {
				targetKeys = DATA[CODE].defaultSelected;
			}
		}
		this.state = {
			dataSource: (DATA[CODE] && DATA[CODE].dataSource) || [],
			targetKeys,
			checkVal
		};
	}

	// 调用props.valueChange方法关闭模态框，并传递数据，编辑态点确定（checkflag为true）传新的已选的值，其它情况都不传值
	closeModal = (checkflag) => {
		let valueStr, param;
		if (checkflag) {
			// 编辑态点击确定，需要校验已选项，并且传递新的已选值到父组件，批量修改传字符串，单个修改传完整vo对象
			// 点击取消或关闭的X按钮或浏览态点击确定，不需要校验，不需要传值
			if (this.state.targetKeys.length === 0) {
				toast({
					content: getLangByResId(this, '110140BOMM0170'),
					color: 'warning'
				}); /**国际化处理：右侧已选项不能为空！ */
				return;
			} else {
				// MMBD006 参数要拼接上复选框的值,Y/N
				valueStr =
					this.props.initcode === 'MMBD006'
						? this.state.checkVal + ',' + this.state.targetKeys.join(',')
						: this.state.targetKeys.join(',');
				if (this.props.batch) {
					// 批量修改
					param = this.props.pkorgs.map((org) => {
						return { pk_org: org, value: valueStr };
					});
				} else {
					// 单独修改
					this.data.sysinitvo.value = valueStr;
					param = this.data;
				}
			}
		}
		this.props.valueChange(param);
	};

	// 穿梭内容改变时的回调
	onTargetKeysChange = (targetKeys) => {
		this.setState({ targetKeys });
	};

	render() {
		const { dataSource, targetKeys } = this.state;
		console.log(dataSource, 'dataSource');
		const transferProps = {
			dataSource,
			targetKeys,
			onTargetKeysChange: this.onTargetKeysChange,
			className: 'param-panel-transfer',
			showMoveBtn: true,
			titles: [
				getLangByResId(this, '110140BOMM0171'),
				getLangByResId(this, '110140BOMM0172')
			] /* 国际化处理： 待选,已选*/,
			lazy: { container: 'modal' }
		};
		return (
			<div>
				<Modal show={true} className="param-panel-modal">
					<Header>
						<span className="title">{getLangByResId(this, '110140BOMM0173')}</span>
						{/* 国际化处理： 动态参数设置*/}
						<i className="dnd-cancel iconfont icon-guanbi" onClick={() => this.closeModal(false)} />
					</Header>
					<Body>
						<Transfer {...transferProps} />
					</Body>
					<Footer>
						<Button
							className="button-primary"
							onClick={() => this.closeModal(this.props.editMode == 'edit')}
						>
							{getLangByResId(this, '110140BOMM3008')}
							{/* 国际化处理： 确定*/}
						</Button>
						<Button onClick={() => this.closeModal(false)}>{getLangByResId(this, '110140BOMM3017')}</Button>
						{/* 国际化处理： 取消*/}
					</Footer>
				</Modal>
			</div>
		);
	}
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
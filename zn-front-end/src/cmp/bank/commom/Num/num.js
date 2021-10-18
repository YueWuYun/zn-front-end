/*gWuZc3RZIYFkrFuge1fqqtYNgi0/tURTGXSfY7B7/iY=*/
import React, { Component } from 'react';
import Input from '../nc_Input';
import FormControl from '../nc_FormControl';
import PropTypes from 'prop-types';

const propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
	onBlur: PropTypes.func,
	onChange: PropTypes.func
};

class NCNumber extends Component {
	constructor(props) {
		super(props);
		let scale = props.scale ? props.scale : 4;
		let disabled = props.disabled ? props.disabled : false;
		let defData = {
			scale: scale,
			disabled: disabled,
			isrequired: false,
			verify: true,
			value: null,
			reg: new RegExp('^[-|0-9]+(\\.[0-9]{0,' + scale + '})?$')
		};
		this.state = Object.assign(defData, props);
	}

	componentWillReceiveProps(nextProps) {
		let scale = nextProps.scale ? nextProps.scale : 4;
		let disabled = nextProps.disabled ? nextProps.disabled : false;
		let defData = {
			scale: scale,
			disabled: disabled,
			isrequired: false,
			verify: true,
			value: null,
			reg: new RegExp('^[-|0-9]+(\\.[0-9]{0,' + scale + '})?$')
		};
		this.setState(Object.assign(defData, nextProps));
	}

	handleChange = (e) => {
		// const {
		// 	onChange,
		// 	processChange,
		// 	scale = 0,
		// 	value,
		// 	// reg = new RegExp('^[\\+\\-]?[0-9|,]*(\\.\\d{0,' + scale + '})?$', 'i'),
		// 	reg = new RegExp("^[\-|0-9]+(\\.[0-9]{0,"+ scale +"})?$")
		// } = this.state;
		let onChange = this.state.onChange;
		let processChange = this.state.processChange;
		let scale = this.state.scale;
		let value = this.state.value;
		let reg = this.state.reg;

		let allowReg = new RegExp('^[-|0-9]+(\\.[0-9]{0,' + scale + '})?$');

		let verify = true,
			aimValue = this.removeThousands(e || '');

		if (aimValue.includes('。')) {
			let arr = aimValue.split('。');
			aimValue = arr[0] + '.';
		}

		if (scale === 0 || scale === undefined || scale === null) {
			aimValue = aimValue.split('.')[0];
		}

		if (reg.test(aimValue) || aimValue === '') {
			// aimValue = value;
			this.state.value = aimValue;
		}

		// if(this.state.value === ''){
		//     this.state.value = aimValue = null;
		// }

		if (!allowReg.test(aimValue) && aimValue != '') {
			verify = false;
		}
		this.setState(this.state);

		if (onChange) {
			// onChange(this.removeThousands(e || ''));
			onChange(this.state.value == '' ? null : this.state.value);
		}
	};
	//校验数值是否在合法区间内
	checkNumberRange = (value) => {
		if (this.state.hasOwnProperty('max') && (this.state.max || this.state.max == 0)) {
			if (Number(value) > Number(this.state.max)) return false;
		}
		if (this.state.hasOwnProperty('min') && (this.state.max || this.state.max == 0)) {
			if (Number(value) < Number(this.state.min)) return false;
		}
		return true;
	};

	handleBlur = (e) => {
		// const {
		// 	onBlur,
		// 	processChange,
		// 	scale = 0,
		// 	value,
		// 	reg =  new RegExp("^[\-|0-9]+(\\.[0-9]{0,"+ scale +"})?$"),
		// 	isrequired = false
		// } = this.state;

		let onChange = this.state.onChange;
		let processChange = this.state.processChange;
		let scale = this.state.scale;
		let value = this.state.value;
		let reg = this.state.reg;
		let isrequired = this.state.isrequired;
		let onBlur = this.state.onBlur;

		let allowReg = new RegExp('^[-|0-9]+(\\.[0-9]{0,' + scale + '})?$');

		let verify = true,
			aimValue = this.removeThousands(e || '');

		aimValue = this.addZero(aimValue, scale);
		if (reg.test(aimValue) || aimValue === '') {
			// aimValue = value;
			//this.state.value = aimValue;
			if (this.checkNumberRange(aimValue)) {
				this.state.value = aimValue;
			} else {
				this.state.value = '';
				verify = false;
			}
		}
		// if(this.state.value === ''){
		//    this.state.value = aimValue = null;
		// }

		if (!allowReg.test(aimValue) && aimValue != '') {
			verify = false;
		}

		if (isrequired && aimValue == '') {
			verify = false;
		}

		this.setState(this.state);
		// if(this.state.value !== '' && this.state.value !== null && this.state.value !== undefined){
		// 	this.state.value = Number(this.state.value);
		// }
		if (onBlur) {
			onBlur(this.state.value == '' ? null : this.state.value);
		}
		onChange(this.state.value == '' ? null : this.state.value);
	};

	// 补0
	addZero(num, scale) {
		if (isNaN(Number(num)) || !num) {
			return null;
		}
		if (scale > 0) {
			let start = num.split('.')[0];
			let end = num.split('.')[1];
			if (!end) {
				end = '';
			}
			let len = end.length;
			if (len < scale) {
				end = end.padEnd(scale, '0');
			}
			return start + '.' + end;
		} else {
			return num;
		}
	}

	//精度千分位处理
	formatAcuracy(value, len = 2) {
		if (value === null || value === undefined) {
			return value;
		}

		return this.commafy(this.formatDot(value, len));
	}

	//移除千分位
	removeThousands(val) {
		return val ? val.toString().replace(/\,/gi, '') : val;
	}

	//数字转换成千分位 格式
	commafy(num) {
		let pointIndex, intPart, pointPart;
		if (num === '-') {
			return '-';
		}
		if (isNaN(num)) {
			return '';
		}

		num = num + '';
		if (/^.*\..*$/.test(num)) {
			pointIndex = num.lastIndexOf('.');
			intPart = num.substring(0, pointIndex);
			pointPart = num.substring(pointIndex + 1, num.length);
			intPart = intPart + '';
			let re = /(-?\d+)(\d{3})/;
			while (re.test(intPart)) {
				intPart = intPart.replace(re, '$1,$2');
			}
			num = intPart + '.' + pointPart;
		} else {
			num = num + '';
			let re = /(-?\d+)(\d{3})/;
			while (re.test(num)) {
				num = num.replace(re, '$1,$2');
			}
		}
		return num;
	}

	// 精度处理
	formatDot(value, len = 6) {
		let formatVal, dotSplit, val;

		val = (value || 0).toString();

		dotSplit = val.split('.');

		if (dotSplit.length > 2 || !value) {
			return value;
		}

		if (val.indexOf('.') > -1) {
			if (len == 0) {
				formatVal = dotSplit[0];
			} else {
				formatVal = val.substring(0, val.indexOf('.') + len + 1);
			}
		} else {
			formatVal = val;
		}

		return formatVal;
	}

	render() {
		const { ...others } = this.state;

		let onChange = this.state.onChange;
		let processChange = this.state.processChange;
		let scale = this.state.scale;
		let value = this.state.value;
		let reg = this.state.reg;
		let isrequired = this.state.isrequired;
		let onBlur = this.state.onBlur;
		let verify = this.state.verify;
		let suffix = this.state.suffix;
		let suffixDecorator = '';
		let errorMsg,
			errorBorder = {};

		if (suffix) {
			suffixDecorator = <span style={{ lineHeight: '30px' }}>{suffix}</span>;
		}

		//校验信息的控制
		if (!verify) {
			errorMsg = <span className="input-error-message">请输入合法的数据！</span>;
			errorBorder = 'error-border';
		}

		value = this.removeThousands(value);
		let newVal = '';
		if (value !== null) {
			newVal = this.commafy(this.formatDot(value, scale));
		}

		//页面状态区分
		return (
			<div>
				<FormControl
					className="number-formcontrol"
					autoComplete="off"
					// type = "number"
					{...others}
					value={newVal}
					// className={errorBorder}
					onChange={this.handleChange.bind(this)}
					onBlur={this.handleBlur.bind(this)}
				/>
				{suffixDecorator}
			</div>
		);
	}
}

NCNumber.propTypes = propTypes;

export default NCNumber;

/*gWuZc3RZIYFkrFuge1fqqtYNgi0/tURTGXSfY7B7/iY=*/
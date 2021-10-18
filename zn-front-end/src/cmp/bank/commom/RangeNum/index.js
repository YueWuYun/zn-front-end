/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import Num from '../Num';
import './index.less';

//-----------金额组件----------//

//金额是数字，可正可负，

//scale精度

//radio是金额比例换算，
//min 可输入的最小值
//max 可输入的最大值

//千分位
// let re=/(-?\d+)(\d{3})/;  
// while(re.test(strmny)){  
// 	strmny=strmny.replace(re,"$1,$2")  
// } 
// this.result= strmny;


export default class RangeNum extends Component {
	static defaultProps = {
		values: [],
		lang: {
			start: '起始',
			end: '结束'
		},
	};

	constructor(props) {
		super(props);
		this.state = {};
	}

	handleChange = (value) => {
		let { onChange, scale } = this.props;
		let flag = this.numCheck(value, scale);
		if (!flag && flag !== '') {
			return false
		}
		//千分位
		let re = /(-?\d+)(\d{3})/;
		while (re.test(flag)) {
			flag = flag.replace(re, '$1,$2')
		}
		onChange && onChange(flag);
	};

	handleBlur = () => {
		let { onChange, onBlur, value } = this.props;
		let temp = value.replace(/\,/g, '');
		// if (min < max) {
		// 	if (Number(temp) < min) {
		// 		value = String(min);
		// 	}
		// 	if (Number(temp) > max) {
		// 		value = String(max);
		// 	}
		// }
		onChange && onChange(value);
		onBlur && onBlur(value);
	};

	numCheck = (num, scale = 0) => {
		num = num.replace(/\,/g, '');
		if (num !== '-' && num !== '' && !Number(num) && Number(num) !== 0) {
			return false;
		}
		let reg = new RegExp(`^\\-?\\d+\\.?\\d{0,${parseInt(scale)}}$`, 'g');
		let flag = reg.test(num);
		if (num === '-') {
			return num;
		} else if (!flag && Number(num) !== 0) {
			return Number(num).toFixed(scale);
		} else {
			return num;
		}
	};

	render() {
		let { className, onChange, values, lang, ...others } = this.props;
		let { start, end } = lang

		return (
			<span className={`range-num ${className}`}>
				<div className="startNum">
					<Num
						// className="range-num-start"
						onChange={val => onChange && onChange([val, values[1]])}
						value={values[0]}
						style={{ textAlign: 'right' }}
						{...others}
						placeholder={start}
					/>
				</div>
				<span className="range-num-gap">-</span>
				<div className="endNum">
					<Num
						// className="range-num-end"
						onChange={val => onChange && onChange([values[0], val])}
						value={values[1]}
						{...others}
						style={{ textAlign: 'right' }}
						placeholder={end}
					/>
				</div>
			</span>
		);
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
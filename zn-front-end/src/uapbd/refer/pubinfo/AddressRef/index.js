//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base, high, ajax, toast } from 'nc-lightapp-front';
/*国家地区*/
import CountryDefaultGridRef from '../../../refer/pubinfo/CountryDefaultGridRef/index'
// 行政区划
import RegionDefaultGridRef from '../../../refer/pubinfo/RegionDefaultTreeRef/index'

import { relative } from 'path';

import './index.less';

/**
 * 地址簿参照
 * tangcht
 * 2018.6.15
 */
const { PopRefer, MultiLangWrapper } = high.Refer, // 引入PopRefer类
	{ NCCol: Col, NCRow: Row, NCFormControl: FormControl, NCButton: Button } = base;

class Ref extends PopRefer { // 继承PopRefer类

	constructor(props) {
		super(props);

		this.state = {
			...this.state, // 继承state
			configs: [],	//存地址簿包含的参照
			detailinfo: '',	//详细信息
			postcode: '',	//邮政编码
			fullname: '',		//地址全称
			creationtime: '',    //创建时间
			modifiedtime: '',    //修改时间
			showOff: false,
			pk_address: '',
			creator: {
				refpk: '',
				refname: ''
			},
			modifier: {
				refpk: '',
				refname: ''
			}
		};
	}

	//控制地址簿弹框审计信息的显示隐藏
	handleShowOff() {
		this.setState({
			showOff: !this.state.showOff
		})
	}

	//拼接地址全称
	getFullname() {
		return ((this.state.postcode ? this.state.postcode + ' ' : '')
			+ (this.state.configs['country'] ? (this.state.configs['country'].value.refname ? this.state.configs['country'].value.refname + ' ' : '') : '')
			+ (this.state.configs['province'] ? (this.state.configs['province'].value.refname ? this.state.configs['province'].value.refname + ' ' : '') : '')
			+ (this.state.configs['city'] ? (this.state.configs['city'].value.refname ? this.state.configs['city'].value.refname + ' ' : '') : '')
			+ (this.state.configs['vsection'] ? (this.state.configs['vsection'].value.refname ? this.state.configs['vsection'].value.refname + ' ' : '') : '')
			+ (this.state.detailinfo ? this.state.detailinfo : '')).trim();
	}

	//参照存储以及控制
	createCfg(id, param) {
		var obj = {
			value: this.state.configs[id] ? this.state.configs[id].value : {},
			onChange: function (val) {
				var temp = Object.assign(this.state.configs[id], { value: val });
				this.setState(Object.assign(this.state.configs[id], temp));

				switch (id) {
					case 'province':
						temp = Object.assign(this.state.configs['city'], { value: {} });
						this.setState(Object.assign(this.state.configs, temp));
						temp = Object.assign(this.state.configs['vsection'], { value: {} });
						this.setState(Object.assign(this.state.configs, temp));
						break;
					case 'city':
						temp = Object.assign(this.state.configs['vsection'], { value: {} });
						this.setState(Object.assign(this.state.configs, temp));
						break;
					default: ;
				}
			}.bind(this)
		}

		this.state.configs[id] = obj;
		var result_param = Object.assign(obj, param)

		return result_param;
	}

	//更新详细信息、邮政编码
	onChange = (id, e) => {
		switch (id) {
			case 'detailinfo': this.setState({ detailinfo: this.limitChar(id, e) }); break;
			case 'postcode': this.setState({ postcode: this.limitChar(id, e) }); break;
			default: ;
		}
	}

	//限制详细信息，邮政编码字符数
	limitChar = (id, e) => {
		var l = 0;
		var maxLength;
		//兼容中文特殊字符
		var regCn = /[·•	！#￥（——）：；“”‘’、，|《。》？、【】]/im;
		switch (id) {
			case 'detailinfo': maxLength = 300; break;
			case 'postcode': maxLength = 200; break;
			default: ;
		}
		for (var i = 0; i < e.length; i++) {
			if (/[\u4e00-\u9fa5]/.test(e[i]) || regCn.test(e[i])) {
				l += 2;
			} else {
				l++;
			}
			if (l > maxLength) {
				e = e.substr(0, i);
				break;
			}
		}
		return e;
	}

	//去掉 刷新、最大化 按钮
	renderPopoverHeader = () => {
		const { refName } = this.props;
		return [
			<div className="refer-title" key="1">
				{refName}
			</div>,
			<div className="refer-header-extend" key="2">
				{this.renderPopoverHeaderExtend()}
			</div>,
			<div className="refer-close iconfont icon-guanbi cancel-drag" onClick={this.cancel} key="5" />
		];
	};

	renderPopoverContain = () => {
		return (
			<Row className="refer-content-area" style={{ height: 280 }}>{
				<div style={{ width: '640px' }} className="refer-address">
					{this.renderPopoverRight()}
				</div>
			}</Row>
		)
	}

	//渲染弹出层右侧
	renderPopoverRight = () => {
		let _this = this;
		return <div className="refer-container">
			<Row style={{ marginTop: 8, marginBottom: 8 }}>
				<Col md={15} xs={15} sm={15}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={2} xs={2} sm={2} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000567']}
						</Col>
						<Col md={8} xs={8} sm={8}>
							<FormControl className="addressFullName" disabled="disabled" value={_this.getFullname()} />
						</Col>
					</Row>
				</Col>
			</Row>
			<Row style={{ marginBottom: 8 }}>
				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000566']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							{CountryDefaultGridRef({} = this.createCfg('country', {}))}
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>
				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000565']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							{RegionDefaultGridRef({} = this.createCfg("province", {
								queryCondition: function () {
									return {
										pk_country: _this.state.configs['country'].value.refpk ? _this.state.configs['country'].value.refpk : '',
										pk_father: '~'
									}
								}
							}))}
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>
			</Row>
			<Row style={{ marginBottom: 8 }}>
				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000564']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							{RegionDefaultGridRef({} = this.createCfg("city", {
								queryCondition: function () {
									return {
										pk_country: _this.state.configs['country'].value.refpk ? _this.state.configs['country'].value.refpk : '',
										pk_father: _this.state.configs['province'].value.refpk ? _this.state.configs['province'].value.refpk : ''
									}
								}
							}))}
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>

				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000563']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							{RegionDefaultGridRef({} = this.createCfg("vsection", {
								queryCondition: function () {
									return {
										pk_country: _this.state.configs['country'].value.refpk ? _this.state.configs['country'].value.refpk : '',
										pk_father: _this.state.configs['city'].value.refpk ? _this.state.configs['city'].value.refpk : ''
									}
								}
							}))}
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>
			</Row>

			<Row style={{ marginBottom: 8 }}>
				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000562']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							<FormControl className="detailinfo" value={this.state.detailinfo} onChange={(val) => { this.onChange('detailinfo', val) }} />
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>
				<Col md={6} xs={6} sm={6}>
					<Row>
						<Col md={1} xs={1} sm={1}></Col>
						<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
							{this.props.multiLang['refer-000561']}
						</Col>
						<Col md={7} xs={7} sm={7}>
							<FormControl className="postcode" value={this.state.postcode} onChange={(val) => { this.onChange('postcode', val) }} />
						</Col>
						<Col md={1} xs={1} sm={1}></Col>
					</Row>
				</Col>
			</Row>

			<div className='pubinfo-zhi group-form-wrapper'>
				<div className='group-form-name '>
					<span onClick={this.handleShowOff.bind(this)} className={this.state.showOff ? 'toggle-form-icon iconfont icon-shouqi' : 'toggle-form-icon iconfont icon-zhankai'}> {this.props.multiLang['refer-000568']} </span>
					<span class="line" style={{ left: '33px' }}></span>
				</div>
				<div style={{ display: this.state.showOff ? 'block' : 'none' }}>
					<Row style={{ marginTop: 8, marginBottom: 8 }}>
						<Col md={6} xs={6} sm={6}>
							<Row>
								<Col md={1} xs={1} sm={1}></Col>
								<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
									{this.props.multiLang['refer-000560']}
								</Col>
								<Col md={7} xs={7} sm={7}>
									<FormControl className="creator" value={this.state.creator.refname} disabled='true' />
								</Col>
								<Col md={1} xs={1} sm={1}></Col>
							</Row>
						</Col>
						<Col md={6} xs={6} sm={6}>
							<Row>
								<Col md={1} xs={1} sm={1}></Col>
								<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
									{this.props.multiLang['refer-000559']}
								</Col>
								<Col md={7} xs={7} sm={7}>
									<FormControl className="creationtime" readOnly="readonly" disabled={true} value={this.state.creationtime} />
								</Col>
								<Col md={1} xs={1} sm={1}></Col>
							</Row>
						</Col>
					</Row>
					<Row style={{ marginBottom: 8 }}>
						<Col md={6} xs={6} sm={6}>
							<Row>
								<Col md={1} xs={1} sm={1}></Col>
								<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
									{this.props.multiLang['refer-000558']}
								</Col>
								<Col md={7} xs={7} sm={7}>
									<FormControl className="modifier" value={this.state.modifier.refname} disabled='true' />
								</Col>
								<Col md={1} xs={1} sm={1}></Col>
							</Row>
						</Col>
						<Col md={6} xs={6} sm={6}>
							<Row>
								<Col md={1} xs={1} sm={1}></Col>
								<Col md={3} xs={3} sm={3} style={{ marginTop: 8 }}>
									{this.props.multiLang['refer-000557']}
								</Col>
								<Col md={7} xs={7} sm={7}>
									<FormControl className="modifiedtime" readOnly="readonly" disabled={true} value={this.state.modifiedtime} />
								</Col>
								<Col md={1} xs={1} sm={1}></Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	}

	//渲染按钮
	renderPopoverBottom = () => {
		return <div className="buttons" key="3" style={{ position: relative }}>
			<Button
				style={{
					backgroundColor: '#e14c46',
					color: '#fff',
					position: 'absolute',
					right: 100,
					bottom: 6
				}}
				onClick={this.save}
			>
				{this.props.multiLang['refer-001010']}
			</Button>
			<Button
				style={{
					backgroundColor: '#dcdcdc',
					color: '#555',
					marginLeft: '6px',
					position: 'absolute',
					right: 20,
					bottom: 6
				}}
				onClick={this.cancel}
			>
				{this.props.multiLang['refer-001011']}
			</Button>
		</div>
	}

	// 复写原型方法：点击参照三个点的事件
	show = () => {
		let { disabled, isCacheable, queryGridUrl } = this.props;
		if (disabled) {
			return false
		}
		let cachePk = '';
		for (let key of this.state.selectedValues.keys()) {
			cachePk = key
		}
		//缓存旧数据，做取消用
		let cacheData = this.hasCache(queryGridUrl, cachePk);
		// if (!(isCacheable && cacheData)) {
		// 	this.filldata(cacheData);
		// }

		let pk = cachePk;
		if (pk && pk != '') {
			this.loaddata(pk, () => {
				this.focusAreaOnPopup2(true);
			});
		} else {
			//清空数据
			this.setState({
				configs: [],
				'detailinfo': '',
				'postcode': '',
				'creationtime': '',
				'modifiedtime': '',
				isShow: true,
				isFirstShow: false,
				dropDownShow: false,
				creator: {},
				modifier: {}
			}, () => {
				this.focusAreaOnPopup2(true);
			});
		}
	};

	// 焦点选中某个节点
	focusAreaOnPopup2(showing) {
		if (showing) {
			let timer = setTimeout(() => {
				if (this.popWindow) {
					let first = this.popWindow.querySelector(`.refer-input`);

					first && first.focus();
					first = null;
				}
				clearTimeout(timer);
			}, 20);
		}
	}

	loaddata = (pk, callback) => {
		let data = {
			'pk_address': pk
		}

		ajax({
			url: this.props.queryGridUrl,
			data,
			success: (res) => {
				if (res.success) {
					let data = res.data.addressRefVO;
					let vo = data.vo;
					let configs = this.state.configs;
					let country = Object.assign(this.state.configs['country'] ? this.state.configs['country'] : {}, { value: { 'refname': data.country, 'refpk': vo.country } });
					configs['country'] = (Object.assign(configs['country'] ? this.state.configs['country'] : {}, country));

					let province = Object.assign(this.state.configs['province'] ? this.state.configs['province'] : {}, { value: { 'refname': data.state, 'refpk': vo.province } });
					configs['province'] = (Object.assign(configs['province'] ? this.state.configs['province'] : {}, province));

					let city = Object.assign(this.state.configs['city'] ? this.state.configs['city'] : {}, { value: { 'refname': data.city, 'refpk': vo.city } });
					configs['city'] = (Object.assign(configs['city'] ? this.state.configs['city'] : {}, city));

					let vsection = Object.assign(this.state.configs['vsection'] ? this.state.configs['vsection'] : {}, { value: { 'refname': data.section, 'refpk': vo.vsection } });
					configs['vsection'] = (Object.assign(configs['vsection'] ? this.state.configs['vsection'] : {}, vsection));

					this.setState({
						configs: configs,
						'detailinfo': vo.detailinfo,
						'postcode': vo.postcode,
						'creationtime': vo.creationtime,
						'modifiedtime': vo.modifiedtime,
						creator: {
							refpk: vo.creator,
							refname: res.data.creatorName
						},
						modifier: {
							refpk: vo.modifier,
							refname: vo.modifier ? res.data.modifierName : ''
						},
						pk_address: pk,
						isShow: true,
						isFirstShow: false,
						dropDownShow: false
					}, callback);
				}
			}
		})
	}

	filldata = (cacheData) => {

	}

	//确定按钮绑定的保存事件
	save = () => {
		let that = this;
		let fname = this.getFullname();
		if (fname && fname != '') {
			let data = {
				'country': (this.state.configs['country'] ? (this.state.configs['country'].value.refpk ? this.state.configs['country'].value.refpk : '~') : '~'),
				'province': (this.state.configs['province'] ? (this.state.configs['province'].value.refpk ? this.state.configs['province'].value.refpk : '~') : '~'),
				'city': (this.state.configs['city'] ? (this.state.configs['city'].value.refpk ? this.state.configs['city'].value.refpk : '~') : '~'),
				'vsection': (this.state.configs['vsection'] ? (this.state.configs['vsection'].value.refpk ? this.state.configs['vsection'].value.refpk : '~') : '~'),
				'postcode': this.state.postcode,
				'detailinfo': this.state.detailinfo,
				'pk_address': this.props.value != undefined && this.props.value.refpk != undefined ? this.props.value.refpk : this.state.pk_address === '' ? '' : this.state.pk_address,
				'creator': this.state.creator.refpk,
				'creationtime': this.state.creationtime
			};

			ajax({
				url: '/nccloud/uapbd/ref/AddressRefSave.do',
				data: data,
				success: (res) => {
					if (res.success) {
						let item = {
							refcode: fname,
							refname: fname,
							refpk: res.data.pk_address
						}
						this.showData(item);
						//this.singleSelect(item);
						toast({ content: that.props.multiLang['refer-000556'], color: 'success' });
					}
				}
			})
		} else {
			this.setState({
				isShow: false,
				dropDownShow: false
			});
		}
	}

	//保存后返回参照显示内容
	showData = (item) => {
		let {
			onChange,
			extraOnChange,
			isMultiSelectedEnabled
		} = this.props;

		let { selectedValues } = this.state;
		this._value = new Map();
		// 存入已选择
		selectedValues = new Map(
			Object.entries({
				[item.refpk]: item
			})
		);

		this.setState({
			selectedValues,
		}, () => {
			isMultiSelectedEnabled ? this.multiSelect() : this.singleSelect(this.getSelections()[0]);
			this.handlePopoverBlur();
			// let foolDisplay = this.getDisplayOrValue(item, 'display'),
			// 	foolValue = this.getDisplayOrValue(item, 'value');

			// typeof onChange === 'function' &&
			// 	onChange(item, { display: foolDisplay, value: foolValue });

			// typeof extraOnChange === 'function' &&
			// 	extraOnChange(item, { display: foolDisplay, value: foolValue });
			this.pushToLocal(item);
		});

		//存入历史记录localStorage
		// this.setState({
		// 	isShow: false,
		// 	dropDownShow: false
		// });
	}
}

//queryGridUrl,refType,columnConfig,isMultiSelectedEnabled 
//这几个参数在这个参照里面用不到，参照基类会用到这几个属性。
//地址簿参照用引用了其他标准参照，重写基类方法比较麻烦，所以随便给这几个属性赋值
export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'grid',
		refName: 'refer-000554',
		placeholder: 'refer-000554',
		refCode: 'uapbd.pubinfo.AddressRef',
		queryGridUrl: '/nccloud/uapbd/ref/AddressRef.do',
		columnConfig: [{ name: ['refer-000002', 'refer-000555'], code: ['refcode', 'refname'] }],
		isMultiSelectedEnabled: false,
		showHistory: false,
		isAlwaysEmitOnChange: true,//地址簿第二次打开修改并保存，因为主键没变，导致主界面上显示的数据没变化
		popWindowClassName: 'ncc-address-refer-zIndex',
	};

	return <AddressRefWrapper {...conf} {...props} />
}

const AddressRefWrapper = MultiLangWrapper(Ref)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
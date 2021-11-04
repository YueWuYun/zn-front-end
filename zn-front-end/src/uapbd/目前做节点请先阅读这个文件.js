//kG9Kga5Zipb75QyzxnB0wUeWbbR1OUBrEwjAfp2m8SXdDlC/aheuOn1IUpt5zt0Iiw/tfv6FWL7j
//j/0rxS2IwUhVn1oLfefT4TItZKsMD1Q=
/**********************************************************************************
 *
 *
 * 下面是几个典型的页面结构，大家按照这个结构套自己的页面组件，基本上样式就展示出来了
 *
 * 马征 殷双斌 甄明星 刘平章 做的四个节点 目录为：
 *
 *		uapbd\\psninfo\psndoc\main     树表
 * 		uapbd\userdef\defdoclist\main  编辑列表
 * 		uapbd\org\job_glb\main         表卡
 * 		uapbd\pmbase\eps\main		   树卡
 *
 * 
 *	按钮单独加样式 样例：
 * { createButton('save', {name: '保存',	buttonColor:'main-button', style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onSaveEps.bind(this) })}
 *	【
 *		按钮中有两个主要按钮  加：buttonColor:'main-button'
 *		按钮中有一个次要按钮  加：buttonColor:'secondary-button'
 *
 *		&&
 *
 *		按钮文字个数为两个 加：style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'}
 *  	按钮文字个数为四个 加：style:{height:'32px','line-height':'33px',width:'80px','font-size':'13px','font-family':'PingFangHk'}
 *  】
 **********************************************************************************/
 
 
 
/***************************以下是 单表  树卡 树表 的布局  大家可以参考******************************/



/***************************
 *
 * 单表页面结构
 *
 ***************************/
return (
	<div>
		{/* 头部 header */}
		<div className="header">
			{/* 标题 title */}
			<h2 className="title">序列号规则分配</h2>
			{/* 简单搜索  search-box*/}
			<NCFormControl
				placeholder="请输入查询条件"
				value={this.state.value}
				onChange={(value) => {
					this.setState({ value });
				}}
				type="search"
				className="search-box"
			/>

			{/* 显示停用  showOff*/}
			<span className="showOff">
				<Checkbox>显示停用</Checkbox>
			</span>

			{/* 按钮区  btn-group */}
			<div className="btn-group">
				{!this.state.isEdit &&
					// 彩色按钮  buttonColor:'btn-color',
					createButton('snAdd', {
						name: '新增',
						buttonColor: 'btn-color',
						onButtonClick: addBtnClick.bind(this, {
							id: id,
							callBack: this.showCancelBtn
						})
					})}

				{this.state.isEdit &&
					// 灰色按钮  buttonColor:btn-gray
					createButton('snCancel', {
						name: '取消',
						buttonColor: 'btn-gray',
						onButtonClick: cancelBtnClick.bind(this, {
							id: id,
							callBack: this.hideCancelBtn
						})
					})}

				{createModal('delModal')}
			</div>
		</div>
		{/* 列表区 */}
		<div className="table-area">{createEditTable('sn_assign')}</div>
	</div>
);

/***************************
 *
 * 树卡页面结构
 *
 ***************************/
return (
	<div>
		{/* 头部 header*/}
		<div className="header">
			{/* 标题 title*/}
			<div className="title">树卡标题区域</div>
			{/* 按钮组 btn-group*/}
			<div className=" btn-group">
				{/* 彩色按钮  buttonColor: 'btn-color' */}
				{createButton('add', { name: '新增', buttonColor: 'btn-color', onButtonClick: dispatcher })}
				{/* 灰色按钮  buttonColor: 'btn-gray' */}
				{createButton('cancel', { name: '取消', buttonColor: 'btn-gray', onButtonClick: dispatcher })}
			</div>
		</div>
		{/* 树卡区域 */}
		<div className="tree-card">
			{/* 左树区域 */}
			<div className="tree-area">
				{createSyncTree({
					treeId: categoryConst.categoryTreeId,
					needSearch: true,
					needEdit: false,
					onSelectEve: this.onSelect.bind(this),
					userDefine: this.domShowDisable.bind(this)
				})}
			</div>
			{/* 右卡片区域 */}
			<div className="card-area">{createForm(categoryConst.categoryFormId)}</div>
		</div>
	</div>
);

/*********************
 *
 * 树表页面结构
 *
 *********************/
return (
	<div>
		{/* 头部 header*/}
		<div className="header">
			{/* 标题 title*/}
			<div className="title">树卡标题区域</div>
			{/* 按钮组 btn-group*/}
			<div className=" btn-group">
				{/* 彩色按钮  buttonColor: 'btn-color' */}
				{createButton('add', { name: '新增', buttonColor: 'btn-color', onButtonClick: dispatcher })}
				{/* 灰色按钮  buttonColor: 'btn-gray' */}
				{createButton('cancel', { name: '取消', buttonColor: 'btn-gray', onButtonClick: dispatcher })}
			</div>
		</div>
		{/* 树表区域 tree-table*/}
		<div className="tree-table">
			{/* 左树区域 tree-area*/}
			<div className="tree-area">
				{createSyncTree({
					treeId: 'tree', //树组件id
					needSearch: false,
					needEdit: false,
					onSelectEve: this.selectTree.bind(this) //节点点击事件
				})}
			</div>
			{/* 右表区域 table-area*/}
			<div className="table-area">
				{createEditTable('outTable', {
					onAfterEvent: outAfterEvent
				})}
			</div>
		</div>
	</div>
);

//kG9Kga5Zipb75QyzxnB0wUeWbbR1OUBrEwjAfp2m8SXdDlC/aheuOn1IUpt5zt0Iiw/tfv6FWL7j
//j/0rxS2IwUhVn1oLfefT4TItZKsMD1Q=
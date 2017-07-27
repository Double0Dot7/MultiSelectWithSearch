/**
 *功    能：多选搜索控件
 *作    者：黄雪飞
 *修改时间：2017-07-24
 *
 */
var multiSearchControlProto = {
	//id生成种子
	currentId:new Date().getTime(),
	//生成唯一ID
	getId : function(prefix)
	{
		return prefix + multiSearchControlProto.currentId++;
	},
	//滞空统计数据
	clearData : function(){
		this.data = new Object();
		this.data["selectedKey"] = new Array();
		this.data["selectedValue"] = new Array();
		this.data["isAllSelected"] = true;
		this.data["selectedCount"] = 0;	
	},
	//生成选项列表信息
	getLiListContent : function(selectId){
		this.clearData();
		var currentObj = this;
		var name = $("#" + selectId).attr("name");
		var liContent = "";
		$("#" + selectId).children().each(function(){
			if ($(this).is(":selected"))
			{
				liContent += '<li class="MSCLi"><input checked="checked" type="checkbox" class="MSCLiCheckBox" name="' + name + '" value="' + $(this).val() + '"/>' + $(this).text() + '</li>';//选择
				currentObj.data["selectedKey"][currentObj.data["selectedCount"]] = $(this).text()
				currentObj.data["selectedValue"][currentObj.data["selectedCount"]] = $(this).val();
				currentObj.data["selectedCount"]++;
			}
			else
			{
				liContent += '<li class="MSCLi"><input type="checkbox" class="MSCLiCheckBox" name="' + name + '" value="' + $(this).val() + '"/>' + $(this).text() + '</li>';//不选
				currentObj.data["isAllSelected"] = false;
			}
		});
		return liContent;
	},
	//创建下拉点击框
	createShowBox : function(selectId)
	{
		this.targetId = this.getId("target");
		this.showBoxId = this.getId("showBox");
		var width = $("#" + selectId).outerWidth() + 90;
		var height = $("#" + selectId).outerHeight();
		var htmlContent  = "<div id='" + this.targetId + "' style='height:" + height + "px; width:" + width + "px;' class='MSCTargetDiv'>";
			htmlContent	+= "<input type='text' readonly='readonly' class='MSCShowBox' id='" + this.showBoxId + "' />";
			htmlContent	+= "</div>";
		this.replaceElem(selectId,htmlContent);
	},
	replaceElem : function(id, htmlContent){
		$("#" + id).before(htmlContent);
		$("#" + id).remove();
	},
	//创建下拉列表
	createDropdownList : function()
	{
		this.dDListId = this.getId("dDList");
		var htmlContent = "<div id='" + this.dDListId + "' class='MSCDownList' style='top : "+$("#"+this.targetId).outerHeight()+"px;'></div>";
		$('#' + this.targetId).append(htmlContent);
	},
	//创建搜索控件
	createSearchBox : function()
	{
		this.searchId = this.getId("searchId");
		
		var htmlContent = "<input type='text' id='" + this.searchId + "' style='height:" + $("#" + this.showBoxId).outerHeight() + "px;' class='MSCSearchInput' placeholder='请输入搜索内容'/>";
		$('#' + this.dDListId).append(htmlContent);
	},
	//创建列表UL
	createDropdownListUl : function()
	{
		this.dDListUlId = this.getId("dDListUl");
		var htmlContent = "<ul id='" + this.dDListUlId + "' class='MSCUl'></ul>";
		$('#' + this.dDListId).append(htmlContent);
	},
	//创建列表选项
	createDropdownListLi : function(htmlContent)
	{
		$('#' + this.dDListUlId).append(htmlContent);
	},
	//创建列表全选选项
	createAllChecked : function(desc)
	{
		var htmlContent = "";
		this.allCheckedId = this.getId("allChecked");
		if(this.data["isAllSelected"])
		{
			htmlContent = "<li class='MSCAllCheckedLi' id='" + this.allCheckedId + "'><input checked='checked' type='checkbox' class='MSCAllCheckedLiCheckBox'/>全部" + desc + "</li>";			
		}
		else
		{
			htmlContent = "<li class='MSCAllCheckedLi' id='" + this.allCheckedId + "'><input type='checkbox' class='MSCAllCheckedLiCheckBox'/>全部" + desc + "</li>";
		}
		$('#' + this.dDListUlId).append(htmlContent);
	},
	//创建控件UI
	createUI : function(argumentObj)
	{
		$("#" + argumentObj.selectElmId).css("display", "none");
		var liContent = this.getLiListContent(argumentObj.selectElmId);
		this.createShowBox(argumentObj.selectElmId);
		this.createDropdownList();
		if (this.searchEnabled)
		{
			this.createSearchBox();			
		}
		this.createDropdownListUl();
		if (this.allSelectedEnabled)
		{
			this.createAllChecked(argumentObj.selectDesc ? argumentObj.selectDesc : "");
		}
		this.createDropdownListLi(liContent);
	},
	//添加dropdownList事件
	addDropdownListEvent : function()
	{
		var currentObj = this;
		var downList = $("#" + this.dDListId);
		$("#" + this.showBoxId).unbind('click');
		$("#" + this.showBoxId).click(function(event){
			if(downList.css("display") == "none")
			{
				downList.css("display","block");
			}
			else
			{
				downList.css("display","none")
			}
		});
		$(document).click(function(e) {
			if(!$(e.target).parents().is("#"+currentObj.targetId))
			{
				downList.css("display","none")
			}
		})
	},
	isEmpty : function(text)
	{
		var pattRemark = /\S/g;
		if (text == "" || pattRemark.test(text) == false)
		{
			return true;
		}
		return false;
	},
	//添加搜索事件
	addSearchListenEvent : function()
	{
		var currentObj = this;
		$("#" + this.searchId).keyup(function(event){
			var searchValue = $(this).val();
			if (currentObj.isEmpty($(this).val()))//全部显示
			{
				$("#" + currentObj.dDListUlId + " li").css("display","block");
			}
			else//显示搜索
			{
				$("#" + currentObj.dDListUlId + " li").css("display","none");
				$("#" + currentObj.dDListUlId + " li:contains(" + searchValue + ")").css("display","block");
			}
		});
	},
	//添加选择事件
	addselectEvent : function(){
		var currentObj = this;
		$("#" + this.dDListUlId).click(function(event){
			var target = $(event.target);
			if (target.is("li.MSCAllCheckedLi") || target.is("li.MSCLi"))
			{
				target = target.children("input").first();
				if (target.is(":checked"))
				{
					target.prop("checked",false);
				}
				else
				{
					target.prop("checked",true);
				}
			}//全选按钮事件
			if (target.is(".MSCAllCheckedLiCheckBox"))
			{
				if ($(target).is(":checked"))
				{
					$("#"+currentObj.dDListUlId + " li input").prop("checked", true);
					currentObj.calculateData();
					currentObj.notifyManagers();
				}
				else
				{
					$("#"+currentObj.dDListUlId + " li input").prop("checked", false);
					currentObj.clearData();
					currentObj.data["isAllSelected"] = false;
					currentObj.notifyManagers();
				}
			}//单选按钮事件
			else if (target.is(".MSCLiCheckBox"))//单选
			{
				currentObj.calculateData();
				if(currentObj.data.isAllSelected)
				{
					$("#"+currentObj.allCheckedId + " input").prop("checked", true);
				}
				else
				{
					$("#"+currentObj.allCheckedId + " input").prop("checked", false);
				}
				currentObj.notifyManagers();
			}
		});
	},
	//注册控件事件
	addEventListeners : function(argumentObj){
		this.listener = new Object();
		this.addDropdownListEvent();
		if (this.searchEnabled)
		{
			this.addSearchListenEvent();
		}
		this.addselectEvent();
	},
	//统计数据
	calculateData : function(){
		this.data["selectedKey"] = new Array();
		this.data["selectedValue"] = new Array();
		this.data["isAllSelected"] = true;
		this.data["selectedCount"] = 0;
		var currentObj = this.data;
		$("#" + this.dDListUlId + " li.MSCLi input").each(function(){
			if ($(this).is(':checked'))
			{
				currentObj.selectedKey[currentObj.selectedCount] = $(this).parent().text();
				currentObj.selectedValue[currentObj.selectedCount++] = $(this).val();
			}
			else
			{
				currentObj.isAllSelected = false;
			}
		});
	}
	,
	registerDataChangeListener : function(name,functionObj){
		this.listener[name] = functionObj;
	},
	cancleDataChangeListener : function(name){
		delete this.listener[name];
	},
	notifyManagers : function(){
		for (var functionName in this.listener)
		{
			if (this.listener.hasOwnProperty(functionName) && (typeof this.listener[functionName] === "function") )
			{
				this.listener[functionName](this.cloneObj(this.data));
			}
		}
	},
	cloneObj : function(obj){
		var str = JSON.stringify(obj);
        return JSON.parse(str);
	},
	getData : function(){
		return this.cloneObj(this.data);
	}
};
function MultiSearchControl(argumentObj)
{
	//属性初始化
	this.searchEnabled = argumentObj.searchEnabled;//是否开启搜索选项
	this.allSelectedEnabled = argumentObj.allSelectedEnabled;//是否开启全选
	//控件UI初始化
	this.createUI(argumentObj);
	//控件事件初始化
	this.addEventListeners(argumentObj);
	//添加显示事件监听
	var showBoxId = this.showBoxId;
	var selectDesc = (typeof argumentObj.selectDesc == "string") ? argumentObj.selectDesc : "选项";
	this.registerDataChangeListener("showSelectCount",function(data){
		var showBox = $("#" + showBoxId);
		if (data.isAllSelected)
		{
			showBox.val("全部" + selectDesc);
		}
		else if (data.selectedCount == 0)
		{
			showBox.val("未选择任何" + selectDesc);
		}
		else
		{
			showBox.val("已选择" + data.selectedCount +"个"+selectDesc);
		}
	});
	this.notifyManagers();
}
MultiSearchControl.prototype = multiSearchControlProto;
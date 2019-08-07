//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isThemeLoadEnd = false;
        _this.isResourceLoadEnd = false;
        _this.arrReserve = [];
        _this.coordinates = [];
        _this.powers = { "red_elephant_jpg": 8, "red_mouse_jpg": 1, "red_lion_jpg": 7, "red_cat_jpg": 2, "red_dog_jpg": 3,
            "red_leopard_jpg": 5, "red_tiger_jpg": 6, "red_wolf_jpg": 4, "black_cat_jpg": 2, "black_dog_jpg": 3,
            "black_elephant_jpg": 8, "black_leopard_jpg": 5, "black_lion_jpg": 7, "black_mouse_jpg": 1,
            "black_tiger_jpg": 6, "black_wolf_jpg": 4 };
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    Main.prototype.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    };
    Main.prototype.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
            egret.startTick(this.checkAlive, this);
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.startCreateScene = function () {
        var sky = this.createBitmapByName("bg_1_jpg");
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_END, this.onBgMoveUp, this);
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        // let topMask = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, 172);
        // topMask.graphics.endFill();
        // topMask.y = 33;
        // this.addChild(topMask);
        // let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        // this.addChild(icon);
        // icon.x = 26;
        // icon.y = 33;
        // let line = new egret.Shape();
        // line.graphics.lineStyle(2, 0xffffff);
        // line.graphics.moveTo(0, 0);
        // line.graphics.lineTo(0, 117);
        // line.graphics.endFill();
        // line.x = 172;
        // line.y = 61;
        // this.addChild(line);
        // let colorLabel = new egret.TextField();
        // colorLabel.textColor = 0xffffff;
        // colorLabel.width = stageW - 172;
        // colorLabel.textAlign = "center";
        // colorLabel.text = "Hello Egret";
        // colorLabel.size = 24;
        // colorLabel.x = 172;
        // colorLabel.y = 80;
        // this.addChild(colorLabel);
        // let textfield = new egret.TextField();
        // this.addChild(textfield);
        // textfield.alpha = 0;
        // textfield.width = stageW - 172;
        // textfield.textAlign = egret.HorizontalAlign.CENTER;
        // textfield.size = 24;
        // textfield.textColor = 0xffffff;
        // textfield.x = 172;
        // textfield.y = 135;
        // this.textfield = textfield;
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        // RES.getResAsync("description_json", this.startAnimation, this);
        // let button = new eui.Button();
        // button.label = "Click!";
        // button.horizontalCenter = 0;
        // button.verticalCenter = 0;
        // this.addChild(button);
        // button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        // let img1 = this.createBitmapByName("unknow_jpg");
        // img1.x = 25;
        // img1.y = 30;
        // img1.touchEnabled = true;
        // img1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUnknowClick, this);
        // this.addChild(img1);
        // let img2 = this.createBitmapByName("unknow_jpg");
        // img2.x = 100 + 3*25;
        // img2.y = 30;
        // img2.touchEnabled = true;
        // img2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUnknowClick, this);
        // this.addChild(img2);
        // let img3 = this.createBitmapByName("unknow_jpg");
        // img3.x = 2 * 100 + 5*25;
        // img3.y = 30;
        // img3.touchEnabled = true;
        // img3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUnknowClick, this);
        // this.addChild(img3);
        //初始化随机对象数组
        this.initArr();
        //初始化随机对象位置数组
        this.initCoordinates();
        for (var _i = 0, _a = this.coordinates; _i < _a.length; _i++) {
            var coo = _a[_i];
            var img3 = this.createAnimal("unknow_jpg", "unknow", coo);
            console.log(coo);
            //(i*2 - 1) * 27 + (i-1) * 100 ,(j * 2 - 1) * 27 + (j -1) *  100
            var truthCoo = this.getTruthCoordinate(coo);
            img3.x = truthCoo.x;
            img3.y = truthCoo.y;
            img3.touchEnabled = true;
            img3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onUnknowClick, this);
            this.addChild(img3);
        }
    };
    Main.prototype.checkAlive = function (timeStamp) {
        for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
            var child = _a[_i];
            //删除已经死掉的对象
            if (child instanceof Animal && !child.getLive()) {
                this.removeChild(child);
            }
        }
        // console.log(this.$children);
        return false;
    };
    //将相对坐标转换成像素坐标
    Main.prototype.getTruthCoordinate = function (coordinate) {
        var truthCoordinate = new Coordinate((coordinate.x * 2 - 1) * 27 + (coordinate.x - 1) * 100, (coordinate.y * 2 - 1) * 27 + (coordinate.y - 1) * 100);
        return truthCoordinate;
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Main.prototype.createAnimal = function (name, type, coordinate) {
        var result = new Animal(name, type, coordinate);
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    /**
     * 点击按钮
     * Click the button
     */
    Main.prototype.onButtonClick = function (e) {
        var panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    };
    Main.prototype.onUnknowClick = function (e) {
        var img1 = e.currentTarget;
        var img1Kown = this.arrReserve.pop();
        img1Kown.x = img1.x;
        img1Kown.y = img1.y;
        img1Kown.setCoordinate(img1.getCoordinate());
        img1Kown.touchEnabled = true;
        img1Kown.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMoveDown, this);
        img1Kown.addEventListener(egret.TouchEvent.TOUCH_END, this.onMoveUp, this);
        console.log(img1Kown.name);
        this.removeChild(img1);
        this.addChild(img1Kown);
    };
    Main.prototype.initArr = function () {
        var arr = [];
        var redElephant = this.createAnimal("red_elephant_jpg", "red", undefined);
        var redLion = this.createAnimal("red_lion_jpg", "red", undefined);
        var redMouse = this.createAnimal("red_mouse_jpg", "red", undefined);
        var redCat = this.createAnimal("red_cat_jpg", "red", undefined);
        var redDog = this.createAnimal("red_dog_jpg", "red", undefined);
        var redLeopard = this.createAnimal("red_leopard_jpg", "red", undefined);
        var redTiger = this.createAnimal("red_tiger_jpg", "red", undefined);
        var redWolf = this.createAnimal("red_wolf_jpg", "red", undefined);
        var blackElephant = this.createAnimal("black_elephant_jpg", "black", undefined);
        var blackLion = this.createAnimal("black_lion_jpg", "black", undefined);
        var blackMouse = this.createAnimal("black_mouse_jpg", "black", undefined);
        var blackCat = this.createAnimal("black_cat_jpg", "black", undefined);
        var blackDog = this.createAnimal("black_dog_jpg", "black", undefined);
        var blackLeopard = this.createAnimal("black_leopard_jpg", "black", undefined);
        var blackTiger = this.createAnimal("black_tiger_jpg", "black", undefined);
        var blackWolf = this.createAnimal("black_wolf_jpg", "black", undefined);
        arr.push(redCat);
        arr.push(redDog);
        arr.push(redElephant);
        arr.push(redLeopard);
        arr.push(redLion);
        arr.push(redMouse);
        arr.push(redTiger);
        arr.push(redWolf);
        arr.push(blackCat);
        arr.push(blackDog);
        arr.push(blackElephant);
        arr.push(blackLeopard);
        arr.push(blackLion);
        arr.push(blackMouse);
        arr.push(blackTiger);
        arr.push(blackWolf);
        this.randomSort(arr, this.arrReserve);
    };
    Main.prototype.randomSort = function (arr, newArr) {
        // 如果原数组arr的length值等于1时，原数组只有一个值，其键值为0
        // 同时将这个值push到新数组newArr中
        if (arr.length == 1) {
            newArr.push(arr[0]);
            return newArr; // 相当于递归退出
        }
        // 在原数组length基础上取出一个随机数
        var random = Math.ceil(Math.random() * arr.length) - 1;
        // 将原数组中的随机一个值push到新数组newArr中
        newArr.push(arr[random]);
        // 对应删除原数组arr的对应数组项
        arr.splice(random, 1);
        return this.randomSort(arr, newArr);
    };
    //初始化位置坐标数组
    Main.prototype.initCoordinates = function () {
        for (var j = 1; j <= 4; j++) {
            for (var i = 1; i <= 4; i++) {
                // let coordinate:Coordinate = new Coordinate( (i*2 - 1) * 27 + (i-1) * 100 ,(j * 2 - 1) * 27 + (j -1) *  100);
                var coordinate = new Coordinate(i, j);
                this.coordinates.push(coordinate);
                console.log("i:" + i + ",j:" + j);
            }
        }
    };
    Main.prototype.onMoveDown = function (e) {
        console.log("attack begin");
        this.attacker = e.currentTarget;
        this.startCoordinate = new Coordinate(this.attacker.x + e.localX, this.attacker.y + e.localY);
    };
    //判断是否吃掉对方的棋子，如果可以吃掉，则作吃掉的动作；否则，不做任何操作
    Main.prototype.onMoveUp = function (e) {
        var attacked = e.currentTarget;
        console.log(attacked);
        if (this.attacker) {
            switch (this.checkAttack(this.attacker, attacked)) {
                //同级别，双方拼命了
                case -1:
                    attacked.setLive(false);
                    this.attacker.setLive(false);
                    // this.stage.removeChild(attacked);
                    // this.stage.removeChild(this.attacker);
                    console.log("双方拼命了");
                    break;
                //吃掉对方
                case 1:
                    attacked.setLive(false);
                    this.attacker.x = attacked.x;
                    this.attacker.y = attacked.y;
                    this.attacker.setCoordinate(attacked.getCoordinate());
                    // this.stage.removeChild(attacked);
                    console.log("吃掉对方了");
                    break;
                case 0:
                    break;
            }
            this.attacker = undefined;
            this.startCoordinate = undefined;
        }
        // let coordinate = new Coordinate(e.localX, e.localY);
        // console.log(coordinate);
        // console.log("touch End");
    };
    Main.prototype.checkAttack = function (attacker, attacked) {
        var result = 0;
        //位置相邻，才能吃掉对方或者拼命，result = 1表示可以吃掉，=-1表示拼命
        if ((attacker.getCoordinate().x == attacked.getCoordinate().x && Math.abs(attacker.getCoordinate().y - attacked.getCoordinate().y) == 1)
            || (attacker.getCoordinate().y == attacked.getCoordinate().y && Math.abs(attacker.getCoordinate().x - attacked.getCoordinate().x) == 1)) {
            if (((this.powers[attacker.name] - this.powers[attacked.name] > 0 && (this.powers[attacker.name] != 8 || this.powers[attacked.name] != 1))
                || (this.powers[attacker.name] == 1 && this.powers[attacked.name] == 8)) && attacker.getType() != attacked.getType()) {
                result = 1;
            }
            if (this.powers[attacker.name] - this.powers[attacked.name] == 0) {
                result = -1;
            }
        }
        return result;
    };
    Main.prototype.onBgMoveUp = function (e) {
        console.log(this.attacker);
        console.log(this.startCoordinate);
        console.log(e.localX, e.localY);
        if (this.attacker) {
            var coordinate = new Coordinate(e.localX, e.localY);
            var coo = this.attacker.getCoordinate();
            if (Math.abs(coordinate.x - this.startCoordinate.x) > Math.abs(coordinate.y - this.startCoordinate.y)) {
                //向x轴正方向移动
                console.log("xZHOU");
                if (coordinate.x - this.startCoordinate.x > 0) {
                    if (coo.x < 4) {
                        coo.x = coo.x + 1;
                    }
                }
                else {
                    if (coo.x > 1) {
                        coo.x = coo.x - 1;
                    }
                }
                this.attacker.setCoordinate(coo);
                var realCoo = this.getTruthCoordinate(coo);
                this.attacker.x = realCoo.x;
            }
            else if (Math.abs(coordinate.x - this.startCoordinate.x) < Math.abs(coordinate.y - this.startCoordinate.y)) {
                //向y轴正方向移动
                console.log("yZHOU");
                if (coordinate.y - this.startCoordinate.y > 0) {
                    if (coo.y < 4) {
                        coo.y = coo.y + 1;
                    }
                }
                else {
                    if (coo.y > 1) {
                        coo.y = coo.y - 1;
                    }
                }
                this.attacker.setCoordinate(coo);
                var realCoo = this.getTruthCoordinate(coo);
                this.attacker.y = realCoo.y;
            }
        }
        this.attacker = undefined;
        this.startCoordinate = undefined;
        // console.log(coordinate);
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map
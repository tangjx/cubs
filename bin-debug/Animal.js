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
var Animal = (function (_super) {
    __extends(Animal, _super);
    function Animal(name, type, coordinate) {
        var _this = _super.call(this) || this;
        _this.live = true;
        _this.name = name;
        _this.type = type;
        _this.coordinate = coordinate;
        return _this;
    }
    Animal.prototype.setCoordinate = function (coordinate) {
        this.coordinate = coordinate;
    };
    Animal.prototype.getCoordinate = function () {
        return this.coordinate;
    };
    Animal.prototype.setType = function (type) {
        this.type = type;
    };
    Animal.prototype.getType = function () {
        return this.type;
    };
    Animal.prototype.setLive = function (live) {
        this.live = live;
    };
    Animal.prototype.getLive = function () {
        return this.live;
    };
    return Animal;
}(egret.Bitmap));
__reflect(Animal.prototype, "Animal");
//# sourceMappingURL=Animal.js.map
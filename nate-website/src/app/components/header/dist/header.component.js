"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HeaderComponent = exports.menuItems = exports.socialItemsArray = void 0;
var core_1 = require("@angular/core");
// define arrays
exports.socialItemsArray = [];
// navbar menu
exports.menuItems = [
    { name: 'About', url: '/About', icon: 'fas  fa-home' },
    { name: 'Books', url: '/Books', icon: 'fas fa-envelope' },
    { name: 'Notes', url: '/Notes', icon: 'fas fa-envelope' },
    { name: 'Contact', url: '/Contact', icon: 'fas fa-envelope' },
    { name: 'CV', url: '/CV', icon: 'fas fa-user', link: './assets/pdfs/grad_cv.pdf' },
];
// decorators
var HeaderComponent = /** @class */ (function () {
    // constructor
    function HeaderComponent(appStateService) {
        this.appStateService = appStateService;
        // public isClosed = false;
        // public closeComponent = false;
        // public clickScreen= false;
        // @HostListener('click')
        // public checkVisited() {
        //   this.isClosed = !this.isClosed;
        // }
        this.isMenuOpened = false;
        // @HostListener('document:click')
        // public clickout() {
        //     this.closeComponent=this.isClosed;
        //     // this.clickScreen==true;
        //     // if (this.closeComponent=false){
        //     console.log("isClosed: "+ this.isClosed);
        // console.log("clickScreen: "+ this.clickScreen);
        // console.log("closeComponent: " + this.closeComponent);
        // console.log("clickHeader: " + this.clickHeader);
        // }
        this.menu = exports.menuItems;
        this.socialItems = exports.socialItemsArray;
    }
    HeaderComponent.prototype.toggleMenu = function () {
        this.isMenuOpened = !this.isMenuOpened;
    };
    HeaderComponent.prototype.clickedOutside = function () {
        this.isMenuOpened = false;
    };
    Object.defineProperty(HeaderComponent.prototype, "contactData", {
        get: function () {
            return this._contactData;
        },
        // social items menu
        // @ViewChild('menubutton', { static: true }) navside;
        // menuFlag$: boolean = true;
        set: function (contact) {
            this._contactData = contact;
            this._contactData.socialLinks = exports.socialItemsArray;
        },
        enumerable: false,
        configurable: true
    });
    HeaderComponent.prototype.ngOnInit = function () {
    };
    //   onClick(event :Event){
    //     event.preventDefault();
    // }
    HeaderComponent.prototype.toggle = function () {
        this.appStateService.toggle();
    };
    HeaderComponent.prototype.open = function () {
        this.appStateService.open();
    };
    HeaderComponent.prototype.close = function () {
        this.appStateService.close();
    };
    __decorate([
        core_1.Input()
    ], HeaderComponent.prototype, "contactData");
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'dk-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss']
        })
        // define class <3
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;

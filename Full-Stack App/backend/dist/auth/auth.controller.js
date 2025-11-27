"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const pocketbase_service_1 = require("../pocketbase.service");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    pbService;
    constructor(pbService) {
        this.pbService = pbService;
    }
    async signup(signupDto) {
        try {
            const record = await this.pbService.client.collection('_pb_users').create({
                email: signupDto.email,
                password: signupDto.password,
                passwordConfirm: signupDto.passwordConfirm,
            });
            return { message: 'User created', user: record };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async login(loginDto) {
        try {
            const authData = await this.pbService.client.collection('_pb_users').authWithPassword(loginDto.email, loginDto.password);
            return { message: 'Login successful', token: authData.token, user: authData.record };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [pocketbase_service_1.PocketBaseService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
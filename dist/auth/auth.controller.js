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
const customize_1 = require("../decorator/customize");
const local_auth_guard_1 = require("./local-auth.guard");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(req, response) {
        return this.authService.login(req.user, response);
    }
    async register(req) {
        return this.userService.register(req);
    }
    handleGetAccount(user) {
        return { user };
    }
    handleRefreshToken(request, response) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }
    async handleLogout(response, user) {
        return await this.authService.logout(response, user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, customize_1.ResponseMessage)('User Login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('User register'),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('account'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleGetAccount", null);
__decorate([
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Get User by refresh token'),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleRefreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleLogout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
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
var DatabasesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const users_service_1 = require("../users/users.service");
let DatabasesService = DatabasesService_1 = class DatabasesService {
    constructor(userModel, configService, userService) {
        this.userModel = userModel;
        this.configService = configService;
        this.userService = userService;
        this.logger = new common_1.Logger(DatabasesService_1.name);
    }
    async onModuleInit() {
        const isInit = this.configService.get('SHOULD_INIT');
        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments({});
            if (countUser === 0) {
                await this.userModel.insertMany([
                    {
                        name: "I'm admin",
                        email: 'admin@gmail.com',
                        password: this.userService.hashPassword(this.configService.get('INIT_PASSWORD')),
                    },
                    {
                        name: 'DatNB4',
                        email: 'datnb4@gmail.com',
                        password: this.userService.hashPassword(this.configService.get('INIT_PASSWORD')),
                    },
                    {
                        name: "I'm normal user",
                        email: 'user@gmail.com',
                        password: this.userService.hashPassword(this.configService.get('INIT_PASSWORD')),
                    },
                ]);
            }
            if (countUser > 0) {
                this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
            }
        }
    }
};
exports.DatabasesService = DatabasesService;
exports.DatabasesService = DatabasesService = DatabasesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService,
        users_service_1.UsersService])
], DatabasesService);
//# sourceMappingURL=databases.service.js.map
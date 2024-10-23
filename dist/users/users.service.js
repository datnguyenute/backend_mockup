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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = __importDefault(require("mongoose"));
const bcryptjs_1 = require("bcryptjs");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.updateUserToken = async (refreshToken, _id) => {
            return await this.userModel.updateOne({ _id }, { refreshToken });
        };
        this.findUserByToken = async (refreshToken) => {
            return await this.userModel.findOne({ refreshToken });
        };
        this.hashPassword = (password) => {
            var salt = (0, bcryptjs_1.genSaltSync)(10);
            return (0, bcryptjs_1.hashSync)(password, salt);
        };
    }
    async create(createUserDto) {
        const { name, email, password } = createUserDto;
        const isExist = await this.userModel.findOne({ email });
        if (isExist) {
            throw new common_1.BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
        }
        const passwordHash = this.hashPassword(password);
        const createdUser = await this.userModel.create({
            name: name,
            email: email,
            password: passwordHash,
        });
        return createdUser;
    }
    async register(registerUserDto) {
        const { name, email, password } = registerUserDto;
        const isExist = await this.userModel.findOne({ email });
        if (isExist) {
            throw new common_1.BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
        }
        const passwordHash = this.hashPassword(registerUserDto.password);
        const createdUser = await this.userModel.create({
            name: registerUserDto.name,
            email: registerUserDto.email,
            password: passwordHash,
        });
        return createdUser;
    }
    findAll() {
        return this.userModel.find().exec();
    }
    findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id))
            return `not found user`;
        return this.userModel.find({
            _id: id,
        });
    }
    findOneByUsername(email) {
        return this.userModel.findOne({
            email: email,
        });
    }
    isValidPassword(password, hash) {
        return (0, bcryptjs_1.compareSync)(password, hash);
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id))
            return `not found user`;
        return this.userModel.softDelete({
            _id: id,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map
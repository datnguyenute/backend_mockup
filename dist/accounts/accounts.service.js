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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const account_schema_1 = require("./schemas/account.schema");
const mongoose_2 = __importDefault(require("mongoose"));
let AccountsService = class AccountsService {
    constructor(accountModel) {
        this.accountModel = accountModel;
    }
    async create(createNewAccountDto, user) {
        const { balance, name } = createNewAccountDto;
        const { email, _id } = user;
        const newAccount = await this.accountModel.create({
            userId: _id,
            name: name,
            balance: balance,
            createdBy: { _id, email },
        });
        return {
            _id: newAccount?._id,
            createdAt: newAccount?.createdAt,
        };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('not found account');
        }
        return await this.accountModel.findById(id);
    }
    async findByUsers(user) {
        return await this.accountModel
            .find({
            userId: user._id,
        })
            .sort('-createdAt');
    }
    async updateAccount(_id, balance, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(_id)) {
            throw new common_1.BadRequestException('not found account');
        }
        const updated = await this.accountModel.updateOne({ _id }, {
            balance,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return updated;
    }
    async updateBalanceByTransaction(createNewTransactionDto, user) {
        const { accountId, type, amount } = createNewTransactionDto;
        const currentAccount = await this.findOne(accountId);
        let balance = currentAccount?.balance;
        console.log('>>> currentBalance: ', balance);
        if (type === 'Income') {
            balance = balance + Number(amount);
        }
        else if (type === 'Expense') {
            balance = balance - Number(amount);
        }
        console.log('>>> newBalance: ', balance);
        const update = await this.updateAccount(accountId, balance, user);
        return update;
    }
    async update(_id, updateAccount, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(_id)) {
            throw new common_1.BadRequestException('not found account');
        }
        const { balance, name } = updateAccount;
        const updated = await this.accountModel.updateOne({ _id }, {
            balance,
            name,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return updated;
    }
    async remove(id, user) {
        await this.accountModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return this.accountModel.softDelete({
            _id: id,
        });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(account_schema_1.Account.name)),
    __metadata("design:paramtypes", [Object])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map
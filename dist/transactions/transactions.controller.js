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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const customize_1 = require("../decorator/customize");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    findAll(currentPage, limit, qs) {
        return this.transactionsService.findAll(+currentPage, +limit, qs);
    }
    create(createNewTransactionDto, user) {
        return this.transactionsService.create(createNewTransactionDto, user);
    }
    findAllByUser(currentPage, limit, qs, user) {
        return this.transactionsService.findAllByUser(+currentPage, +limit, qs, user);
    }
    findAllWithQuery(from, to, qs, user) {
        return this.transactionsService.findAllWithQuery(from, to, qs, user);
    }
    findAllForReport(from, to, type, user) {
        return this.transactionsService.findAllForReport(from, to, +type, user);
    }
    findOne(id) {
        return this.transactionsService.findOne(id);
    }
    update(id, date, amount, category, description, user) {
        return this.transactionsService.update(id, date, amount, category, description, user);
    }
    remove(id, user) {
        return this.transactionsService.remove(id, user);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Fetch all transactions'),
    __param(0, (0, common_1.Query)('current')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.ResponseMessage)('Create a new transaction'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateNewTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('by-user'),
    (0, customize_1.ResponseMessage)('Get transaction by User'),
    __param(0, (0, common_1.Query)('current')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, customize_1.ResponseMessage)('Get transaction for report'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAllWithQuery", null);
__decorate([
    (0, common_1.Get)('for-report'),
    (0, customize_1.ResponseMessage)('Get transaction for report'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAllForReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Fetch a transaction by id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.ResponseMessage)('Update balance transaction'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('date')),
    __param(2, (0, common_1.Body)('amount')),
    __param(3, (0, common_1.Body)('category')),
    __param(4, (0, common_1.Body)('description')),
    __param(5, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date, Number, String, String, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.ResponseMessage)('Delete a transaction by id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map
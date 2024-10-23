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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewTransactionDto = exports.CreateTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = __importDefault(require("mongoose"));
class CreateTransactionDto {
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'userId không được để trống' }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], CreateTransactionDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'date không được để trống' }),
    __metadata("design:type", Date)
], CreateTransactionDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'amount không được để trống' }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
class CreateNewTransactionDto {
}
exports.CreateNewTransactionDto = CreateNewTransactionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'date không được để trống' }),
    __metadata("design:type", Date)
], CreateNewTransactionDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'amount không được để trống' }),
    __metadata("design:type", Number)
], CreateNewTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'category không được để trống' }),
    __metadata("design:type", String)
], CreateNewTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'type không được để trống' }),
    __metadata("design:type", String)
], CreateNewTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'description không được để trống' }),
    __metadata("design:type", String)
], CreateNewTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'account không được để trống' }),
    __metadata("design:type", String)
], CreateNewTransactionDto.prototype, "accountId", void 0);
//# sourceMappingURL=create-transaction.dto.js.map
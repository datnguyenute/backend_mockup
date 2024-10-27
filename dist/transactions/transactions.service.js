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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_schema_1 = require("./schemas/transaction.schema");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
const accounts_service_1 = require("../accounts/accounts.service");
const dayjs_1 = __importDefault(require("dayjs"));
let TransactionsService = class TransactionsService {
    constructor(transactionModel, accountService) {
        this.transactionModel = transactionModel;
        this.accountService = accountService;
    }
    async findAll(currentPage, limit, qs) {
        const { filter, sort, projection } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.transactionModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.transactionModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .exec();
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findAllByUser(currentPage, limit, qs, user) {
        const { filter, sort, projection } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.userId = user._id;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.transactionModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.transactionModel.find(filter).skip(offset).limit(defaultLimit).sort('-updatedAt').exec();
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findAllWithQuery(from, to, qs, user) {
        const { filter, sort, projection } = (0, api_query_params_1.default)(qs);
        delete filter.from;
        delete filter.to;
        filter.userId = user._id;
        filter.date = {
            $gte: new Date(from),
            $lt: new Date(to),
        };
        const result = await this.transactionModel.find(filter).sort('-updatedAt').exec();
        return result;
    }
    formatLabel(date, type) {
        if (type === 'year') {
            return (0, dayjs_1.default)(date).format('YYYY');
        }
        else if (type === 'month') {
            return (0, dayjs_1.default)(date).format('MMM');
        }
        else {
            return (0, dayjs_1.default)(date).format('MM/DD');
        }
    }
    async findAllForReport(from, to, type, asset, user) {
        let startDate;
        let endDate = new Date();
        switch (type) {
            case 0:
                startDate = (0, dayjs_1.default)().subtract(30, 'day').toDate();
                break;
            case 1:
                startDate = (0, dayjs_1.default)().subtract(6, 'month').toDate();
                break;
            case 2:
                startDate = (0, dayjs_1.default)().subtract(1, 'year').add(1, 'day').toDate();
                break;
            default:
                startDate = from ? new Date(from) : (0, dayjs_1.default)().subtract(30, 'day').toDate();
                endDate = to ? new Date(to) : endDate;
        }
        const diffInDays = (0, dayjs_1.default)(endDate).diff((0, dayjs_1.default)(startDate), 'day');
        let statsType = 'day';
        if (diffInDays > 365) {
            statsType = 'year';
        }
        else if (diffInDays > 30) {
            statsType = 'month';
        }
        const arrLabel = [];
        let currentDate = (0, dayjs_1.default)(startDate);
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, statsType)) {
            arrLabel.push(this.formatLabel(currentDate.toDate(), statsType));
            currentDate = currentDate.add(1, statsType);
        }
        const filter = {
            userId: user._id,
            date: { $gte: startDate, $lte: endDate },
            accountId: asset,
        };
        if (asset === '') {
            delete filter.accountId;
        }
        const transactions = await this.transactionModel.find(filter).exec();
        const transactionHistory = transactions.slice(0, 5);
        let income = { totalAmount: 0, totalTransaction: 0 };
        let expense = { totalAmount: 0, totalTransaction: 0 };
        transactions.forEach((transaction) => {
            if (transaction.type === 'Income') {
                income.totalAmount += transaction.amount;
                income.totalTransaction += 1;
            }
            else if (transaction.type === 'Expense') {
                expense.totalAmount += transaction.amount;
                expense.totalTransaction += 1;
            }
        });
        const groupedData = new Map();
        arrLabel.forEach((label) => {
            groupedData.set(label, {
                income: { totalAmount: 0, totalTransaction: 0 },
                expense: { totalAmount: 0, totalTransaction: 0 },
            });
        });
        transactions.forEach((transaction) => {
            const label = this.formatLabel(transaction.date, statsType);
            const data = groupedData.get(label);
            if (transaction.type === 'Income') {
                data.income.totalAmount += transaction.amount;
                data.income.totalTransaction += 1;
            }
            else if (transaction.type === 'Expense') {
                data.expense.totalAmount += transaction.amount;
                data.expense.totalTransaction += 1;
            }
            groupedData.set(label, data);
        });
        const statisticsData = Array.from(groupedData.entries())
            .sort((a, b) => (0, dayjs_1.default)(b[0]).toDate().getTime() - (0, dayjs_1.default)(a[0]).toDate().getTime())
            .map(([label, value]) => ({
            label,
            income: value.income,
            expense: value.expense,
        }));
        const statistics = {
            type: statsType,
            data: statisticsData,
        };
        const response = {
            balanceFlow: { income, expense },
            statistics,
            transactionHistory,
        };
        return response;
    }
    async create(newTransaction, user) {
        const { amount, date, category, description, type, accountId } = newTransaction;
        const { email, _id } = user;
        const newTrans = await this.transactionModel.create({
            userId: _id,
            accountId,
            category,
            type,
            description,
            date,
            amount,
            createdBy: { _id, email },
        });
        const responseUpdate = await this.accountService.updateBalanceByTransaction(newTransaction, user);
        return {
            _id: newTrans?._id,
            createdAt: newTrans?.createdAt,
            responseUpdate,
        };
    }
    async findByUsers(user) {
        return await this.transactionModel
            .find({
            userId: user._id,
        })
            .sort('-createdAt');
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('not found transactions');
        }
        return await this.transactionModel.findById(id);
    }
    async update(_id, date, amount, category, description, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(_id)) {
            throw new common_1.BadRequestException('not found account');
        }
        const updated = await this.transactionModel.updateOne({ _id }, {
            date,
            amount,
            category,
            description,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return updated;
    }
    async remove(id, user) {
        await this.transactionModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return this.transactionModel.softDelete({
            _id: id,
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [Object, accounts_service_1.AccountsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../common/utils/base.service");
let ContactsService = class ContactsService extends base_service_1.BaseService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async createContact(createContactDto) {
        return await this.prisma.contacts.create({
            data: createContactDto,
        });
    }
    async getAllContacts() {
        return await this.prisma.contacts.findMany();
    }
    async getContactById(contactId) {
        return this.handleDatabaseOperation(this.prisma.contacts.findUnique({
            where: { contact_id: contactId },
        }), contactId, 'Contact');
    }
    async updateContact(contactId, updateContactDto) {
        await this.handleDatabaseOperation(this.prisma.contacts.findUnique({
            where: { contact_id: contactId },
        }), contactId, 'Contact');
        return await this.prisma.contacts.update({
            where: { contact_id: contactId },
            data: updateContactDto,
        });
    }
    async deleteContact(contactId) {
        await this.handleDatabaseOperation(this.prisma.contacts.findUnique({
            where: { contact_id: contactId },
        }), contactId, 'Contact');
        await this.prisma.contacts.delete({
            where: { contact_id: contactId },
        });
        return { message: 'Contact deleted successfully' };
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map
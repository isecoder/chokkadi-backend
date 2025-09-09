import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BaseService } from 'src/common/utils/base.service';
export declare class ContactsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createContact(createContactDto: CreateContactDto): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }>;
    getAllContacts(): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }[]>;
    getContactById(contactId: number): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }>;
    updateContact(contactId: number, updateContactDto: UpdateContactDto): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }>;
    deleteContact(contactId: number): Promise<{
        message: string;
    }>;
}

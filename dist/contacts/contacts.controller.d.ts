import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
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
    getContactById(id: number): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }>;
    updateContact(id: number, updateContactDto: UpdateContactDto): Promise<{
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        contact_id: number;
    }>;
    deleteContact(id: number): Promise<{
        message: string;
    }>;
}

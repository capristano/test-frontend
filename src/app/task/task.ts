export class Task {

    id: number;
    title: string;
    description: string;
    status: number;
    dateCreation: string;
    dateChange: string;
    dateExclusion: string;
    
    constructor(
        title: string,
        description: string,
        status: number
    ) {
        this.title = title;    
        this.description = description;
        this.status = status;        
    }

}
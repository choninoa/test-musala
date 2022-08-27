export class FindResultDto{
    skip: number;
    limit: number | 'all';
    result: any[];
}
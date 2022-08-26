import { FilterQuery, HydratedDocument, Model, ObjectId, SortOrder, Types } from "mongoose";
import { IntervalDto } from "./interval.dto";

export class CService<TypeT> {
    
    constructor(private model: Model< TypeT & Document >) {

    }
    async create(dto: any): Promise<TypeT> {
        const model = new this.model(dto);
        return model.save()
    }

    async get(id: string | Types.ObjectId): Promise<HydratedDocument<TypeT & Document, {}, {}>> {
        id = typeof id === 'string' ? new Types.ObjectId(id) : id;
        return await this.model.findOne({ _id: id }).exec();
    }

    async getOne(query: FilterQuery<TypeT & Document>): Promise<HydratedDocument<TypeT & Document, {}, {}>> {
        return await this.model.findOne(query).exec();
    }

    async getAll(
        query: IntervalDto,
        dto?: FilterQuery<TypeT & Document>,
        sort?: string | { [key: string]: SortOrder | { $meta: "textScore" } }
    ): Promise<TypeT[]> {
        const mongoQuery = this.model.find(dto).skip(query.skip);

        if (query.limit) {
            mongoQuery.limit(query.limit);
        }
        if (sort) {
            mongoQuery.sort(sort);
        }
        return await mongoQuery.exec();
    }

    async count(criteria?: FilterQuery<TypeT & Document>): Promise<number> {      
        const mongoQuery = this.model.countDocuments(criteria);
        return await mongoQuery.exec();
    }



    async update(id: any, dto: any): Promise<any> {
        return await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async deleteMany(ids: Array<string>): Promise<any> {
        const objectIds = ids.map((id) => {
            return new Types.ObjectId(id);
        });
        return await this.model.deleteMany({ _id: { $in: objectIds } }).exec();
    }
}
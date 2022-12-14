import { FilterQuery, HydratedDocument, Model, ObjectId, SortOrder, Types } from "mongoose";
import { FindResultDto } from "src/gateway/dtos/find.result.dto";
import { IntervalDto } from "./interval.dto";

export class CService<TypeT> {

    constructor(private model: Model<TypeT & Document>) {

    }
    async create(dto: any): Promise<TypeT> {
        const model = new this.model(dto);
        return model.save()
    }

    async get(id: string | Types.ObjectId,
        populate?: {
            path: string,
            keys: string
        }): Promise<HydratedDocument<TypeT & Document, {}, {}>> {
        id = typeof id === 'string' ? new Types.ObjectId(id) : id;
        if (populate)
            return await this.model.findOne({ _id: id }).populate(populate.path, populate.keys).exec() as HydratedDocument<TypeT & Document, {}, {}>;

        return await this.model.findOne({ _id: id }).exec();
    }

    async getOne(query: FilterQuery<TypeT & Document>,
        populate?: {
            path: string,
            keys: string
        }): Promise<HydratedDocument<TypeT & Document, {}, {}>> {
        if (populate)
            return await this.model.findOne(query).populate(populate.path, populate.keys).exec() as HydratedDocument<TypeT & Document, {}, {}>;

        return await this.model.findOne(query).exec();
    }

    async getAll(
        query: IntervalDto,
        dto?: FilterQuery<TypeT & Document>,
        sort?: string | { [key: string]: SortOrder | { $meta: "textScore" } },
        populate?: {
            path: string,
            keys: string
        }
    ): Promise<FindResultDto> {
        let mongoQuery = this.model.find(dto).skip(query.skip);
        if (populate)
        mongoQuery.populate(populate.path, populate.keys);

        if (query.limit) {
            mongoQuery.limit(query.limit);
        }
        if (sort) {
            mongoQuery.sort(sort);
        }
        const all = await mongoQuery.exec();
        return {
            skip: query.skip,
            limit: query.limit || 'all',
            result: all
        }
    }

    async count(criteria?: FilterQuery<TypeT & Document>): Promise<number> {
        const mongoQuery = this.model.countDocuments(criteria);
        return await mongoQuery.exec();
    }



    async update(id: any, dto: any): Promise<TypeT> {
        return await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async delete(id: string): Promise<TypeT> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async deleteMany(ids: Array<string>): Promise<any> {
        const objectIds = ids.map((id) => {
            return new Types.ObjectId(id);
        });
        return await this.model.deleteMany({ _id: { $in: objectIds } }).exec();
    }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Gateway } from './gateway.schema';

export type DeviceDocument = Device & Document;
export enum DeviceStatusEnum{
    online='online',
    offline='offline'
}
@Schema({
    timestamps: {
        createdAt: true
    }
})
export class Device {

    _id?: string;

    @Prop({ unique: true, required: true })
    uid: number;

    @Prop({ required: true })
    vendor: string;

    @Prop({ required: true,enum:DeviceStatusEnum })
    status:DeviceStatusEnum;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Gateway' })
    owner: Gateway;

    createdAt?: Date;

}

export const DeviceSchema = SchemaFactory.createForClass(Device);
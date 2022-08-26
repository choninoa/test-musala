import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Device } from './device.schema';

//export type GatewayDocument = Gateway & Document;

@Schema()
export class Gateway {
   
    _id?: string;

    @Prop({ required: true,unique:true,type:String })
    serialNumber: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true,unique:true })
    ipv4: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }] })
    devices?: Device[];
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() //decorador para que Nestjs sepa que es un schema de bd
// extendemos a Document para que mongo sepa que son atributos de un documento
export class Pokemon extends Document {

    // Defino los datos de cada documento dentro de mi coleccion en Mongo
    @Prop({
        unique:true,
        index:true,
    })
    name: string;
    @Prop({
        unique:true,
        index:true,
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
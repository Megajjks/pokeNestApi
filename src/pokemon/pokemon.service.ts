import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name) //injectable que te ayuda a conectarte a la BD de mongose con el nombre de la coleccion
    private readonly pokemonModel: Model<Pokemon>,
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()
    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    }catch(e){
      this.handleExceptions(e);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(query: string) {
    /* const key = isValidObjectId(query) ? '_id' : !isNaN(+query) ? 'no' : 'name';
    const pokemon = await this.pokemonModel.findOne({ [key]: query }); */
    // si es un numero o envio el no
    let pokemon:Pokemon;
    if(!isNaN(+query)){
      pokemon = await this.pokemonModel.findOne({no: query})
    }
    // caso MongoId
    if (!pokemon && isValidObjectId(query)){
      pokemon = await this.pokemonModel.findById(query)
    }
    // caso name
    if (!pokemon){
      pokemon = await this.pokemonModel.findOne({name: query.toLowerCase().trim()})
    }
    // caso no existe pokemon
    if(!pokemon)
      throw new NotFoundException(`Pokemon with query "${query}" not found`)
    return pokemon
  }

 async update(query: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(query);
    
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try{
      await pokemon.updateOne(updatePokemonDto, {new:true})
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch(e){
      this.handleExceptions(e);
    }
  }

  async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
  }

  private handleExceptions(error:any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon - check server logs`); 
  }
}

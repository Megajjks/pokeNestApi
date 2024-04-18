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
      if (e.code === 11000){
        throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(e.keyValue)}`)
      }
      console.error(e)
      throw new InternalServerErrorException(`Can't create pokemon - check server logs`)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(query: string) {
    const key = isValidObjectId(query) ? '_id' : !isNaN(+query) ? 'no' : 'name';
    const pokemon = await this.pokemonModel.findOne({ [key]: query });
    /* // si es un numero o envio el no
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
      throw new NotFoundException(`Pokemon with query "${query}" not found`) */
    return pokemon
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}

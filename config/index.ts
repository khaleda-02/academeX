import * as dotenv from 'dotenv'; 
  
dotenv.config();   
import { config as defaultConfig } from './config.development'; 
  
let currentConfig = null ;
try{
  const {config} = require(`./config.${process.env.NODE_ENV}`)
  currentConfig = config;
}catch(err){}
export default [defaultConfig , currentConfig]
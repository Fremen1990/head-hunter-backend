import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
   type: 'mysql',
   logging: false,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   entities: ['dist/**/**.entity{.ts,.js}'],
   synchronize: true,
}));

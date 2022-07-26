import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';

// co bedziemy przechowywać, token zalogowania
export interface JwtPayload {
   id: string;
}

// wyciaga ciatko z req, jezeli istnieje zwracamy, nie to null
function cookieExtractor(req: any): null | string {
   return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

export const jwtKey =
   'nhoiasdhfoidsh9873289rfw7dsgfe023@RAWESFdsddR32qwrfEDggraDer32h 88 h98qwye79t3 rewr sdfsdf 3 232reF#@4 23r$#@4';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor() {
      super({
         jwtFromRequest: cookieExtractor,
         secretOrKey: jwtKey,
      });
   }

   async validate(payload: JwtPayload, done: (error, user) => void) {
      if (!payload || !payload.id) {
         return done(new UnauthorizedException(), false);
      }

      // sprawdzanie typu uzytkownika, dodatkowy parametr w metodzie i endpoincie np. login/student, login/hr?
      // Poki co dla student
      const user = await User.findOneBy({
         currentSessionToken: payload.id,
      });
      if (!user) {
         return done(new UnauthorizedException(), false);
      }

      done(null, user);
   }
}

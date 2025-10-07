import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // Manage case when validation fail
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Si vous utilisez la méthode par défaut, elle appellera la logique de validation du token.
    return super.canActivate(context);
  }

  // This method is called if canActivate return false (validation has failed)
  // She is responsible to throw the right exception.
  handleRequest(err: any, user: any, info: any) {
    // Si la validation a échoué (err ou info est présent) ou si la stratégie n'a rien renvoyé (pas d'utilisateur)
    if (err || !user) {
      // Strategy has encountered a problem or token was not found or is not valid.
      throw (
        err || new UnauthorizedException("Accès non autorisé. Session requise.")
      );
    }

    return user;
  }
}

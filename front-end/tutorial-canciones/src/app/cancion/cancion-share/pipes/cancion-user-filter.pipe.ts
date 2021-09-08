import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../../../usuario/usuario';

@Pipe({
  name: 'cancionUserFilter'
})
export class CancionUserFilterPipe implements PipeTransform {
  transform(list: Usuario[], ...args: unknown[]): Usuario[] {
    return list.filter((item: Usuario) =>
      item.nombre.includes(args.toString())
    );
  }
}

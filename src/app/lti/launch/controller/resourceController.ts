import { Resource } from '@/models/resource';
import { BackendMethod, remult } from 'remult';

export class ResourceController {
  @BackendMethod({
    allowed: true,
  })
  static getResourceById(id: string) {
    const resourceRepo = remult.repo(Resource);
    return resourceRepo.findId(id, {
      include: {
        sections: true,
      },
    });
  }
}

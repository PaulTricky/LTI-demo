import { Entity, Fields, Relations } from 'remult';
import { Question } from './question';
import { Resource } from './resource';

@Entity('sections', {
  allowApiCrud: true,
})
export class Section {
  @Fields.cuid()
  id = '';

  @Fields.string()
  description = '';

  @Fields.string()
  embedLink: string = '';

  @Relations.toMany(() => Question, 'sectionId')
  questions?: Question[];

  @Relations.toOne<Section, Resource>(() => Resource, 'resourceId')
  resource?: Resource;
  @Fields.string({ dbName: 'resource' })
  resourceId: string = '';

  @Fields.createdAt()
  createdAt = new Date();
}

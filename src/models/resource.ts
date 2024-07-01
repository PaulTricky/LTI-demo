import { Entity, Fields, Relations } from 'remult';
import { Question } from './question';
import { Section } from './section';

@Entity('resources', {
  allowApiCrud: true,
})
export class Resource {
  @Fields.cuid()
  id = '';

  @Relations.toMany(() => Section, 'resourceId')
  sections?: Section[];

  @Fields.createdAt()
  createdAt = new Date();
}

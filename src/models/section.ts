import { Entity, Fields, Relations } from 'remult';
import { Question } from './question';

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

  @Fields.createdAt()
  createdAt = new Date();
}

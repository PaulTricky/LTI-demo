import { Allow, Entity, Fields, Relations, remult } from 'remult';
import { Section } from './section';

@Entity('question', {
  allowApiCrud: true,
})
export class Question {
  @Fields.cuid()
  id = '';

  @Fields.string()
  title = '';

  @Fields.json()
  choices = [];

  @Fields.boolean()
  multiple = false;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.string({ dbName: 'section' })
  sectionId = ''; // Custom field to hold the related entity's identifier

  @Relations.toOne<Question, Section>(() => Section, 'sectionId')
  section?: Section;
}

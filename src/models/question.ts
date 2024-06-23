import { Allow, Entity, Fields, remult } from 'remult';

@Entity('questions', {
  allowApiCrud: true,
  // allowApiInsert: 'admin',
})
export class Question {
  @Fields.cuid()
  id = '';
  @Fields.string()
  question = '';
  @Fields.string()
  description = '';
  @Fields.string()
  embedLink = '';
  @Fields.json()
  choices = [];

  @Fields.boolean()
  multiple = false;
}

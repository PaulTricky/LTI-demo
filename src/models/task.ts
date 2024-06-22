import { Allow, Entity, Fields, remult } from 'remult';

@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: 'admin',
})
export class Task {
  @Fields.cuid()
  id = '';
  @Fields.string({
    validate: (e, fieldValidationEvent) => {
      if (fieldValidationEvent.value.length < 2) {
        throw Error('Length is short');
      }
    },
  })
  title = '';
  @Fields.boolean()
  completed = false;
  @Fields.createdAt()
  createdAt = new Date();
}

import * as yup from 'yup';

yup.addMethod(yup.array, "unique", function (
  message,
  mapper = (val: unknown) => val
) {
  return this.test(
    "unique",
    message,
    (list = []) => list.length === new Set(list.map(mapper)).size
  );
});

export const validationSchema = yup.object().shape({
  question: yup.string().required('required'),
  description: yup.string(),
  embedLink: yup.string().required(),
  choices: (yup.array(yup.object({
    title: yup.string().required("Choice is required"),
    correct: yup.string().required(),
  })).min(2, 'At least 2 choices') as any).unique("Choice list must be unique", (val: any) => val.title),
  multiple: yup.bool(),
  answer: yup.array()
});

export const defaultValues = {
  question: '',
  description: '',
  embedLink: '',
  choices: [],
  multiple: false,
  answer: []
}
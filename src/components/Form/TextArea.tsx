import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

const TextAreaForm = ({
  form,
  label,
  field,
  required = false,
  className,
  placeholder = '',
  ...props
}: any) => {
  return (
    <FormField
      control={form.control}
      name={field}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel className='text-[#000000e0] flex items-center gap-1 font-medium'>
              {label}
            </FormLabel>
            <FormControl>
              <Textarea placeholder={placeholder} {...field} {...props} className='bg-[#e8e8e8]' />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextAreaForm;

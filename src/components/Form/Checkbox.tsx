import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Checkbox } from "../ui/checkbox"

const CheckboxForm = ({ form, label, field, required = false, placeholder, defaultValue }: {
  form: any;
  label: string | React.ReactNode;
  field: string;
  placeholder?: string;
  required?: boolean
  defaultValue?: any;
}) => {
  return (
    <FormField
    control={form.control}
    name={field}
    render={({field}) => {
      return <FormItem className="space-y-0 flex gap-4 items-center" defaultChecked={defaultValue}>
      <FormControl defaultChecked={defaultValue}>
        <Checkbox onCheckedChange={field.onChange} checked={field.value} defaultChecked={field.value}  {...field} className="" required={required} />
      </FormControl>
      <FormLabel className="text-[#000000e0] font-medium">{label}</FormLabel>
      <FormMessage />
    </FormItem>
    }}
    />
  )
}

export default CheckboxForm;


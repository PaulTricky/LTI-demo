import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { HTMLInputTypeAttribute, useState } from "react";

const InputForm = ({ className, form, label = '', field, placeholder, required = false, defaultValue, type = 'text', onChange, ...props }: {
  form: any;
  label: string | React.ReactNode;
  field: string;
  placeholder?: string;
  required?: boolean
  defaultValue?: any;
  type?: HTMLInputTypeAttribute | undefined
  onChange?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  [x: string]: any;
}) => {
  return (
    <FormField
    control={form.control}
    name={field}
    render={({ field }: any) => {
      return <FormItem defaultValue={defaultValue} className={className}>
      <FormLabel className="text-[#000000e0] flex gap-1 font-medium">{label}</FormLabel>
      <FormControl defaultValue={defaultValue}>
        <Input type={type} placeholder={placeholder ? placeholder : ''} {...field} {...props} className="bg-[#e8e8e8]" onChange={(e) => {
          field.onChange({...e, target: {
            ...e.target,
            value: type === 'number' ? (!isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : undefined) : (e.target.value || undefined)
          }});
          onChange?.(e);
        }} required={required} />
      </FormControl>
      <FormMessage />
    </FormItem>
    }}
    />
  )
}

export default InputForm;
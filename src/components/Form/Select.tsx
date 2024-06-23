import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const SelectForm = ({ disabled, form, options, label, required, field, defaultValue, showGroupLabel = true, renderLabel, labelClassName, selectClassName, className, placeholder = 'Select' }: {
  form: any,
  options: {label: string, value: string | number}[];
  label: ReactNode;
  field: string;
  renderLabel?: (opt: {label: string, value: string | number}) => ReactNode;
  labelClassName?: string;
  selectClassName?: string;
  showGroupLabel?: boolean;
  className?: string;
  placeholder?: string
  defaultValue?: string
  required?: boolean;
  disabled?: boolean;
}) => {
  return (
  
    <FormField
    control={form.control}
    name={field}
    render={({field}) => {
      return <FormItem className={cn(className)} defaultValue={defaultValue}>
        <FormLabel className={cn(labelClassName, "text-[#000000e0] font-medium flex items-center gap-1")}>{label} {required ? <span className="text-[11px] text-[#df1b00]">*</span> : ''}</FormLabel>
        <FormControl>
        <Select disabled={disabled} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
          <SelectTrigger className={cn("w-full bg-[#e8e8e8]", selectClassName)}>
          <SelectValue className="w-full" placeholder={<div className="text-muted-foreground">{placeholder}</div>} />
          </SelectTrigger>
          <SelectContent className={cn("w-full h-[300px]")}>
            <SelectGroup>
              {showGroupLabel && <SelectLabel className="text-[#000000e0] font-medium">{label}</SelectLabel>}
              {options?.map(opt => <SelectItem key={opt.value} value={opt.value as string}>{renderLabel ? renderLabel(opt) : opt.label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    }}
    />
  )
}

export default SelectForm;